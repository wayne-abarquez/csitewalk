from flask.ext.restful import fields


schema_fields = dict(
    name=fields.String,
    data=fields.Raw
)
