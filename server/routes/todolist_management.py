from flask import jsonify, request
from models import db, ToDoList, Contact
from config import app


@app.route('/lists', methods=['POST'])
def add_list():
    try:
        data = request.json
        title = data.get('title')
        contact_id = data.get('contact_id')

        # Validate required fields
        if not title or not contact_id:
            return jsonify({'message': 'Title and Contact ID are required'}), 400

        # Check if contact exists
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({'message': 'Contact not found'}), 404

        # Create a new list instance
        new_list = ToDoList(title=title, contact_id=contact_id)

        # Add the new list to the database
        db.session.add(new_list)
        db.session.commit()

        return jsonify(new_list.to_dict()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@app.route('/lists/<int:contact_id>', methods=['GET'])
def get_lists(contact_id):
    lists = ToDoList.query.filter_by(contact_id=contact_id).all()
    return jsonify([todo_list.to_dict(rules=('-contact', '-todos')) for todo_list in lists])





