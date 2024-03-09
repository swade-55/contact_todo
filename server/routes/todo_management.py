from flask import jsonify, request
from models import db, ToDo, Tag
from config import app
from datetime import datetime


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    due_date = data.get('dueDate')
    if due_date:
        due_date = datetime.fromisoformat(due_date.rstrip('Z'))
    
    # Create the new ToDo instance
    new_todo = ToDo(
        title=data['title'],
        description=data['description'],
        completed=data['completed'],
        due_date=due_date,
        list_id=data['listId'],
    )
    
    # Process tags if provided
    tag_ids = data.get('tags', []) 
    for tag_id in tag_ids:
        tag = Tag.query.get(tag_id) 
        if tag:
            new_todo.tags.append(tag)  
        else:
            pass
    
    db.session.add(new_todo)
    db.session.commit()
    
    # Modify the return to include tags in the response if needed
    return jsonify(new_todo.to_dict()), 201

@app.route('/todos/<int:list_id>', methods=['GET'])
def get_todos(list_id):
    todos = ToDo.query.filter_by(list_id=list_id).all()
    return jsonify([todo.to_dict(rules=('-list', '-tags')) for todo in todos])
