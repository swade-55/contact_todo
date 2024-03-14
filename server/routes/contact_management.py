from flask import jsonify, request
from models import db, Contact, ToDoList, ToDo
from config import app



@app.route('/contacts',methods=['POST'])
def add_contact():
    data = request.json
    new_contact = Contact(
        name=data['name'],
        status = data['status'],
        company_id = data['company_id'],
        manager_id = data['manager_id']
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.to_dict()),201
    
    
    
@app.route('/contacts-lists/<int:user_id>', methods=['GET'])
def get_all_contacts_and_lists_tags(user_id):
    try:
        # Retrieve all contacts
        contacts = Contact.query.filter_by(manager_id=user_id).all()
        if not contacts:
            return jsonify({'message': 'No contacts found'}), 404
        
        contacts_data = []
        for contact in contacts:
            contact_data = contact.to_dict()  
            
  
            lists_with_todos = []
            for todo_list in contact.todo_lists:
                list_data = todo_list.to_dict()  
                

                todos_data = []
                for todo in todo_list.todos:
                    todo_data = todo.to_dict()  
                    
                    # Serializing tags for each todo
                    tags_data = [tag.to_dict() for tag in todo.tags]
                    todo_data['tags'] = tags_data  
                    
                    todos_data.append(todo_data)
                
                list_data['todos'] = todos_data  
                lists_with_todos.append(list_data)
            
            contact_data['todo_lists'] = lists_with_todos  
            contacts_data.append(contact_data)
        
        return jsonify(contacts_data)
    except Exception as e:
        # Handle general exceptions
        return jsonify({'message': str(e)}), 500
    