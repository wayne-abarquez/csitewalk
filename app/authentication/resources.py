from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app import app, rest_api
from .services import *
from .fields import *
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class UsersResource(Resource):
    """
    Resource for Users
    """

    @marshal_with(user_fields)
    def get(self):
        """ GET /users """
        # TODO check authenticated user
        # TODO: Handle logins for 401s and get_solars_for_user
        return get_users()

rest_api.add_resource(UsersResource, '/api/users')
