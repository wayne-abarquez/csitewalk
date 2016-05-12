from .models import *
from app.constants.projects import *
from app.utils import forms_helper
from .errors import *
from shapely.geometry import Point
from shapely.wkt import dumps
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


def set_coordinates(proj, data):
    if 'coordinates' in data and type(data['coordinates']) is dict:
        point = data['coordinates']
        if all(key in point for key in ('lat', 'lng')):
            point = Point(float(point['lng']), float(point['lat']))
            proj.coordinates = dumps(point)
    elif all(key in data for key in ('latitude', 'longitude')):
        point = Point(float(data['longitude']), float(data['latitude']))
        proj.coordinates = dumps(point)


def save_sections_from_dict(project_id, data):
    proj = Projects.query.get(project_id)

    if proj is None:
        raise ProjectNotFoundError("PROJECT id={0} not found".format(project_id))

    proj.update_from_dict(data, ['id', 'coordinates', 'area', 'sections'])

    set_coordinates(proj, data)
    # TODO
    # set_scip_area(scip, data)

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
            if field_name not in fields:
                field = ProjectFormFields(name=field_name, data=section_data[section_name][field_name])
                fields[field_name] = field
                section.fields.append(field)
            else:
                fields[field_name].data = section_data[section_name][field_name]
    db.session.commit()
    return proj
