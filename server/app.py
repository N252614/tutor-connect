from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config
from models import db
from auth import auth_bp
from routes import routes_bp

# create app
app = Flask(__name__)
app.config.from_object(Config)

# init extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app)
app.register_blueprint(auth_bp)
app.register_blueprint(routes_bp)

# simple test route
@app.route("/")
def home():
    return {"message": "TutorConnect API is running"}

# run server
if __name__ == "__main__":
    app.run(debug=True)