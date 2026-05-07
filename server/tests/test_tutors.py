# import system tools for file path setup
import sys
import os

# allow test files to access app.py from the parent folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# import Flask app
from app import app


# test getting tutor profiles
def test_should_return_tutors_when_endpoint_is_requested():
    client = app.test_client()

    response = client.get("/api/tutors")

    # check that request was successful
    assert response.status_code == 200