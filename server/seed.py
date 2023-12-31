from models import db, Company, Contact, ToDoList, ToDo, User, Tag
from datetime import datetime, timedelta
from faker import Faker
import random

from config import app  # Ensure this is the correct path to your Flask app

faker = Faker()

# Function to clear existing data
def clear_data():
    db.session.query(ToDo).delete()
    db.session.query(ToDoList).delete()
    db.session.query(Contact).delete()
    db.session.query(Company).delete()
    db.session.query(User).delete()
    db.session.commit()

# Function to create a user named Sam
def add_user(username, email, password_hash):
    user = User(username=username, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    return user

# Function to create a company and assign a manager
def create_company(manager):
    company = Company(name=faker.company(), manager_id=manager.id)
    db.session.add(company)
    db.session.commit()  # commit here to get the company id
    return company

# Function to create a contact for a company
def create_contact(company, manager):
    status = random.choice(["hot", "warm", "cold"])
    contact = Contact(
        name=faker.name(),
        last_contact_date=datetime.now(),  # or use None if you prefer
        status=status,
        company_id=company.id,
        manager_id=manager.id
    )
    db.session.add(contact)
    db.session.commit()  # commit here to get the contact id
    return contact

# Function to create a todo list for a contact
def create_todo_list(contact):
    todo_list = ToDoList(title=faker.bs(), contact=contact)
    db.session.add(todo_list)
    return todo_list

# Function to create todos for a todo list
def create_todos(todo_list, count=5):
    for _ in range(count):
        due_date = datetime.now() + timedelta(days=random.randint(1, 30))
        todo = ToDo(
            title=faker.catch_phrase(),
            description=faker.sentence(),
            completed=random.choice([True, False]),
            date_created=datetime.now(),
            due_date=due_date,
            list=todo_list
        )
        db.session.add(todo)
        
# Function to get or create a tag
def get_or_create_tag(tag_name):
    tag = db.session.query(Tag).filter_by(name=tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
        db.session.commit()  # Ensure tag is committed to get its ID
    return tag

# Main seeding function
def seed_database():
    with app.app_context():
        db.create_all()
        
        clear_data()

        # Add user Sam or get existing user
        sam = db.session.query(User).get(1)
        if not sam:
            sam = add_user('sam', 'sam@example.com', 'hashed_password')
        
        # Create 5 companies with 2 contacts each, and 5 todo lists for each contact
        for _ in range(5):
            company = create_company(sam)
            for _ in range(2):
                contact = create_contact(company, sam)
                todo_list = create_todo_list(contact)
                create_todos(todo_list, 5)  # Pass the number of todos to create

        # Get or create the general tag
        general_tag = get_or_create_tag("General")

        # Associate the general tag with each todo
        todos = ToDo.query.all()
        for todo in todos:
            todo.tags.append(general_tag)

        # Populate the tags table with additional tags
        populate_tags()

        db.session.commit()  # commit after all changes are added
# Function to populate tags
def populate_tags():
    tags = ['Urgent', 'Follow-up', 'Lead', 'Client', 'Potential']
    for name in tags:
        # Check if the tag already exists
        existing_tag = db.session.query(Tag).filter_by(name=name).one_or_none()
        if existing_tag is None:
            tag = Tag(name=name)
            db.session.add(tag)
    db.session.commit()  # Commit after adding all new tags

if __name__ == '__main__':
    seed_database()


