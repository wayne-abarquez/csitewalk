from .models import *


def get_users():
    return Users.query.all()
