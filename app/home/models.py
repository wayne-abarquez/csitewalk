from app import db
from app.models import BaseModel
from app.authentication.models import Users
from geoalchemy2 import Geometry
from app.constants.projects import ProjectConstants
from app.utils.gis_helper import GISHelper
import json

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
            if 'file' not in section.name:
                data[section.name] = section.get_fields_data()
        return data

    def get_section_files(self):
        # section_files = []
        section_files = dict()
        for section in self.sections:
            if 'files' in section.name:
                files_data = section.get_files_data()
                if files_data is not None:
                    if section.name not in section_files:
                        section_files[section.name] = dict()

                    for file in files_data:
                        section_files[section.name][file['modelname']] = file
                    # data = section.to_dict()
                    # data['files'] = files_data
                    # section_files.append(data)
                    # section_files[section.name] = data

        return section_files


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

    def get_files(self):
        data = dict()

        for _file in self.files:
            data[_file.modelname] = _file
        return data

    def get_files_data(self):
        files = []
        for _file in self.files:
            filedict = _file.to_dict()
            filedict['date_created'] = filedict['date_created'].isoformat()
            filedict['date_modified'] = filedict['date_modified'].isoformat()
            filedict['coordinates'] = GISHelper.point_to_latlng_dict(filedict['coordinates'])
            files.append(filedict)
        return files


class ProjectFormFields(BaseModel):
    section_id = db.Column(db.Integer, db.ForeignKey('project_form_sections.id'))
    name = db.Column(db.String(100))
    data = db.Column(db.Text)

    section = db.relationship(ProjectFormSections, backref='fields')


class ProjectFiles(BaseModel):
    section_id = db.Column(db.Integer, db.ForeignKey('project_form_sections.id'))
    modelname = db.Column(db.String(100))
    filename = db.Column(db.Text)
    filetype = db.Column(db.String(5))
    coordinates = db.Column(Geometry('POINT'))
    heading = db.Column(db.Integer)

    section = db.relationship(ProjectFormSections, backref='files')
