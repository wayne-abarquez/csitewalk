from glob import glob
import os
import json
import logging
from app import app

log = logging.getLogger(__name__)

FORM_SCHEMA_DIR = app.config['FORM_SCHEMA_DIR']


def get_form_schemas():
    schemas = []
    for filepath in glob(FORM_SCHEMA_DIR + '*.json'):
        with open(filepath) as json_file:
            try:
                schema = json.load(json_file)
            except:
                log.debug('Cant load ' + filepath)
        filename = os.path.basename(filepath).replace('.json', '')
        schemas.append(dict(name=filename, data=schema))
    return schemas


def update_form_schema(name, json_data):
    schema = json.dumps(json_data, indent=4)
    filename = FORM_SCHEMA_DIR + name + '.json'
    f = open(filename, 'w')
    f.write(schema)
    f.close()
    return
