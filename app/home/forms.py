from wtforms_alchemy import ModelForm
from wtforms.fields import SelectField, StringField, TextAreaField
from wtforms import validators
from app.authentication.models import *
from .models import *


class AddProjectForm(ModelForm):
    class Meta:
        model = Projects
        exclude = ['coordinates', 'area', 'project_status']

    project_name = StringField([validators.required(), validators.length(min=3)])
    project_address = TextAreaField([validators.optional()])
    property_owner = StringField([validators.optional()])
    authority_having_jurisdiction_or_bldg_dept = TextAreaField([validators.optional(), validators.length(min=5)])
    utility = StringField([validators.optional()])

    # no need to add these in the excludes since ForeignKeys
    # are not included in WTForm-Alchemy generated fields
    project_manager_id = SelectField(coerce=int)
    contractor_id = SelectField(coerce=int)
    civicsolar_account_manager_id = SelectField(coerce=int)

    def __init__(self, *args, **kwargs):
        super(AddProjectForm, self).__init__(*args, **kwargs)
        # set <select> options as { User.id : User.name } for each PM in db
        # Project Managers Employees in project_managers choices
        project_managers = Users.query.join(Roles).filter(Roles.name.in_([RoleType.PM])).all()
        self.project_manager_id.choices = [(u.id, u.fullname) for u in project_managers]

        # same goes for contractors
        contractors = [(u.id, u.name) for u in Contractors.query.all()]
        self.contractor_id.choices = contractors

        civicsolar_managers = Users.query.join(Roles).filter(Roles.name.in_([RoleType.CSUSER])).all()
        self.civicsolar_account_manager_id.choices = [(u.id, u.fullname) for u in civicsolar_managers]

        # set all headers. should probably be set somewhere for localization
        self.project_name.label = "Project Name"
        self.project_address.label = "Project Address"
        self.property_owner.label = "Property Owner"
        self.authority_having_jurisdiction_or_bldg_dept.label = "Authority Having Jurisdiction or Building Department"
        self.project_manager_id.label = "Project Manager"
        self.utility.label = "Utility"
        self.contractor_id.label = "Contractor"
        self.civicsolar_account_manager_id.label = "CivicSolar Account Manager"

        # additional validators
        self.project_manager_id.validators = [validators.Optional()]
        self.contractor_id.validators = [validators.Optional()]
        self.civicsolar_account_manager_id.validators = [validators.Optional()]


class EditProjectForm(ModelForm):
    class Meta:
        model = Projects
        exclude = [
            'project_name',
            'project_address',
            'coordinates',
            'area',
            'project_status'
        ]

    # no need to add these in the excludes since ForeignKeys
    # are not included in WTForm-Alchemy generated fields
    # project_name = StringField([validators.required(), validators.length(min=3)])

    project_manager_id = SelectField(coerce=int)
    contractor_id = SelectField(coerce=int)
    property_owner = StringField([validators.optional()])
    project_status = SelectField(choices=ProjectConstants.statuses)
    project_address = TextAreaField([validators.optional()])
    authority_having_jurisdiction_or_bldg_dept = TextAreaField([validators.optional(), validators.length(min=5)])
    utility = StringField([validators.optional()])
    civicsolar_account_manager_id = SelectField(coerce=int)

    def __init__(self, *args, **kwargs):
        super(EditProjectForm, self).__init__(*args, **kwargs)
        # set <select> options as { User.id : User.name } for each PM in db
        # Project Managers Employees in project_managers choices
        project_managers = Users.query.join(Roles).filter(Roles.name.in_([RoleType.PM])).all()
        self.project_manager_id.choices = [(u.id, u.fullname) for u in project_managers]

        # same goes for contractors
        contractors = [(u.id, u.name) for u in Contractors.query.all()]
        self.contractor_id.choices = contractors

        civicsolar_managers = Users.query.join(Roles).filter(Roles.name.in_([RoleType.CSUSER])).all()
        self.civicsolar_account_manager_id.choices = [(u.id, u.fullname) for u in civicsolar_managers]

        # set all headers. should probably be set somewhere for localization
        # self.project_name.label = "Project Name"
        self.project_address.label = "Project Address"
        self.property_owner.label = "Property Owner"
        self.authority_having_jurisdiction_or_bldg_dept.label = "Authority Having Jurisdiction or Building Department"
        self.utility.label = "Utility"
        self.project_manager_id.label = "Project Manager"
        self.contractor_id.label = "Contractor"
        self.civicsolar_account_manager_id.label = "CivicSolar Account Manager"

        # additional validators
        self.project_manager_id.validators = [validators.Optional()]
        self.contractor_id.validators = [validators.Optional()]
        self.civicsolar_account_manager_id.validators = [validators.Optional()]
