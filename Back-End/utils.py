from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_email(email, code, username):
    html_content = render_to_string(
        'email.html', {'code': code, 'username': username, 'email': email})
    text_content = strip_tags(html_content)
    email_instance = EmailMultiAlternatives(
        "email validation",
        text_content,
        to=[email]
    )
    email_instance.attach_alternative(html_content, 'text/html')
    email_instance.send()
