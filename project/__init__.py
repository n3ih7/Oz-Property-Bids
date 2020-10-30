import datetime
import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# from flask_login import LoginManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['REMEMBER_COOKIE_DURATION'] = datetime.timedelta(days=14)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.urandom(24)

    db.init_app(app)

    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()

    # login_manager = LoginManager()
    # login_manager.init_app(app)
    # login_manager.session_protection = None

    # from .models import USER_INFO
    #
    # @login_manager.user_loader
    # def load_user(email):
    #     return USER_INFO.query.get(str(email))

    return app
