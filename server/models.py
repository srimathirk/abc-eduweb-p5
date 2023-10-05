from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property

from config import db,bcrypt

# Models go here!
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
    # def to_dict(self):
    #     return {
    #         'id': self.id,
    #         'username': self.username,
    #         'first_name': self.first_name,
    #         'last_name': self.last_name
         
    #     }