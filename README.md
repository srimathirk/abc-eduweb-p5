## Title: Abc-EduWeb 

## description:
It is a basic educational website users who are new should signup to access, only users who logged in have access to the routes inside. They can have access to books route and MathQuiz route.Inside the Books route users can view book cards which contains book image, title, author, pdf for reading book and it includes views. If the user click on view me button he can view book pdf and the views will get increase. The user can add reviews and ratings and the user can also delete their reviews and ratings can modify to new reviews and ratings the ratings have toggle. User can search books by title or author name. User can add new books if they want to. All CRUD oprations are done on books route and in MathQuiz route the user can do quiz in addition, subtraction, multiplication and division. if user is doing addition quiz he/ she will be alloted for 10 questions if the user finishes 10 questions they can get a detailed results from quizreport.

## Models:
User model [id, first_name, last_name, username(unique), password]
Book model (id, Author, Title, Image, Pdf)
Review model (id, content, book_id)
Rating model (id, value, book_id)
user_books model (user_id, book_id)
## validations:
password must be secure so incorporate bcrypt 
User must have username and it should be unique.
## Relationshiips:
User and Book (many to many)
Book and Review (one to many)
Book and Rating (one to many)
## Routes in backend (Server)
CheckSession: get session if userid in session
Signup:  post/signup by adding user details add password and confirm password
Login: post/Login with username and password if both correct user can login else give error
Logout: delete usersession (session should be none)
Users: get All users 
Books: (Get) display all books if user is in session and (Post) book 
BookById: (Get) users book by id and (Patch) or update views with their bookid
Reviews: check session if user logged in (Get) or display all reviews and also (Get) or display reviews by bookId and can (Post) review with respect to bookid and can also (Delete) their review
Ratings: check session if user logged in (Get) or display all ratings and also (Get) or display ratings by bookId and also can (Post) rating with respect to bookid and can also (Delete) their rating
## Routes in Frontend (Client)
Home: Has Navbar displays Login and Signup Routes
Signup: If newUser they should signup in Signupform 
Login: IF user not logged in they should login using LoginForm 
Home: if User Logged in or Signed up goes to Home has 2 Routes (Books and MathQuiz)
Books: After loggedin/Signup user can view books by clicking Books Route. They can view Book card
        Search bar(for Search/filter book by author and title)
        NewBookForm( can add new Book by adding all book details)
        Patch(request to backend Patch by BookId for views)
        Get(request to backend to Get Books, Bookbyid)
        Post(request to backend for posting Book, Review, Rating)
        Delete(request to backend for deleting Review/ rating)
BookCard: (image, title, author, pdf, reviews, ratings) 
MathQuiz: (AdditionQuiz , SubtractionQuiz, MultiplicationQuiz, DivisionQuiz)generate random numbers and operate based on operations( +,-,/,*) Using QuizForm handle submit for Submitting answers. Update QuizReport for gettng all answer report of User who done Quiz

For running backend Server: 
from project folder/name
pipenv install && shell
cd server 
python app.py
(runs backend server in local host)

for running Frontend Server:
from project folder/name
cd client
npm install & start
(runs frontend in local host)

 
