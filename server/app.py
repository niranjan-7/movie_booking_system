from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from flask_cors import CORS



app = Flask(__name__)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://movie_booking_fyzi_user:f9oWkkwa7edcxNBMgFE0sUtcNqPYeRjH@dpg-crjv4dqj1k6c73fqko50-a.oregon-postgres.render.com/movie_booking_fyzi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    release_date = db.Column(db.Date, nullable=False)

class Show(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    tickets_left = db.Column(db.Integer, default=100)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


with app.app_context():
    db.create_all()

def create_shows_for_movie(movie):
    today = datetime.utcnow().date()
    for i in range(7):
        show_date = today + timedelta(days=i)
        new_show = Show(movie_id=movie.id, date=show_date, tickets_left=100)
        db.session.add(new_show)
    db.session.commit()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=5))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/validate-token', methods=['POST'])
@jwt_required
def validate_token(current_user):
    return jsonify({'message': 'Token is valid!', 'user': current_user}), 200

@app.route('/movies', methods=['POST'])
@jwt_required()
def add_movie():
    data = request.get_json()
    release_date = datetime.strptime(data['release_date'], '%Y-%m-%d').date()
    new_movie = Movie(name=data['name'], release_date=release_date)
    db.session.add(new_movie)
    db.session.commit()
    create_shows_for_movie(new_movie)
    return jsonify({"message": "Movie and shows created successfully"}), 201


@app.route('/movies/upcoming', methods=['GET'])
def get_upcoming_movies():
    today = datetime.utcnow().date()
    movies = Movie.query.filter(Movie.release_date > today).all()
    result = [{"id": movie.id, "name": movie.name, "release_date": movie.release_date.strftime('%Y-%m-%d')} for movie in movies]
    return jsonify(result), 200


@app.route('/movies/this-week', methods=['GET'])
def get_this_week_movies():
    today = datetime.utcnow().date()
    end_of_week = today + timedelta(days=6)
    movies = Movie.query.filter(Movie.release_date.between(today, end_of_week)).all()
    result = [{"id": movie.id, "name": movie.name, "release_date": movie.release_date.strftime('%Y-%m-%d')} for movie in movies]
    return jsonify(result), 200


@app.route('/bookings', methods=['POST'])
@jwt_required()
def book_show():
    user_id = get_jwt_identity()
    data = request.get_json()
    show_id = data['show_id']
    
    show = Show.query.get(show_id)
    if show and show.tickets_left > 0:
        new_booking = Booking(user_id=user_id, show_id=show_id, date=datetime.utcnow())
        show.tickets_left -= 1
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({"message": "Booking successful"}), 201
    return jsonify({"message": "No tickets left"}), 400


@app.route('/my-bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).all()
    result = [
        {
            "booking_id": booking.id,
            "show_id": booking.show_id,
            "date": booking.date.strftime('%Y-%m-%d %H:%M:%S')
        } for booking in bookings
    ]
    return jsonify(result), 200

@app.route('/cancel-booking/<int:booking_id>', methods=['POST'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first()

    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    
    time_elapsed = datetime.utcnow() - booking.created_at
    if time_elapsed.total_seconds() > 600:  
        return jsonify({"message": "Cancellation window has expired"}), 400

    
    show = Show.query.get(booking.show_id)
    show.tickets_left += 1

    db.session.delete(booking)
    db.session.commit()

    return jsonify({"message": "Booking cancelled successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
