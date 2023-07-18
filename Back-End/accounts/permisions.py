from rest_framework.permissions import BasePermission


class NotAuthenticated(BasePermission):
    message = "You already have an account. You can't register again."

    def has_permission(self, request, view):
        """
        Check if the user is not authenticated.
        Returns True if the user is not authenticated, False otherwise.
        """
        if request.user.is_authenticated:
            return False
        else:
            return True
