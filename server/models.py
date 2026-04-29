from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# initialize database
db = SQLAlchemy()


# User model (students and tutors)
class User(db.Model):
    __tablename__ = "users"  # table name

    id = db.Column(db.Integer, primary_key=True)  # unique id
    username = db.Column(db.String(80), nullable=False, unique=True)  # username
    email = db.Column(db.String(120), nullable=False, unique=True)  # email
    password_hash = db.Column(db.String(255), nullable=False)  # hashed password
    role = db.Column(db.String(20), nullable=False, default="student")  # role (student or tutor)

    # one-to-one relationship with TutorProfile
    tutor_profile = db.relationship(
        "TutorProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # one-to-many: user -> bookings
    bookings = db.relationship(
        "Booking",
        back_populates="student",
        cascade="all, delete-orphan"
    )

    # one-to-many: user -> reviews
    reviews = db.relationship(
        "Review",
        back_populates="student",
        cascade="all, delete-orphan"
    )


# Tutor profile model
class TutorProfile(db.Model):
    __tablename__ = "tutor_profiles"

    id = db.Column(db.Integer, primary_key=True)  # profile id
    subject = db.Column(db.String(100), nullable=False)  # subject (math, english, etc.)
    location = db.Column(db.String(120), nullable=False)  # location
    hourly_rate = db.Column(db.Float, nullable=False)  # price per hour
    bio = db.Column(db.Text, nullable=True)  # description

    # foreign key to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # relationship back to user
    user = db.relationship("User", back_populates="tutor_profile")

    # one-to-many: tutor -> bookings
    bookings = db.relationship(
        "Booking",
        back_populates="tutor",
        cascade="all, delete-orphan"
    )

    # one-to-many: tutor -> reviews
    reviews = db.relationship(
        "Review",
        back_populates="tutor",
        cascade="all, delete-orphan"
    )


# Booking model (lesson reservations)
class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)  # booking id
    lesson_date = db.Column(db.String(50), nullable=False)  # date of lesson
    status = db.Column(db.String(30), nullable=False, default="pending")  # booking status

    # foreign keys
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey("tutor_profiles.id"), nullable=False)

    # relationships
    student = db.relationship("User", back_populates="bookings")
    tutor = db.relationship("TutorProfile", back_populates="bookings")


# Review model (feedback from students)
class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)  # review id
    rating = db.Column(db.Integer, nullable=False)  # rating (1-5)
    comment = db.Column(db.Text, nullable=True)  # review text
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) # date created

    # foreign keys
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey("tutor_profiles.id"), nullable=False)

    # relationships
    student = db.relationship("User", back_populates="reviews")
    tutor = db.relationship("TutorProfile", back_populates="reviews")