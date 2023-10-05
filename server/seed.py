#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from models import User
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

