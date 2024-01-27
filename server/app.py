from flask import Flask, jsonify, request, abort
from models import db, User, Company, Contact, ToDoList, ToDo
from config import app
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.security import generate_password_hash


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

    return jsonify(new_user.serialize()), 201

@app.route('/companies/<int:user_id>', methods=['GET'])
def get_companies(user_id):
    companies = Company.query.filter_by(manager_id=user_id).all()
    companies_data = [{'id': c.id, 'name': c.name} for c in companies]  # Manual serialization
    return jsonify(companies_data)


@app.route('/contacts/<int:company_id>', methods=['GET'])
def get_contacts(company_id):
    try:
        contacts = Contact.query.filter_by(company_id=company_id).all()
        if not contacts:
            return jsonify({'message': 'No contacts found for this company'}), 404
        return jsonify([contact.serialize() for contact in contacts])
    except Exception as e:
        return jsonify({'message': str(e)}), 500

    
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


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    new_todo = ToDo(
        title=data['title'],
        description=data['description'],
        list_id=data['list_id']
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

@app.route('/lists', methods=['POST'])
def add_list():
    data = request.json
    new_list = ToDoList(
        title=data['title'],
        contact_id=data['contact_id']
    )
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.to_dict()), 201

@app.route('/contacts/<int:contact_id>', methods=['PATCH'])
def update_contact(contact_id):
    data = request.json
    contact = Contact.query.get(contact_id)
    if not contact:
        abort(404)
    if 'name' in data:
        contact.name = data['name']
    if 'status' in data:
        contact.status = data['status']
    if 'last_contact_date' in data:
        contact.last_contact_date = data['last_contact_date']
    db.session.commit()
    return jsonify(contact.to_dict()), 200
        
@app.route('/company-contacts-lists/<int:company_id>', methods=['GET'])
def get_company_contacts_and_lists(company_id):
    try:
        # Retrieve the contacts for the company
        contacts = Contact.query.filter_by(company_id=company_id).all()
        if not contacts:
            return jsonify({'message': 'No contacts found for this company'}), 404
        
        # For each contact, retrieve the lists and serialize the data
        contacts_data = []
        for contact in contacts:
            # Serialize the contact data
            contact_data = contact.to_dict(rules=('-company', '-todo_lists', '-manager'))
            
            # Retrieve, serialize the lists for this contact, and include todos
            lists_data = []
            todo_lists = ToDoList.query.filter_by(contact_id=contact.id).all()
            for todo_list in todo_lists:
                # Serialize list data
                list_data = todo_list.to_dict(rules=('-contact', '-todos'))
                # Retrieve and serialize todos for this list
                todos = ToDo.query.filter_by(list_id=todo_list.id).all()
                list_data['todos'] = [todo.to_dict() for todo in todos]
                lists_data.append(list_data)
            
            # Add the lists data with todos to the contact's dictionary
            contact_data['lists'] = lists_data
            
            # Append the contact data to the contacts_data list
            contacts_data.append(contact_data)
        
        # Return the combined data
        return jsonify(contacts_data)
    except Exception as e:
        # Handle general exceptions
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
    
    
@app.route('/contacts-lists', methods=['GET'])
def get_all_contacts_and_lists():
    try:
        # Retrieve the contacts for the company
        contacts = Contact.query.all()
        if not contacts:
            return jsonify({'message': 'No contacts found for this company'}), 404
        
        # For each contact, retrieve the lists and serialize the data
        contacts_data = []
        for contact in contacts:
            # Serialize the contact data
            contact_data = contact.to_dict(rules=('-company', '-todo_lists', '-manager'))
            
            # Retrieve, serialize the lists for this contact, and include todos
            lists_data = []
            todo_lists = ToDoList.query.filter_by(contact_id=contact.id).all()
            for todo_list in todo_lists:
                # Serialize list data
                list_data = todo_list.to_dict(rules=('-contact', '-todos'))
                # Retrieve and serialize todos for this list
                todos = ToDo.query.filter_by(list_id=todo_list.id).all()
                list_data['todos'] = [todo.to_dict() for todo in todos]
                lists_data.append(list_data)
            
            # Add the lists data with todos to the contact's dictionary
            contact_data['lists'] = lists_data
            
            # Append the contact data to the contacts_data list
            contacts_data.append(contact_data)
    
        # Return the combined data
        return jsonify(contacts_data)
    except Exception as e:
        # Handle general exceptions
        return jsonify({'message': str(e)}), 500


@app.route('/lists/<int:contact_id>', methods=['GET'])
def get_lists(contact_id):
    lists = ToDoList.query.filter_by(contact_id=contact_id).all()
    return jsonify([todo_list.to_dict(rules=('-contact', '-todos')) for todo_list in lists])

@app.route('/todos/<int:list_id>', methods=['GET'])
def get_todos(list_id):
    todos = ToDo.query.filter_by(list_id=list_id).all()
    return jsonify([todo.to_dict(rules=('-list', '-tags')) for todo in todos])


@app.route('/lists-for-contact/<int:contact_id>', methods=['GET'])
def get_lists_for_contact(contact_id):
    # Query to get all ToDoList items for the given contact_id
    todo_lists = ToDoList.query.filter_by(contact_id=contact_id).all()
    
    # Construct an array of dictionaries with just the list 'id' and 'title'
    lists_data = [{'id': todo_list.id, 'title': todo_list.title} for todo_list in todo_lists]

    # Return the array of list titles as a JSON response
    return jsonify(lists_data), 200


@app.route('/companies/<int:company_id>', methods=['PUT', 'PATCH'])
def update_company(company_id):
    try:
        # Fetch the company based on company_id
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'message': 'Company not found'}), 404

        data = request.json
        if 'name' in data:
            company.name = data['name']
        
        if 'manager_id' in data:
            manager = User.query.get(data['manager_id'])
            if not manager:
                return jsonify({'message': 'Manager not found'}), 404
            company.manager_id = data['manager_id']
        
        db.session.commit()
        return jsonify(company.to_dict()), 200
    except Exception as e:
        # Handle exceptions and errors
        return jsonify({'message': str(e)}), 500
    

@app.route('/companies', methods=['POST'])
def add_company():
    try:
        # Extract data from the request
        data = request.json
        name = data.get('name')
        manager_id = data.get('manager_id')

        # Validate required fields
        if not name or not manager_id:
            return jsonify({'message': 'Name and Manager ID are required'}), 400

        # Check if manager exists
        manager = User.query.get(manager_id)
        if not manager:
            return jsonify({'message': 'Manager not found'}), 404

        # Create a new company instance
        new_company = Company(name=name, manager_id=manager_id)

        # Add the new company to the database
        db.session.add(new_company)
        db.session.commit()

        return jsonify(new_company.to_dict()), 201
    except Exception as e:
        # Handle exceptions and errors
        return jsonify({'message': str(e)}), 500

  
if __name__ == '__main__':
    app.run(debug=True)  
    