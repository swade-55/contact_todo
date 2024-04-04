from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from flask_jwt_extended import JWTManager
import secrets

secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task_arena.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key
db.init_app(app)

migrate = Migrate(app,db)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})