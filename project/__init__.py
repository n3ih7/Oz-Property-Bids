import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.urandom(24)

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from .models import USER_INFO

    @login_manager.user_loader
    def load_user(user_email):
        return USER_INFO.query.get(str(user_email))

    return app
