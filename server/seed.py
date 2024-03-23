from models import db, Company, Contact, ToDoList, ToDo, User, Tag, ToDoTag
from datetime import datetime, timedelta
from faker import Faker
import random

from config import app  

faker = Faker()

def clear_data():
    db.session.query(ToDoTag).delete()
    db.session.query(ToDo).delete()
    db.session.query(ToDoList).delete()
    db.session.query(Contact).delete()
    db.session.query(Company).delete()
    db.session.query(User).delete()
    db.session.query(Tag).delete()  # Clear existing tags
    db.session.commit()

def create_user():
    user = User(username=faker.user_name(), email=faker.email(), password_hash=faker.sha256())
    db.session.add(user)
    db.session.commit()
    return user

def create_company(user):
    company = Company(name=faker.company(), manager=user)
    db.session.add(company)
    db.session.commit()
    return company

def create_contact(company):
    contact = Contact(name=faker.name(), last_contact_date=datetime.now(), status=random.choice(["hot", "warm", "cold"]), company=company, manager=company.manager)
    db.session.add(contact)
    db.session.commit()
    return contact

def create_todo_list(contact):
    todo_list = ToDoList(title=faker.bs(), contact_id=contact.id)
    db.session.add(todo_list)
    db.session.commit()
    return todo_list

def create_todo_item(todo_list):
    todo = ToDo(title=faker.catch_phrase(), description=faker.sentence(), completed=random.choice([True, False]), date_created=datetime.now(), due_date=datetime.now() + timedelta(days=random.randint(1, 10)), list_id=todo_list.id)
    db.session.add(todo)
    db.session.commit()
    return todo

def create_tag():
    tag_name = faker.word()
    existing_tag = Tag.query.filter_by(name=tag_name).first()
    if existing_tag is None:
        tag = Tag(name=tag_name)
        db.session.add(tag)
        db.session.commit()
        return tag
    else:
        return existing_tag  # Return the existing tag if found

def assign_tag_to_todo(todo, tag):
    todo_tag = ToDoTag(todo_id=todo.id, tag_id=tag.id, assigned_date=datetime.now())
    db.session.add(todo_tag)
    db.session.commit()

def seed_database():
    with app.app_context():
        db.create_all()
        clear_data()

        # user = create_user()

        # for _ in range(5):
        #     company = create_company(user)
        #     for _ in range(5):
        #         contact = create_contact(company)
        #         for _ in range(2):
        #             todo_list = create_todo_list(contact)
        #             for _ in range(2):
        #                 todo = create_todo_item(todo_list)
        #                 tag = create_tag()
        #                 assign_tag_to_todo(todo, tag)

if __name__ == '__main__':
    seed_database()
