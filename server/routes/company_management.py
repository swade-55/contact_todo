from flask import jsonify, request
from models import db, User, Company, ToDoList, Contact, ToDo
from config import app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
# from  werkzeug import secure_filename, FileStorage
import os

    
    
@app.route('/companies/<int:user_id>', methods=['GET'])
def get_companies(user_id):
    companies = Company.query.filter_by(manager_id=user_id).all()
    companies_data = [c.to_dict() for c in companies]
    return jsonify(companies_data)

# @app.route('/companies/<int:company_id>', methods=['PATCH'])
# def update_company(company_id):
#     try:
#         breakpoint()
#         # Fetch the company based on company_id
#         company = Company.query.get(company_id)
#         if not company:
#             return jsonify({'message': 'Company not found'}), 404

#         data = request.json
#         if 'name' in data:
#             company.name = data['name']
        
#         if 'manager_id' in data:
#             manager = User.query.get(data['manager_id'])
#             if not manager:
#                 return jsonify({'message': 'Manager not found'}), 404
#             company.manager_id = data['manager_id']

#         if 'image' in request.files:
#             image = request.files['image']
#             filename = secure_filename(image.filename)
#             filepath = os.path.join('/path/to/upload/directory', filename)
#             image.save(filepath)
#             company.image_path = filepath
        
#         db.session.commit()
#         return jsonify(company.to_dict()), 200
#     except Exception as e:
#         # Handle exceptions and errors
#         return jsonify({'message': str(e)}), 500

@app.route('/companies/<int:company_id>', methods=['PATCH'])
def update_company(company_id):
    try:
        # breakpoint()
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'message': 'Company not found'}), 404

        # Assuming data comes as FormData (multipart/form-data)
        name = request.form.get('name')
        manager_id = request.form.get('manager_id')
        image = request.files.get('image')

        # Update company data if provided
        if name:
            company.name = name
        if manager_id:
            manager = User.query.get(manager_id)
            if not manager:
                return jsonify({'message': 'Manager not found'}), 404
            company.manager_id = manager_id

        # Handle new image upload
        if image:
            filename = secure_filename(image.filename)
            image_folder = app.config['UPLOADED_IMAGES_DEST']
            os.makedirs(image_folder, exist_ok=True)
            image_path = os.path.join(image_folder, filename)
            image.save(image_path)
            company.image_path = image_path

        db.session.commit()
        return jsonify(company.to_dict()), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

    
    
@app.route('/companies', methods=['POST'])
def add_company():
    try:
        # Extract data from the request
        name = request.form.get('name')
        manager_id = request.form.get('manager_id')
        image = request.files.get('image')

        # Validate required fields
        if not name or not manager_id:
            return jsonify({'message': 'Name and Manager ID are required'}), 400

        # Check if manager exists
        manager = User.query.get(manager_id)
        if not manager:
            return jsonify({'message': 'Manager not found'}), 404

        # Create a new company instance
        new_company = Company(name=name, manager_id=manager_id)

        # Handle file upload
        if image:
            filename = secure_filename(image.filename)
            image_folder = app.config['UPLOADED_IMAGES_DEST']

            # Ensure the directory exists
            os.makedirs(image_folder, exist_ok=True)

            image_path = os.path.join(image_folder, filename)
            image.save(image_path)
            new_company.image_path = image_path  # Set image_path if an image was uploaded

        # Add the new company to the database
        db.session.add(new_company)
        db.session.commit()

        return jsonify(new_company.to_dict()), 201
    except Exception as e:
        breakpoint()
        # Handle exceptions and errors
        return jsonify({'message': str(e)}), 500


@app.route('/companies/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    try:
        company = Company.query.get(company_id)
        if not company:
            return jsonify({"message": "Company not found"}), 404

        if company.image_path:
            try:
                os.remove(company.image_path)
            except OSError as e:
                print(f"Error deleting image file: {e.strerror}")

        db.session.delete(company)
        db.session.commit()

        return jsonify({"message": "Company and all associated contacts, ToDoLists, and ToDos deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Roll back in case of error
        return jsonify({"message": str(e)}), 500


        
    
