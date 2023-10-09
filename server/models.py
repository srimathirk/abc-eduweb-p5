from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db,bcrypt

# Models go here!
user_books = db.Table('user_books',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    
    # serialize_rules = ('-_password_hash','-books')

    # books = db.relationship('Book', secondary= user_books)

    @hybrid_property #Restrict access to password hash
    def password_hash(self):
        raise Exception("Password hashes may not be viewed.")

    @password_hash.setter #Generate a Bcrypt password hash and set it to _password_hash attribute
    def password_hash(self, password):
        bcrypt_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self._password_hash = bcrypt_hash

    def authenticate(self, password): #check if provided password matches one that stored in db
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"User {self.username}, ID: {self.id}"
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name
        }
    @validates('username')
    def validate_username(self, key, username):
        # validation logic, ensure username is present, unique.

        #checking username is present
        if not username:
            raise ValueError("Username must be present")
        #checking username is unique
        user_exist = User.query.filter(User.username == username).first()
        if user_exist and user_exist.id != self.id:
            raise ValueError("Username is not unique")
        # if user is unique and present return username
        return username

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String) 
    title = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    pdf =  db.Column(db.String)
    views = db.Column(db.Integer, default=0)
    users = db.relationship('User', secondary=user_books, overlaps="books")
    reviews = db.relationship('Review', backref='books')
    ratings = db.relationship('Rating', backref='books')
    
    serialize_rules = ('-user_books','-ratings','-reviews')

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    serialize_rules = ('-user',)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'content': self.content
         
        }
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    serialize_rules = ('-user',)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'value': self.value
         
        }