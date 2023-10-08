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

class BookReviews(Resource):
    def get(self, book_id):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        book = Book.query.filter(Book.id == book_id).first()
        reviews_data = [{'content': review.content, 'username': get_username_from_user_id(review.user_id)} for review in book.reviews]
        return reviews_data, 200



class AddReview(Resource):
    def post(self, book_id):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        user_id = session['user_id']
        # user=User.query.filter(User.id == user_id).first()
        content = request.get_json()['content']

        # Find the book by its ID
        book = Book.query.filter(Book.id == book_id).first()
        if not book:
            return {'message': 'Book not found'}, 404

        # Create a new review associated with the specified user and book
        review = Review(user_id=user_id, book_id=book.id, content=content)
        db.session.add(review)
        db.session.commit()

        # Convert the review object to a dictionary
        review_dict = {
            'id': review.id,
            'username': get_username_from_user_id(review.user_id),
            'book_id': review.book_id,
            'content': review.content
            # Add more fields if necessary
        }

        return review_dict, 201
class Ratings(Resource):
    def get(self):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        ratings = []
        for rating in Rating.query.all():
            rating_dict = rating.to_dict()
            ratings.append(rating_dict)

        return ratings,200

class BookRatings(Resource):
    def get(self, book_id):
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        book = Book.query.filter(Book.id == book_id).first()
        ratings_data = [{'value': rating.value, 'username': get_username_from_user_id(rating.user_id)} for rating in book.ratings]
        return ratings_data, 200


class AddRating(Resource):
    def post(self,book_id):
        
        if 'user_id' not in session:
            return {'message': 'Unauthorized'}, 401

        user_id = session['user_id']
        value = request.get_json()['value']
        # Find the book by its ID
        book = Book.query.filter(Book.id == book_id).first()
        if not book:
            return {'message': 'Book not found'}, 404

        # Create a new rating associated with the specified user and book
        rating = Rating(user_id=user_id, book_id=book.id, value=value)
        db.session.add(rating)
        db.session.commit()

        rating_dict = {
            'id': rating.id,
            'username': get_username_from_user_id(rating.user_id),
            'book_id': rating.book_id,
            'value': rating.value
            # Add more fields if necessary
        }

        return rating_dict, 201

class BookReviewById(Resource):
    def get(self, book_id, review_id):
        # Implement logic to get the review by book_id and review_id
        # For example, you might use these IDs to query your database
        
        # Assuming you have a Review model
        review = Review.query.filter_by(book_id=book_id, id=review_id).first()
        
        if review:
            review_data = {
                'id': review.id,
                'content': review.content,
                # Add more attributes as needed
            }
            return review_data, 200
        else:
            return {'message': 'Review not found'}, 404

class BookRatingById(Resource):
    def get(self, book_id, rating_id):
        # Implement logic to get the rating by book_id and rating_id
        # For example, you might use these IDs to query your database
        
        # Assuming you have a Rating model
        rating = Rating.query.filter_by(book_id=book_id, id=rating_id).first()
        
        if rating:
            rating_data = {
                'id': rating.id,
                'content': rating.content,
                # Add more attributes as needed
            }
            return rating_data, 200
        else:
            return {'message': 'Rating not found'}, 404


api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(CheckSession, '/check_session', endpoint='checksession')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users')
api.add_resource(Books, '/books')
api.add_resource(BookById,'/books/<int:book_id>')
api.add_resource(Reviews, '/books/reviews')
api.add_resource(BookReviews, '/books/<int:book_id>/reviews')
api.add_resource(AddReview,'/books/<int:book_id>/add_review')
api.add_resource(BookReviewById, '/books/<int:book_id>/reviews/<int:review_id>')
api.add_resource(Ratings, '/books/ratings')
api.add_resource(BookRatings, '/books/<int:book_id>/ratings')
api.add_resource(AddRating,'/books/<int:book_id>/add_rating')
api.add_resource(BookRatingById, '/books/<int:book_id>/ratings/<int:rating_id>')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=4000, debug=True)

