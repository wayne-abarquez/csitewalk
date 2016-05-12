from app import db
from app.models import BaseModel
from app.authentication.models import Users
from geoalchemy2 import Geometry
from app.constants.projects import ProjectConstants


class Contractors(BaseModel):
    name = db.Column(db.String(50), nullable=False)


class Projects(BaseModel):
    project_name = db.Column(db.String(50))
    project_address = db.Column(db.String)
    project_manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_status = db.Column(db.String(10), nullable=False, default=ProjectConstants.IN_PROCESS)
    contractor_id = db.Column(db.Integer, db.ForeignKey('contractors.id'))
    property_owner = db.Column(db.String)
    authority_having_jurisdiction_or_bldg_dept = db.Column(db.Text)
    utility = db.Column(db.String)
    civicsolar_account_manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    coordinates = db.Column(Geometry('POINT'), nullable=False)
    area = db.Column(Geometry('POLYGON'))

    project_manager = db.relationship(Users, foreign_keys=project_manager_id)
    contractor = db.relationship(Contractors, foreign_keys=contractor_id)
    civicsolar_account_manager = db.relationship(Users, foreign_keys=civicsolar_account_manager_id)

    def get_sections(self):
        data = dict()
        for section in self.sections:
            data[section.name] = section
        return data

    def get_sections_data(self):
        data = dict()
        for section in self.sections:
            data[section.name] = section.get_fields_data()
        return data


class ProjectFormSections(BaseModel):
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(100))

    project = db.relationship(Projects, backref='sections')

    def get_fields(self):
        data = dict()
        for field in self.fields:
            data[field.name] = field
        return data

    def get_fields_data(self):
        data = dict()
        for field in self.fields:
            data[field.name] = field.data
        return data


class ProjectFormFields(BaseModel):
    section_id = db.Column(db.Integer, db.ForeignKey('project_form_sections.id'))
    name = db.Column(db.String(100))
    data = db.Column(db.Text)

    section = db.relationship(ProjectFormSections, backref='fields')
