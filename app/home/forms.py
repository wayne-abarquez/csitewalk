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
    project_address = StringField([validators.optional()])
    property_owner = StringField([validators.optional()])
    authority_having_jurisdiction_or_bldg_dept = TextAreaField([validators.optional(), validators.length(min=5)])

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

        # load select options from JSON config file
        # filename = 'app/form_schema/add_scip_select_options.json'
        # with open(filename) as json_file:
        #     options = json.load(json_file)
        # config_min_candidates = options['min_candidates'] if 'min_candidates' in options else 5
        # config_client_name = options['client_name'] if 'client_name' in options else []
        # config_tower_type = options['tower_type'] if 'tower_type' in options else []
        # self.min_candidates.choices = [(i + 1, i + 1) for i in xrange(config_min_candidates)]
        # self.client_name.choices = [(name, name) for name in config_client_name]
        # self.tower_type.choices = [(name, name) for name in config_tower_type]

        # set all headers. should probably be set somewhere for localization
        self.project_name.label = "Project Name"
        self.project_address.label = "Project Address"
        self.property_owner.label = "Property Owner"
        self.authority_having_jurisdiction_or_bldg_dept.label = "Authority Having Jurisdiction or Building Department"
        self.project_manager_id.label = "Project Manager"
        self.contractor_id.label = "Contractor"
        self.civicsolar_account_manager_id.label = "CivicSolar Account Manager"

        # additional validators
        # self.project_id.validators = [validators.Regexp('^[a-zA-Z0-9]*$', message="Must Be Alphanumeric")]
        # self.desired_elevation.validators = [validators.NumberRange(min=0, max=sys.maxint, message="Invalid number")]
        # self.desired_height.validators = [validators.NumberRange(min=0, max=sys.maxint, message="Invalid number")]
        # self.lease_area_size.validators = [validators.NumberRange(min=0, message="Invalid number")]

        # def __init__(self, *args, **kwargs):
        #     super(AddProjectForm, self).__init__(*args, **kwargs)
        #
        # def validate(self):
        #     form_data = self.data
        #     is_valid_data = True
        #
        #     rv = ModelForm.validate(self)
        #     if not rv:
        #         is_valid_data = False
        #
        #     if form_data['coordinates'] is None:
        #         self.coordinates.errors.append('Coordinates is Required')
        #         is_valid_data = False
        #
        #     return is_valid_data
