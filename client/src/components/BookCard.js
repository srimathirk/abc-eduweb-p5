import React from "react";
import { useState } from "react";
function BookCard({
  book,
  user,
  onAddReviews,
  reviews,
  ratings,
  onUpdate,
  onAddRatings,
  onDeleteReview,
  onDeleteRating,
}) {
  const { image, title, author, pdf, views } = book;
  console.log(book);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");

  console.log(user);
  console.log(reviews);
  console.log(ratings);
  const openPdfInNewTab = () => {
    const newWindow = window.open(pdf, "_blank");
    if (newWindow) {
      newWindow.opener = null;
    }
  };
  // function addingReviewRating(reviews, ratings) {
  //   const data = [];
  //   for (let i = 0; i < reviews.length; i++) {
  //     for (let j = 0; j < ratings.length; j++) {
  //       if (reviews[i].username === ratings[j].username) {
  //         data.push({
  //           review: reviews[i].content,
  //           rating: ratings[j].value,
  //           username: reviews[i].username,
  //         });
  //       }
  //     }
  //   }
  //   return data;
  // }

  const handleReviewsSubmit = (e) => {
    e.preventDefault();
    onAddReviews(book.id, content);
    setContent(""); // Reset content after submission
  };

  const handleRatingsSubmit = (e) => {
    e.preventDefault();
    onAddRatings(book.id, rating);
    setRating(""); // Reset content after submission
  };

  const handleDelete = (bookId, reviewId) => {
    onDeleteReview(bookId, reviewId);
  };
  console.log(book.id);
  // console.log(reviews.id)
  const handleDeleteRating = (bookId, ratingId) => {
    onDeleteRating(bookId, ratingId);
  };
  console.log(book.id);

  
    function handleUpdateClick(){
    // Sending a POST request to update the view count
    fetch(`/books/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ views: views + 1 }),
    })
    .then(response => {
             response.json(); // Assuming the server sends back a JSON response
    })
    .then(() => onUpdate(book.id));
  }
  
  

  return (
    <div className="grid-wrapper">
      <div className="image" >
        <img src={image} alt={title} />
      </div>
      <div className="pdf" onClick={handleUpdateClick} >
        <button onClick={openPdfInNewTab}> Click me to view book  👀{views} </button>
      </div>
      {/* <button className="View-btn" onClick={handleUpdateClick}>
            👀{views}
          </button> */}
      <div className="content">
        <div className="Title" style={{ color: "darkred", fontWeight: "bold" }}>
          title: {title}
        </div>
        <div>
          <div
            className="author"
            style={{ color: "darkblue", fontWeight: "bold" }}
          >
            author: {author}
          </div>
          <ul>
            {book.reviews.map((review, index) => (
              <li key={index}>
                User({review.username})- Review: {review.content}
                {user.username === review.username && (
                <button onClick={() => handleDelete(book.id, review.id)}>
                  Delete Review
                </button>
                )}
              </li>
            ))}
          </ul>
          <ul>
            {book.ratings.map((rating, index) => (
              <li key={index}>
                User({rating.username})- Ratings: {rating.value}
                {user.username === rating.username && (
                <button onClick={() => handleDeleteRating(book.id, rating.id)}>
                  Delete
                </button>
                )}
              </li>
            ))}
          </ul>
          {/* <ul>
            {addingReviewRating(book.reviews, book.ratings).map(
              (data, index) => {
                // console.log(data);
                return (
                  <li key={index}>
                    rating:{data.rating} review:{data.review} username:
                    {data.username}
                  </li>
                );
              }
            )}
          </ul> */}
          <form onSubmit={handleReviewsSubmit}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review..."
            />
            <button type="submit">Submit Review</button>
          </form>
          <form onSubmit={handleRatingsSubmit}>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              step="1"
              placeholder="Enter your rating (1-5)"
            />
            <button type="submit">Submit Rating</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
