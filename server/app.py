#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request,session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Book, user_books,Review, Rating


# Views go here!
class ClearSession(Resource):

    def delete(self):
    
        session['page_views'] = None
        session['user_id'] = None

        return {}, 204


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        print(f"User ID from session: {user_id}")
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            print(f"User from database: {user}")
            if user:           
                return user.to_dict(), 200
        else:
            session.pop('user_id', None)
            return {}, 204



class Signup(Resource):
    
    def post(self):
        username = request.get_json()['username']
        # user = User.query.filter(User.username == username)

        password = request.get_json()['password']
        if username and password:
            new_user = User(
                username=username
            )
            new_user.password_hash = password

            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id
            print(session)
            return new_user.to_dict(), 201
        else:
            return {},204
    
        # return {'error': 'Invalid username or password'}, 401

        

class Login(Resource):
    def post(self):
        
        username = request.get_json()['username']
        
        password = request.get_json()['password']
        user = User.query.filter(User.username == username).first()

        # users pwd is set by calling user.pawd = "new_pwd"
        # instead of pwd = user.pwd , here we authenticate by using bcrypt checking pwd = stored pwd hash
        if user and user.authenticate(password):
        
            session['user_id'] = user.id
            return user.to_dict(), 200

        return {}, 401
 

class Logout(Resource):
    def delete(self):

        # session['user_id'] = None
        session.pop ('user_id', None)
        return {}, 204


#RESTful route syntax
class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()] #Serialize users - password hashes shouldnot be sent to client  
        return users, 200

def get_username_from_user_id(user_id):
    user = db.session.query(User).filter_by(id=user_id).first()
    print(user)
    return user.username if user else None

class Books(Resource):
    def get(self ):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        # if session["user_id"]:
        books = Book.query.all()
        books_data = []

        for book in books:
            reviews_data = [{'id':review.id, 'content': review.content, 'username': get_username_from_user_id(review.user_id)} for review in book.reviews]
            ratings_data = [{'id':rating.id, 'value': rating.value,  'username': get_username_from_user_id(rating.user_id)} for rating in book.ratings]
            books_data.append({
                'id': book.id,
                'author': book.author,
                'title': book.title,
                'image': book.image,
                'pdf': book.pdf,
                'views': book.views,
                'reviews': reviews_data,
                'ratings': ratings_data
            })

        return (books_data),200


class BookById(Resource):
    def get(self,book_id):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        book = Book.query.filter(Book.id == book_id).first()
        reviews_data = [{'id':review.id, 'content': review.content, 'username': get_username_from_user_id(review.user_id)} for review in book.reviews]
        ratings_data = [{'id':rating.id, 'value': rating.value,  'username': get_username_from_user_id(rating.user_id)} for rating in book.ratings]

        book_data = {
            'id': book.id,
            'author': book.author,
            'title': book.title,
            'image': book.image,
            'pdf': book.pdf,
            'views':book.views,
            'reviews': reviews_data,
            'ratings': ratings_data
        }

        return book_data, 200

class Reviews(Resource):
    def get(self):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        reviews = []
        for review in Review.query.all():
            review_dict = review.to_dict()
            reviews.append(review_dict)

        return reviews,200


api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='checksession')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users')
api.add_resource(Books, '/books')
api.add_resource(BookById,'/books/<int:book_id>')
api.add_resource(Reviews, '/books/reviews')


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=4000, debug=True)

