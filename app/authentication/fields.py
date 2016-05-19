from flask.ext.restful import fields

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

# add it on model when called PM = Project Manager
role_fields = dict(
    name=fields.String
)

user_fields = dict(
    id=fields.Integer,
    firstname=fields.String,
    lastname=fields.String,
    fullname=fields.String,
    phone_number=fields.String,
    email=fields.String,
    username=fields.String,
    account_status=fields.String,
    account_created_datetime=fields.DateTime("iso8601"),
    role=fields.Nested(role_fields, allow_null=False),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)
