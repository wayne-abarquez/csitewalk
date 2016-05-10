from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app import rest_api
from .services import *
from .fields import *
from .forms import *
import logging

log = logging.getLogger(__name__)


class ProjectsResource(Resource):
    """
    Resource for Projects
    """

    @marshal_with(project_fields)
    def get(self):
        """ GET /api/projects """
        # TODO check authenticated user
        # TODO: Handle logins for 401s and get_solars_for_user
        # try:
        # solars = solar_service.get_solars_for_user(current_user)
        # log.debug("Scips Resource Data: {0}".format(scips))
        # return solars
        # except scip_service.UserNotAuthorizedError:
        # abort(401, message="Requires user to login")
        # except scip_service.UserRoleInvalidError as err:
        #     abort(403, message=err.message)
        return get_projects_for_user()

    def post(self):
        """ POST api/projects """
        form_data = request.json
        log.debug('Add Project request: {0}'.format(form_data))
        # TODO check authenticated user
        # Validation here
        form = AddProjectForm.from_json(form_data)
        if form.validate():
            obj = create_from_dict(form_data)
            result = dict(status=200, message='OK', project=obj)
            return marshal(result, project_create_fields)
        else:
            abort(400, message="Invalid Parameters", errors=form.errors)


rest_api.add_resource(ProjectsResource, '/api/projects')
