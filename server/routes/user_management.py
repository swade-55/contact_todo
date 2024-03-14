from flask import jsonify, request
from models import db, User,Company
from config import app
from werkzeug.security import generate_password_hash
from sqlalchemy.sql import func


@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'User already exists'}), 409

    # Hash password
    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201


#Challenge 4: Posts Ordered by Comment Count
@app.route('/api/users_ordered_by_companies',methods=['GET'])
def posts_comments():
  users = User.query.outerjoin(User.managed_companies).group_by(User.id).order_by(func.count(Company.id).desc()).all()
  return jsonify([user.to_dict() for user in users])