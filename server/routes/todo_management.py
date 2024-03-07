from flask import jsonify, request
from models import db, ToDo
from config import app
from datetime import datetime


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    due_date = data.get('dueDate')
    if due_date:
        due_date = datetime.fromisoformat(due_date.rstrip('Z'))
    new_todo = ToDo(
        title=data['title'],
        description=data['description'],
        completed = data['completed'],
        due_date = due_date,
        list_id=data['listId'], 
        
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

@app.route('/todos/<int:list_id>', methods=['GET'])
def get_todos(list_id):
    todos = ToDo.query.filter_by(list_id=list_id).all()
    return jsonify([todo.to_dict(rules=('-list', '-tags')) for todo in todos])
