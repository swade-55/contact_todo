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

@app.route('/contacts/<int:company_id>', methods=['GET'])
def get_contacts(company_id):
    try:
        contacts = Contact.query.filter_by(company_id=company_id).all()
        if not contacts:
            return jsonify({'message': 'No contacts found for this company'}), 404
        return jsonify([contact.to_dict() for contact in contacts])
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    
@app.route('/contacts-lists', methods=['GET'])
def get_all_contacts_and_lists_tags():
    try:
        # Retrieve all contacts
        contacts = Contact.query.all()
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
    
    
@app.route('/company-contacts-lists/<int:company_id>', methods=['GET'])
def get_company_contacts_and_lists(company_id):
    try:
        print(f"Fetching contacts for company ID: {company_id}")
        contacts = Contact.query.filter_by(company_id=company_id).all()
        if not contacts:
            print("No contacts found for this company.")
            return jsonify({'message': 'No contacts found for this company'}), 404

        contacts_data = []
        for contact in contacts:
            print(f"Processing contact ID: {contact.id}")
            contact_data = contact.to_dict()  # Using serialize method

            lists_data = []
            todo_lists = ToDoList.query.filter_by(contact_id=contact.id).all()
            for todo_list in todo_lists:
                print(f"Processing todo list ID: {todo_list.id}")
                list_data = todo_list.to_dict()  # Using serialize method

                lists_data.append(list_data)

            contact_data['lists'] = lists_data
            contacts_data.append(contact_data)


        print("Data retrieval successful.")
        return jsonify(contacts_data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'message': str(e)}), 500
    

@app.route('/contact-lists-todos/<int:contact_id>', methods=['GET'])
def get_contact_lists_and_todos(contact_id):
    try:
        # Retrieve the lists for the contact
        todo_lists = ToDoList.query.filter_by(contact_id=contact_id).all()
        if not todo_lists:
            return jsonify({'message': 'No lists found for this contact'}), 404
        
        # Serialize the lists and include todos
        lists_data = []
        for todo_list in todo_lists:
            # Serialize list data
            list_data = todo_list.to_dict(rules=('-contact', '-todos'))
            
            # Retrieve and serialize todos for this list
            todos = ToDo.query.filter_by(list_id=todo_list.id).all()
            list_data['todos'] = [todo.to_dict() for todo in todos]
            
            # Append the list data with todos to the lists_data list
            lists_data.append(list_data)
        
        # Return the lists data with todos
        return jsonify(lists_data)
    except Exception as e:
        # Handle general exceptions
        return jsonify({'message': str(e)}), 500
    
    
@app.route('/all-lists-todos', methods=['GET'])
def get_all_lists_and_todos():
    try:
        # Retrieve all the lists
        todo_lists = ToDoList.query.all()
        if not todo_lists:
            return jsonify({'message': 'No lists found'}), 404
        
        # Serialize the lists and include todos
        lists_data = []
        for todo_list in todo_lists:
            # Serialize list data
            list_data = todo_list.to_dict(rules=('-contact', '-todos'))
            
            # Retrieve and serialize todos for this list
            todos = ToDo.query.filter_by(list_id=todo_list.id).all()
            list_data['todos'] = [todo.to_dict() for todo in todos]
            
            # Append the list data with todos to the lists_data list
            lists_data.append(list_data)
        
        # Return the lists data with todos
        return jsonify(lists_data)
    except Exception as e:
        # Handle general exceptions
        return jsonify({'message': str(e)}), 500
