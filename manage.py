from app import app
from app import db
from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand
from app.data.sample_data import SampleData
from app.authentication.models import *
from app.home.models import *


manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    db.create_all()
    print "Initialized the Database"


@manager.command
def dropdb():
    if prompt_bool("Are you sure you want to Drop your Database?"):
        db.drop_all()
        print "Database Dropped"


@manager.command
def create_test_users():
    SampleData.load_users()
    print "Created test users"


@manager.command
def create_test_contractors():
    SampleData.load_contractors()
    print "Created test contractors"


if __name__ == '__main__':
    manager.run()
