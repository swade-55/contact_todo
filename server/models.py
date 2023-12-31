from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin


db = SQLAlchemy()

todo_tags = db.Table(
    'todo_tags',
    db.Column('todo_id',db.Integer,db.ForeignKey('todo.id'),primary_key=True),
    db.Column('tag_id',db.Integer,db.ForeignKey('tag.id'),primary_key=True)
    
)

class Company(db.Model, SerializerMixin):
    __tablename__ = 'company'
    
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    manager_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    
    #Relationships
    contacts = db.relationship('Contact',backref='company',lazy='dynamic')
    
    def __repr__(self):
        return f'<Company {self.name}>'

class User(db.Model,SerializerMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    
    #Relationships
    managed_companies = db.relationship('Company',backref='manager',lazy=True)
    managed_contacts = db.relationship('Contact',backref='manager',lazy=True)
    
    
    
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
    todo_lists = db.relationship('ToDoList',backref='contact',lazy=True)
    
    serialize_rules = ('-manager.managed_contacts','-todo_lists.contact')
    
    def __repr__(self):
        return f'<Contact {self.name}>'
    
class ToDoList(db.Model,SerializerMixin):
    __tablename__ = 'list'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    contact_id = db.Column(db.Integer,db.ForeignKey('contact.id'),nullable=False)
    todos = db.relationship('ToDo', backref='list', lazy=True)
    
    serialize_rules = ('-todos.list','-contact.todo_lists')
    
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
    tags = db.relationship('Tag',secondary=todo_tags,lazy='subquery',backref=db.backref('todos',lazy=True))
    
    
    serialize_rules = ('-list','-tags.todos')
    
    def __repr__(self):
        return '<ToDo %r>' % self.description

class Tag(db.Model,SerializerMixin):
    __tablename__ = 'tag'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80),nullable=False,unique=True)
    
    serialize_rules = ('-todos',)
    
    def __repr__(self):
        return '<Tag %r>' % self.name