#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from models import User, Book, Rating, Review, user_books
from app import app
from config import db, bcrypt

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        print('Deleting User..')
        User.query.delete()
        print('Creating User..')
        # make sure users have unique usernames
        users = []
        usernames = []


        for _ in range(10):
            first_name = fake.first_name()
            last_name = fake.last_name()

            username = first_name.lower() + last_name.lower()
            while username in usernames:
                username = fake.first_name().lower() + fake.last_name().lower()
            usernames.append(username)
            
            user = User(
                username=username,
                first_name=first_name,
                last_name=last_name
            )

            user.password_hash = user.username + 'password' #We calling password_hash setter method here
            db.session.add(user)
            db.session.commit()

        print('Deleting Book..')
        Book.query.delete()
        print('Creating Book..')

        books_data = [
            {
                "author":"Danielle Bruckert",
                "title": "Always Be Nice",
                "image": "./photos/Always-Be-Nice.png", 
                "pdf": "./pdf/Always-Be-Nice.pdf",
                "views": 5

            },
            {
                "author":"Priyanka",
                "title":"Colours",
                "image":"./photos/colours-bear.png",
                "pdf":"./pdf/colours-bear.pdf",
                "views": 52

            },
            {
                "author":"Angeliki Vorepoulou",
                "title":"The Big Red Balloon",
                "image":"./photos/The-Big-Red-Balloon.png",
                "pdf":"./pdf/The-Big-Red-Balloon.pdf",
                "views": 94
            },
            {
                "author":"Ivan Parvov",
                "title":"The Green Chicken",
                "image":"./photos/The-Green-Chicken.png",
                "pdf":"./pdf/The-Green-Chicken.pdf",
                "views": 54
            },
            {
                "author":"Computer mice",
                "title":"The Good Fox",
                "image":"./photos/The-Good-Fox.png",
                "pdf":"./pdf/The-Good-Fox.pdf",
                "views": 21

            },
            {
                "author":"Allyn Fischer",
                "title":"How Does A Pumpkin Grow",
                "image":"./photos/How-Does-A-Pumpkin-Grow.png",
                "pdf":"./pdf/How-Does-A-Pumpkin-Grow.pdf",
                "views": 10

            },
            {
                "author":"Bel Richardson",
                "title":"Kittens!",
                "image":"./photos/Kittens.png",
                "pdf":"./pdf/Kittens.pdf",
                "views": 87

            },
            {
                "author":"Kahani Goyal",
                "title":"The Cute And Cuddly Koalas",
                "image":"./photos/The-Cute-And-Cuddly-Koalas.png",
                "pdf":"./pdf/The-Cute-And-Cuddly-Koalas.pdf",
                "views": 47

            },
            {
                "author":"Unknown",
                "title":"12 Days Of Christmas",
                "image":"./photos/12-Days-Of-Christmas.png",
                "pdf":"./pdf/12-Days-Of-Christmas.pdf",
                "views": 57

            },
            {
                "author":"Rebecca Bielawski",
                "title":"Alphabeti Cool",
                "image":"./photos/Alphabeti-Cool.png",
                "pdf":"./pdf/Alphabeti-Cool.pdf",
                "views": 50

            }
        ]
        for book_info in books_data:
            # print("Adding book:", book_info)
            book = Book(**book_info)
            db.session.add(book)

        # Commit the changes
        db.session.commit()


        print('Deleting Rating..')
        Rating.query.delete()
        print('Creating Rating..')

        ratings=[]
        # user = User.query.get(users.id)
        # book = Book.query.get(books.id)
        rating1=Rating(value=5, user_id=4, book_id=5)
        ratings.append(rating1)
        rating2=Rating(value=3, user_id=5, book_id=2)
        ratings.append(rating2)
        rating3=Rating(value=4, user_id=6, book_id=1)
        ratings.append(rating3)
        rating4=Rating(value=5, user_id=7, book_id=3)
        ratings.append(rating4)
        rating5=Rating(value=4, user_id=8, book_id=4)
        ratings.append(rating5)
        rating6=Rating(value=5, user_id=9, book_id=6)
        ratings.append(rating6)
        rating7=Rating(value=4, user_id=10, book_id=7)
        ratings.append(rating7)
        db.session.add_all(ratings)
        db.session.commit()

        print('Deleting Review..')
        Review.query.delete()
        print('Creating Review..')

        reviews=[]
        review1=Review(content="An excellent book", user_id=5, book_id=5)
        reviews.append(review1)
        review2=Review(content="Highly Recommended", user_id=9, book_id=3)
        reviews.append(review2)
        review3=Review(content="Nice one!", user_id=8, book_id=6)
        reviews.append(review3)
        review4=Review(content="Good one!", user_id=6, book_id=1)
        reviews.append(review4)
        review5=Review(content="Excellent one!", user_id=4, book_id=2)
        reviews.append(review5)
        review6=Review(content="way to go!", user_id=3, book_id=4)
        reviews.append(review6)
        review7=Review(content="superb!", user_id=2, book_id=7)
        reviews.append(review7)
        review8=Review(content="good story!", user_id=1, book_id=8)
        reviews.append(review8)
        review9=Review(content="Nice story!", user_id=7, book_id=9)
        reviews.append(review9)
        db.session.add_all(reviews)
        db.session.commit()
