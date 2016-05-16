from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app import rest_api
from PIL import Image
from flask_login import current_user
from .services import *
from .fields import *
from .forms import *
from .dynamic_form import SectionGroup
from .errors import *
from app.utils.gis_helper import GISHelper
import os
import logging

log = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = app.config['ALLOWED_EXTENSIONS']
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']


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


class ProjectDetailsResource(Resource):
    """
    Resource for Project Details
    """

    @marshal_with(project_complete_fields)
    def get(self, project_id):
        """ GET /api/projects/<project_id> """
        log.debug('GET PROJECT details request id={0}'.format(project_id))
        if current_user and current_user.is_authenticated:
            try:
                return get_project_details(project_id)
            except ProjectNotFoundError as err:
                abort(404, message=err.message)
        abort(401, message="Requires user to login")


class ProjectSectionsResource(Resource):
    """
    Resource for Project Sections
    """

    def post(self, project_id):
        """ POST /api/projects/<project_id>/sections """
        request_data = request.json
        log.debug('Update Project Section {0} request: {1}'.format(project_id, request_data))
        if current_user and current_user.is_authenticated:
            sections = request.json['sections'] if 'sections' in request.json else {}

            # Make optional
            pm_id = request_data['project_manager_id']
            request_data['project_manager_id'] = pm_id if pm_id.isdigit() else None

            c_id = request_data['contractor_id']
            request_data['contractor_id'] = c_id if c_id.isdigit() else None

            ca_id = request_data['civicsolar_account_manager_id']
            request_data['civicsolar_account_manager_id'] = ca_id if ca_id.isdigit() else None

            form1 = EditProjectForm.from_json(request_data)
            form2 = SectionGroup.load_from_file('project_general_info', sections)

            is_valid = form1.validate()
            is_valid = form2.validate() and is_valid

            if is_valid:
                try:
                    proj = save_sections_from_dict(project_id, request_data)
                    result = dict(status=200, message="OK", date_modified=proj.date_modified)
                    return marshal(result, update_fields)
                except ProjectNotFoundError as err:
                    abort(404, message=err.message)
            else:
                errors = dict()
                errors.update(form1.errors)
                errors.update(form2.errors)
                abort(400, message="Invalid parameters", errors=errors)
        abort(401, message="Requires user to login")

    def get(self, project_id):
        # if current_user and current_user.is_authenticated:
        proj = Projects.query.get(project_id)
        if proj:
            return proj.get_sections_data()
        abort(404, message="PROJECT id={0} not found".format(project_id))
        # abort(401, message="Requires user to login")


class UploadResource(Resource):
    from app.utils.files_helper import *

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def convert_file(self, filename):
        file_ext = get_file_extension(filename)

        if file_ext == 'pdf':
            return filename

        image = Image.open(UPLOAD_FOLDER + "/" + filename)

        if image.format != 'TIFF':
            return filename

        f, e = os.path.splitext(filename)

        log.debug("Deleting file: {0}".format((UPLOAD_FOLDER + '/' + filename)))
        os.remove(UPLOAD_FOLDER + '/' + filename)

        log.debug("Image is TIFF converting to JPEG")
        filename = f + '.jpeg'

        img_converted = image.convert('RGB')
        img_converted.save(UPLOAD_FOLDER + '/' + filename, "JPEG")

        return filename

    def copy_file(self, uploaded_file):
        filename = generate_filename(uploaded_file.filename)

        uploaded_file.save(os.path.join(UPLOAD_FOLDER, filename))

        return self.convert_file(filename)

    def has_valid_form(self):
        return 'section' in request.form and 'field' in request.form

    def get_form_data(self, filename):
        form = request.form
        field = dict()
        field[form['field']] = filename
        section = dict()
        section[form['section']] = field
        return section

    def get_files_form_data(self, filename):
        form = request.form
        field = dict()
        data = dict()
        data['filename'] = filename

        if 'lat' in form and 'lng' in form:
            data['coordinates'] = {'lat': form['lat'], 'lng': form['lng']}

        if 'heading' in form:
            data['heading'] = form['heading']

        field[form['field']] = data

        section = dict()
        section[form['section']] = field
        return section


class ProjectFilesResource(UploadResource):
    """
    Resource for Project Files
    """

    def post(self, project_id):
        """ POST /api/projects/<project_id>/files """
        log.debug('Update Project File {0} request: {1}'.format(project_id, request.form))

        if current_user and current_user.is_authenticated:
            uploaded_file = request.files['file']
            # TODO: Delete previous associated file before saving new one for good housekeeping
            if self.has_valid_form() and uploaded_file and self.allowed_file(uploaded_file.filename):
                filename = self.copy_file(uploaded_file)
                data = dict(id=project_id, sections=self.get_files_form_data(filename))
                try:
                    file = save_files_from_dict(project_id, data)
                    file.date_created = file.date_created.isoformat()
                    file.date_modified = file.date_modified.isoformat()
                    file.coordinates = GISHelper.point_to_latlng_dict(file.coordinates)
                    filedict = file.to_dict()
                    return dict(status=200, message="OK", file=filedict)
                except ProjectNotFoundError as err:
                    abort(404, message=err.message)
            else:
                abort(400, message="Invalid parameters")
        abort(401, message="Requires user to login")


rest_api.add_resource(ProjectsResource, '/api/projects')
rest_api.add_resource(ProjectDetailsResource, '/api/projects/<int:project_id>')
rest_api.add_resource(ProjectSectionsResource, '/api/projects/<int:project_id>/sections')
rest_api.add_resource(ProjectFilesResource, '/api/projects/<int:project_id>/files')
