from flask import jsonify, request
from models import db, User, Company, ToDoList, Contact, ToDo
from config import app



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
    
    
@app.route('/companies/<int:user_id>', methods=['GET'])
def get_companies(user_id):
    companies = Company.query.filter_by(manager_id=user_id).all()
    companies_data = [c.to_dict() for c in companies]
    return jsonify(companies_data)

@app.route('/companies/<int:company_id>', methods=['PATCH'])
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
    
    
@app.route('/companies/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    try:
        company = Company.query.get(company_id)
        if not company:
            return jsonify({"message": "Company not found"}), 404

        # Get all contacts associated with the company
        contacts = Contact.query.filter_by(company_id=company_id).all()

        for contact in contacts:
            # For each contact, get all associated ToDoLists
            todo_lists = ToDoList.query.filter_by(contact_id=contact.id).all()

            for todo_list in todo_lists:
                # For each ToDoList, delete all associated ToDos
                ToDo.query.filter_by(list_id=todo_list.id).delete()

                # Now it's safe to delete the ToDoList
                db.session.delete(todo_list)

            # Once all ToDoLists and ToDos for a contact are deleted, delete the contact itself
            db.session.delete(contact)

        # After all contacts (and their associated ToDoLists and ToDos) are deleted, delete the company
        db.session.delete(company)
        db.session.commit()

        return jsonify({"message": "Company and all associated contacts, ToDoLists, and ToDos deleted"}), 200
    except Exception as e:
        db.session.rollback()  # Ensure transaction is rolled back in case of error
        return jsonify({"message": str(e)}), 500

        
    
