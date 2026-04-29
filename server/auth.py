from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

# create blueprint for auth routes
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# register new user
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # get data from request
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    # check required fields
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    # check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # hash password before saving
    hashed_password = generate_password_hash(password)

    # create new user
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# login user
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # find user by email
    user = User.query.filter_by(email=email).first()

    # check email and password
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # create JWT token
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }), 200


# protected route for current user
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    # get user id from JWT token
    user_id = get_jwt_identity()

    # find user in database
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }), 200