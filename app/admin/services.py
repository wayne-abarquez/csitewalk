from glob import glob
import os
import json
import logging

log = logging.getLogger(__name__)

form_schema_dir = 'app/data/form_schema/'


def get_form_schemas():
    schemas = []
    for filepath in glob(form_schema_dir + '*.json'):
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
    filename = form_schema_dir + name + '.json'
    f = open(filename, 'w')
    f.write(schema)
    f.close()
