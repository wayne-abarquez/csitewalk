from .models import *
from app.constants.projects import *
from app.utils import forms_helper
from .errors import *
from shapely.geometry import Point
from shapely.wkt import dumps
from app.utils.files_helper import *
import logging

log = logging.getLogger(__name__)



def get_projects_for_user():
    return Projects.query.all()
    # TODO below
    # if user is None or not user.is_authenticated():
    # raise UserNotAuthorizedError("Need to login")
    # if user.role_name == RoleType.FF:
    #     scips = SCIP.query.all()
    # elif user.role_name == RoleType.PM:
    #     scips = SCIP.query.filter(SCIP.project_manager_id == user.id).all()
    # elif user.role_name == RoleType.IC:
    #     scips = SCIP.query.filter(SCIP.sas_id == user.id, SCIP.status != SCRUBFormConstant.APPROVED).all()
    # elif user.role_name == RoleType.CLIENT:
    #     scips = SCIP.query.filter(SCIP.client_id == user.id, SCIP.status == SCRUBFormConstant.APPROVED).all()
    # else:
    #     raise UserRoleInvalidError("Role '{0}' not allowed".format(user.role_name))
    # return scips


def get_project_details(project_id):
    proj = Projects.query.get(project_id)

    if proj is None:
        raise ProjectNotFoundError("PROJECT id={0} not found".format(project_id))

    data = proj.to_dict()
    data["project_manager"] = proj.project_manager
    data["contractor"] = proj.contractor
    data["civicsolar_account_manager"] = proj.civicsolar_account_manager
    data['sections'] = proj.get_sections_data()
    data['section_files'] = proj.get_section_files()
    # print "Sections: {0}".format(data['sections'])
    print "Sections Files: {0}".format(data['section_files'])
    return data


def create_from_dict(data):
    # Prepare Data
    p = Projects.from_dict(data)
    p.status = ProjectConstants.IN_PROCESS
    p.coordinates = forms_helper.parse_coordinates(data['coordinates'])

    if 'area' in data:
        p.area = forms_helper.parse_area(data['area'])
        log.debug("project has area: {0}".format(p.area))

    # Persist
    db.session.add(p)
    db.session.commit()

    return p


def get_coordinates_dump(data):
    if 'coordinates' in data and type(data['coordinates']) is dict:
        point = data['coordinates']
        if all(key in point for key in ('lat', 'lng')):
            point = Point(float(point['lng']), float(point['lat']))
            return dumps(point)
    elif all(key in data for key in ('latitude', 'longitude')):
        point = Point(float(data['longitude']), float(data['latitude']))
        return dumps(point)


def set_coordinates(proj, data):
    proj.coordinates = get_coordinates_dump(data)


def save_sections_from_dict(project_id, data):
    proj = Projects.query.get(project_id)

    if proj is None:
        raise ProjectNotFoundError("PROJECT id={0} not found".format(project_id))

    proj.update_from_dict(data, ['id', 'coordinates', 'area', 'sections'])

    set_coordinates(proj, data)
    # TODO
    # set_area(proj, data)

    section_data = data['sections'] if 'sections' in data else []
    sections = proj.get_sections()
    for section_name in section_data:
        if section_name not in sections:
            section = ProjectFormSections(name=section_name)
            sections[section_name] = section
            proj.sections.append(section)
        else:
            section = sections[section_name]

        fields = section.get_fields()
        for field_name in section_data[section_name]:
            field_data = section_data[section_name][field_name]
            if field_name not in fields:
                field = ProjectFormFields(name=field_name, data=field_data)
                fields[field_name] = field
                section.fields.append(field)
            else:
                fields[field_name].data = field_data
    db.session.commit()
    return proj


def set_file_geo_data(file, data):
    if 'coordinates' in data:
        file.coordinates = get_coordinates_dump(data)

    if 'heading' in data:
        file.heading = data['heading']


def save_files_from_dict(project_id, data):
    print "Upload Project File Data: {0}".format(data)

    proj = Projects.query.get(project_id)

    if proj is None:
        raise ProjectNotFoundError("PROJECT id={0} not found".format(project_id))

    section_data = data['sections'] if 'sections' in data else []
    print "section data: {0}".format(section_data)
    sections = proj.get_sections()

    section_name = section_data.keys()[0]

    # for section_name in section_data:
    if section_name not in sections:
        section = ProjectFormSections(name=section_name)
        sections[section_name] = section
        proj.sections.append(section)
    else:
        section = sections[section_name]

    files = section.get_files()
    field_name = section_data[section_name].keys()[0]
    # for field_name in section_data[section_name]:

    file_data = section_data[section_name][field_name]

    if is_project_file(field_name, file_data['filename']):
        filename = file_data['filename']
        filext = get_file_extension(filename)

        if field_name not in files:
            _file = ProjectFiles(modelname=field_name, filename=filename, filetype=filext)
            set_file_geo_data(_file, file_data)

            files[field_name] = _file
            section.files.append(_file)
        else:
            files[field_name].filename = filename
            files[field_name].filetype = filext
            set_file_geo_data(files[field_name], file_data)
            _file = files[field_name]

    db.session.commit()
    return _file

