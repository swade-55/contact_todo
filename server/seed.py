from models import db, Company, Contact, ToDoList, ToDo, User, Tag, ToDoTag
from datetime import datetime, timedelta
from faker import Faker
import random

from config import app  # Make sure this imports your Flask app correctly

faker = Faker()

def clear_data():
    db.session.query(ToDoTag).delete()
    db.session.query(ToDo).delete()
    db.session.query(ToDoList).delete()
    db.session.query(Contact).delete()
    db.session.query(Company).delete()
    db.session.query(User).delete()
    db.session.commit()

def create_user():
    user = User(username=faker.user_name(), email=faker.email(), password_hash=faker.sha256())
    db.session.add(user)
    return user

def create_company(user):
    company = Company(name=faker.company(), manager=user)
    db.session.add(company)
    return company

def create_contact(company):
    contact = Contact(name=faker.name(), last_contact_date=datetime.now(), status=random.choice(["hot", "warm", "cold"]), company=company, manager=company.manager)
    db.session.add(contact)
    return contact

def create_todo_list(contact):
    todo_list = ToDoList(title=faker.bs(), contact_id=contact.id)
    db.session.add(todo_list)
    return todo_list

def create_todo_item(todo_list):
    todo = ToDo(title=faker.catch_phrase(), description=faker.sentence(), completed=random.choice([True, False]), date_created=datetime.now(), due_date=datetime.now() + timedelta(days=random.randint(1, 10)), list_id=todo_list.id)
    db.session.add(todo)
    return todo

def create_tag():
    tag = Tag(name=faker.word())
    db.session.add(tag)
    return tag

def assign_tag_to_todo(todo, tag):
    todo.tags.append(tag)

def seed_database():
    with app.app_context():
        db.create_all()
        clear_data()

        user = create_user()
        company = create_company(user)
        contact = create_contact(company)
        todo_list = create_todo_list(contact)
        todo = create_todo_item(todo_list)
        tag = create_tag()

        assign_tag_to_todo(todo, tag)

        db.session.commit()

if __name__ == '__main__':
    seed_database()
