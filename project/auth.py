from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from .models import USER_INFO
from . import db, create_app

app = create_app()
db = SQLAlchemy(app)


@app.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')

    user = USER_INFO.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify(success=False,
                       message='Please check your login details and try again.'), 401

    login_user(user)
    return jsonify(success=True,
                   message="You are successfully logged in"), 200


@app.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    password = request.form.get('password')
    # print(email, password)

    user = USER_INFO.query.filter_by(email=email).first()
    if user:
        return jsonify(success=False,
                       message='Email address already exists'), 400

    new_user = USER_INFO(email=email, password=generate_password_hash(password, method='sha256'))

    db.session.add(new_user)
    db.session.commit()

    return jsonify(success=True,
                   message="You are successfully signed up"), 200


@app.route('/userlist', methods=['GET'])
def userlist():
    a = USER_INFO.query.all()

    return jsonify(str(a)), 200


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify(success=True,
                   message="You are successfully logged out"), 200
