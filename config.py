import os

base_dir = os.path.abspath(os.path.dirname(__file__))

project_name = 'csitewalk'
db_name = 'csitewalk'
db_user = 'csitewalkuser'


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = project_name
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = project_name
    LOG_FILENAME = '/var/www/' + project_name + '/logs/app.log'
    STATIC_FOLDER = '/var/www/' + project_name + '/client/static'
    TEMPLATES_FOLDER = '/var/www/' + project_name + '/client/templates'
    TMP_DIR = '/var/www/' + project_name + '/tmp'
    UPLOAD_FOLDER = '/var/www/' + project_name + '/client/static/uploads'
    ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff'])
    ALLOWED_FILE_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff', 'csv', 'xls', 'xlsx'])
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + db_user + ':youcantguess@localhost:5432/' + db_name
    FORM_SCHEMA_DIR = 'app/data/form_schema/'


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    pass


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)