from flask.ext.restful import Resource
from flask import request
from uuid import uuid4
from werkzeug.utils import secure_filename
from app import app
from PIL import Image
import os
import logging

log = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = app.config['ALLOWED_EXTENSIONS']
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']


class UploadResource(Resource):
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def convert_file(self, filename):
        file_ext = filename.rsplit('.', 1)[1].lower()

        if file_ext == 'pdf':
            return filename

        image = Image.open(UPLOAD_FOLDER + "/" + filename)

        if image.format != 'TIFF':
            return filename

        f, e = os.path.splitext(filename)

        log.debug("Deleting file: {0}".format((UPLOAD_FOLDER + '/' + filename)))
        os.remove(UPLOAD_FOLDER + '/' + filename)

        log.debug("Image is TIFF converting to JPEG")
        filename = f + '.jpeg'

        img_converted = image.convert('RGB')
        img_converted.save(UPLOAD_FOLDER + '/' + filename, "JPEG")

        return filename

    def copy_file(self, uploaded_file):
        filename = str(uuid4()) + os.pathsep + secure_filename(uploaded_file.filename)

        uploaded_file.save(os.path.join(UPLOAD_FOLDER, filename))

        return self.convert_file(filename)

    def has_valid_form(self):
        return 'section' in request.form and 'field' in request.form

    def get_form_data(self, filename):
        form = request.form
        field = dict()
        field[form['field']] = filename
        section = dict()
        section[form['section']] = field
        return section
