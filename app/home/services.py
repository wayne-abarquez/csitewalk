from .models import *
from app.constants.projects import *
from app.utils import forms_helper
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
