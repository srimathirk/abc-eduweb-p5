import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import NewBookForm from "./NewBookForm";

function Books({ user }) {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // console.log(user)
  useEffect(() => {
    fetch(`/books`)
      .then((r) => r.json())
      .then((books) => {
        setBooks(books);
      });

    fetch("/books/reviews")
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleAddBook = (newBook) => {
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
  };

  console.log(user);
  console.log(books);
  console.log(reviews);

  function handleAddReviews(newReview) {
    setReviews([...reviews, newReview]);
    //map thr books looking for bookid and add new review
    const modifiedBooks = books.map((book) => {
      if (book.id === newReview.book_id) {
        book.reviews.push(newReview);
        return book;
      } else {
        return book;
      }
    });
    setBooks(modifiedBooks);
  }
  function handleAddRatings(newRatings) {
    setRatings([...ratings, newRatings]);
    const modifiedBooks = books.map((book) => {
      if (book.id === newRatings.book_id) {
        book.ratings.push(newRatings);
        return book;
      } else {
        return book;
      }
    });
    setBooks(modifiedBooks);
  }

  const handleReviewsSubmit = (bookId, content) => {
    //POST request to add a reviews for the specified bookId
    fetch(`/books/${bookId}/add_review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id: bookId, content }),
    })
      .then((response) => response.json())
      .then((newReview) => {
        console.log("Reviews added successfully:", newReview);

        handleAddReviews(newReview);
      })
      .catch((error) => {
        console.error("Error adding reviews:", error);
      });
  };

  const handleRatingsSubmit = (bookId, value) => {
    //POST request to add a ratings for the specified bookId
    fetch(`/books/${bookId}/add_rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id: bookId, value }),
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })

      .then((newRatings) => {
        console.log("Ratings added successfully:", newRatings);

        handleAddRatings(newRatings);
      })
      .catch((error) => {
        console.error("Error adding ratings:", error);
      });
  };

  const handleDeleteReview = (bookId, reviewId) => {
    console.log(bookId);
    console.log(reviewId);
    fetch(`/books/${bookId}/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Review deleted successfully:", data);
        const updatedReviews = reviews.filter(
          (review) => review.id !== reviewId
        );
        setReviews(updatedReviews);
        // Update the list of books after deletion
        const updatedBooks = books.map((book) => {
          if (book.id === bookId) {
            // Filter out the deleted review from the book's reviews
            book.reviews = book.reviews.filter(
              (review) => review.id !== reviewId
            );
          }
          return book;
        });

        setBooks(updatedBooks);
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  };

  const handleDeleteRating = (bookId, ratingId) => {
    console.log(bookId);
    console.log(ratingId);
    fetch(`/books/${bookId}/ratings/${ratingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Rating deleted successfully:", data);
        // Update the list of ratings after deletion
        const updatedRatings = ratings.filter(
          (rating) => rating.id !== ratingId
        );
        setRatings(updatedRatings);
        // Update the list of books after deletion
        const updatedBooks = books.map((book) => {
          if (book.id === bookId) {
            // Filter out the deleted rating from the book's ratings
            book.ratings = book.ratings.filter(
              (rating) => rating.id !== ratingId
            );
          }
          return book;
        });

        setBooks(updatedBooks);
      })
      .catch((error) => {
        console.error("Error deleting rating:", error);
      });
  };

  // Function to toggle the form's visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const author = book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return title || author;
  });

  function handleUpdateViews(bookId) {
    const updatedBookCard = books.map((book) => {
      if (book.id === bookId) {
        return { ...book, views: book.views + 1 };
      }
      return book;
    });
    setBooks(updatedBookCard);
  }

  return (
    <div>
      <h1>Books</h1>
      <div>
        <button onClick={toggleForm}>Add New Book</button>
        {showForm && (
          <NewBookForm onAddBook={handleAddBook}  />
        )}
      </div>
      <div className="searchbar">
        <label htmlFor="search">Search Books:</label>
        <input
          type="text"
          id="search"
          placeholder="Type title/author to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredBooks.map((book) => (
          <li key={book.id}>
            <BookCard
              book={book}
              onAddReviews={handleReviewsSubmit}
              onAddRatings={handleRatingsSubmit}
              onDeleteReview={handleDeleteReview}
              onDeleteRating={handleDeleteRating}
              onUpdate={handleUpdateViews}
              user={user}
              reviews={reviews.filter((review) => review.book_id === book.id)}
              ratings={ratings.filter((rating) => rating.book_id === book.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
