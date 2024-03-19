from flask import jsonify, request
from models import db, Tag
from config import app


@app.route('/tags', methods=['GET'])
def get_all_tags():
    try:
        tags = Tag.query.all()
        tags_data = [tag.to_dict() for tag in tags]
        return jsonify(tags_data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    
@app.route('/tags', methods=['POST'])
def add_tag():
    data = request.json
    name = data.get('name')
    existing_tag = Tag.query.filter_by(name=name).first()
    if existing_tag is not None:
        return jsonify({'message': 'Tag already exists'}), 409

    new_tag = Tag(name=name)

    db.session.add(new_tag)
    db.session.commit()

    return jsonify(new_tag.to_dict()), 201
