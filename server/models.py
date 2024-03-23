from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin


db = SQLAlchemy()


class ToDoTag(db.Model, SerializerMixin):
    __tablename__ = 'todo_tag'
    id = db.Column(db.Integer,primary_key=True)
    todo_id = db.Column(db.Integer, db.ForeignKey('todo.id'))
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))
    assigned_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    todo = db.relationship('ToDo', back_populates="todo_tags")
    tag = db.relationship('Tag', back_populates="todo_tags")
    
    serialize_rules = ('-todo', '-tag',)
        
    def __repr__(self):
        return f'<ToDoTag todo_id={self.todo_id}, tag_id={self.tag_id}, assigned_date={self.assigned_date}>'
    

class Company(db.Model, SerializerMixin):
    __tablename__ = 'company'
    
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    manager_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    
    #Relationships
    manager = db.relationship('User', back_populates="managed_companies")
    contacts = db.relationship('Contact', back_populates="company", cascade="all, delete")
    
    serialize_rules = ('-manager.managed_contacts','-manager.managed_companies',  '-contacts.company','-contacts.todo_lists','-contacts.manager')
    
    def __repr__(self):
        return f'<Company {self.name}>'

class User(db.Model,SerializerMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    
    #Relationships
    managed_companies = db.relationship('Company', back_populates="manager")
    managed_contacts = db.relationship('Contact', back_populates="manager")
    
    serialize_rules = ('-managed_companies', '-managed_contacts', '-password_hash',)
    def __repr__(self):
        return '<User %r>' % self.username
    
class Contact(db.Model, SerializerMixin):
    __tablename__ = 'contact'
    
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    last_contact_date = db.Column(db.DateTime,nullable=True)
    status = db.Column(db.String(50),nullable=False) # hot,warm,cold
    company_id = db.Column(db.Integer,db.ForeignKey('company.id'))
    manager_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    todo_lists = db.relationship('ToDoList',backref='contact',lazy=True, cascade="all, delete")
    
    company = db.relationship('Company', back_populates="contacts")
    manager = db.relationship('User', back_populates="managed_contacts")
    
    
    serialize_rules = ('-company.contacts','-company.manager', '-manager.managed_contacts','-manager.managed_companies', '-todo_lists.todos',)
        
    
    
    def __repr__(self):
        return f'<Contact {self.name}>'
    
class ToDoList(db.Model,SerializerMixin):
    __tablename__ = 'list'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    contact_id = db.Column(db.Integer,db.ForeignKey('contact.id'),nullable=False)
    todos = db.relationship('ToDo', backref='list', lazy=True, cascade="all, delete")
    
        
    serialize_rules = ('-contact', '-todos.list',)
    
    def __repr__(self):
        return '<List %r>' % self.title
    
class ToDo(db.Model,SerializerMixin):
    __tablename__ = 'todo'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(80), nullable=True)
    completed = db.Column(db.Boolean, nullable=False, default = False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True) 
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    
    tags = db.relationship('Tag', secondary='todo_tag', back_populates="todos",overlaps="todo_tags,tags")
    todo_tags = db.relationship('ToDoTag', back_populates="todo", overlaps="tags,todo_tags")
    
    
    serialize_rules = ('-tags.todo_tags','-tags.todos', '-todo_tags', '-list',)
    
    def __repr__(self):
        return '<ToDo %r>' % self.description

class Tag(db.Model,SerializerMixin):
    __tablename__ = 'tag'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80),nullable=False,unique=True)
    
    todos = db.relationship('ToDo', secondary='todo_tag', back_populates="tags", overlaps="todo_tags,todos")
    todo_tags = db.relationship('ToDoTag', back_populates="tag", overlaps="todos,todo_tags")
    
    serialize_rules = ('-todos', '-todo_tags',)
    
    def __repr__(self):
        return '<Tag %r>' % self.name
    
    
    