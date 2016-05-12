from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app import rest_api
from .services import *
from .fields import *
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class SchemasResource(Resource):
    """
    Resource for getting all FormSchema json files
    """

    @marshal_with(schema_fields)
    def get(self):
        if current_user and current_user.is_authenticated:
            return get_form_schemas()
        abort(401, message="Requires user to login")


class SchemasDetailResource(Resource):
    """
    Resource for FormSchema Detail json files
    """

    def post(self, name):
        if current_user and current_user.is_authenticated:
            update_form_schema(name, request.json)
            return dict(status=200, message="OK")
        abort(401, message="Requires user to login")


rest_api.add_resource(SchemasResource, '/api/form_schemas')
rest_api.add_resource(SchemasDetailResource, '/api/form_schemas/<name>')
