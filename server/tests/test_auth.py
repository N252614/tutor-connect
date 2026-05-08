# import system tools for file path setup
import sys
import os

# allow test files to access app.py from the parent folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# import Flask app, database, and User model
from app import app
from models import db, User


# test user registration with valid data
def test_should_register_user_when_valid_data_is_provided():
    client = app.test_client()

    # remove test user before running the test
    with app.app_context():
        existing_user = User.query.filter_by(username="testuser").first()

        if existing_user:
            db.session.delete(existing_user)
            db.session.commit()

    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "role": "student"
        }
    )

    # check that the user was created successfully
    assert response.status_code == 201

# test user login with correct credentials
def test_should_login_user_when_valid_credentials_are_provided():
    client = app.test_client()

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    # check that login was successful
    assert response.status_code == 200