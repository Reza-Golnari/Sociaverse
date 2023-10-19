from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model

User = get_user_model()


class Poste(models.Model):
    """
    Model representing a Poste (post) in the application.
    """

    title = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    body = RichTextField()
    slug = models.SlugField()
    image = models.ImageField(upload_to="post_pic/%y/%m/%d", blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f'{self.title} by {self.user}'

    def likes_count(self):
        """
        Get the count of likes for the Poste.
        """
        return self.pvotes.count()

    def user_can_like(self, user):
        """
        Check if the given user can like the Poste.
        """
        user_like = user.uvotes.filter(post=self)
        if user_like.exists():
            return True
        return False


class Relation(models.Model):
    """
    Model representing the relationship between two users (following/followers).
    """

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.from_user} follows {self.to_user}'


class Comment(models.Model):
    """
    Model representing a comment on a Poste.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ucomments')
    post = models.ForeignKey(Poste, on_delete=models.CASCADE, related_name='pcomments')
    reply = models.ForeignKey('self', on_delete=models.CASCADE, related_name='rcomments', blank=True, null=True)
    is_reply = models.BooleanField(default=False)
    body = models.TextField(max_length=400,)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.body[:30]}'


class Vote(models.Model):
    """
    Model representing a user's like on a Poste.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uvotes')
    post = models.ForeignKey(Poste, on_delete=models.CASCADE, related_name='pvotes')

    def __str__(self):
        return f'{self.user} liked {self.post}'


class Directs(models.Model):
    """
    Model representing a direct message between users.
    """

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="getter")
    body = models.TextField()
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
