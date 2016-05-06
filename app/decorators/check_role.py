from functools import wraps
from flask import redirect, url_for
from flask_login import current_user


def admin_only(func):
    @wraps(func)
    def wrapper_function(*args, **kwargs):
        if not current_user.is_admin():
            return redirect(url_for('home.index'))
        return func(*args, **kwargs)

    return wrapper_function
