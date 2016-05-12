from faker import Factory

fake = Factory.create('en_US')

test_contractors = []

for _ in range(0, 10):
    test_contractors.append({'name': fake.company()})
