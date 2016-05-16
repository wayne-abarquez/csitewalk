from app import app
from uuid import uuid4
from werkzeug.utils import secure_filename
import os.path

ALLOWED_FILE_EXTENSIONS = app.config['ALLOWED_FILE_EXTENSIONS']

def get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower()

def is_project_file(field_name, data):
    print "filename: {0} data: {1} file extension: {2}".format(field_name, data, get_file_extension(data))
    return 'file' in field_name and get_file_extension(data) in ALLOWED_FILE_EXTENSIONS

def generate_filename(upload_filename):
    return str(uuid4()) + os.pathsep + secure_filename(upload_filename)
