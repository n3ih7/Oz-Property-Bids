from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ozpb.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
db.Model.metadata.reflect(db.engine)


class Auth(db.Model):
    __tablename__ = 'auth'
    __table_args__ = {'extend_existing': True}
    email = db.Column('email', db.Text, primary_key=True)


@app.route("/")
def hello():
    # print("Total number of users is", Auth.query.count())
    a = Auth.query.filter_by(password='dwadawd').first()
    return jsonify(a.email), 200


if __name__ == '__main__':
    app.run()
