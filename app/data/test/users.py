from faker import Factory

fake = Factory.create('en_US')

test_password = 'password123'

test_users = [
    {
        'username': 'admin',
        'role_id': 1
    },
    {
        'username': 'userpm',
        'role_id': 2
    },
    {
        'username': 'useram',
        'role_id': 3
    },
    {
        'username': 'usercs',
        'role_id': 4
    },
    {
        'username': 'localuser',
        'password': 'localuser',
        'role_id': 4
    }
]

for index, user in enumerate(test_users):
    user['firstname'] = fake.first_name()
    user['lastname'] = fake.last_name()
    user['phone_number'] = fake.phone_number()
    user['email'] = fake.safe_email()
    test_users[index] = user


civic_admin = {
    'username': 'civic',
    'password': 'solar',
    'role_id': 1,
    'firstname': 'Civic',
    'lastname': 'Solar',
    'phone_number': fake.phone_number(),
    'email': 'csuser@civicsolar.com'
}
