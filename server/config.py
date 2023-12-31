from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task_arena.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

migrate = Migrate(app,db)


# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})