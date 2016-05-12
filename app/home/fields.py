from flask.ext.restful import fields
from app.utils.gis_json_fields import PointToLatLng, PolygonToLatLng
from app.authentication.fields import user_fields
from copy import copy

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

update_fields = dict(
    status=fields.String,
    message=fields.String,
    date_modified=fields.DateTime("iso8601")
)

contractor_fields = dict(
    id=fields.Integer,
    name=fields.String
)

project_fields = dict(
    id=fields.Integer,
    project_name=fields.String,
    project_address=fields.String,
    project_status=fields.String,
    project_manager=fields.Nested(user_fields, allow_null=False),
    contractor=fields.Nested(contractor_fields, allow_null=False),
    property_owner=fields.String,
    authority_having_jurisdiction_or_bldg_dept=fields.String,
    civicsolar_account_manager=fields.Nested(user_fields, allow_null=False),
    utility=fields.String,
    coordinates=PointToLatLng(attribute='coordinates'),
    area=PolygonToLatLng(attribute='area'),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

project_create_fields = dict(
    status=fields.String,
    message=fields.String,
    project=fields.Nested(project_fields, allow_null=False)
)

project_complete_fields = copy(project_fields)
project_complete_fields["sections"] = fields.Raw
