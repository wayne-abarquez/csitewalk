from app import db
from faker import Factory
from app.authentication.models import Users, Roles
from app.home.models import Contractors
from app.data.test import roles, users, contractors

fake = Factory.create('en_US')


class SampleData:
    @staticmethod
    def refresh_table(table_name):
        db.session.execute('TRUNCATE "' + table_name + '" RESTART IDENTITY CASCADE')
        db.session.commit()

    @staticmethod
    def load_roles():
        SampleData.refresh_table('roles')

        for data in roles.roles:
            role = Roles.from_dict(data)
            db.session.add(role)

        db.session.commit()

    @staticmethod
    def load_users():
        # Load Roles First
        SampleData.load_roles()

        SampleData.refresh_table('users')

        for data in users.test_users:
            user = Users.from_dict(data)
            user.password = users.test_password
            db.session.add(user)

        db.session.commit()

    @staticmethod
    def load_contractors():
        SampleData.refresh_table('contractors')

        for data in contractors.test_contractors:
            c = Contractors.from_dict(data)
            db.session.add(c)

        db.session.commit()
