import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import Books from "./Books"; // Import your Books, Math, and Logic components
import MathQuiz from "./MathQuiz";
import "../css/Home.css";

function Home({ user }) {
  console.log(user);
  if (user) {
    return (
      <div className="bbg">
        
        <h1 >Welcome!! {user.first_name}! Hope You Like It</h1>
      
        <nav>
          <ul>
            {user && (
              <li>
                <Link to="/books">Books</Link>
              </li>
            )}
            <li>
              <Link to="/mathquiz">MathQuiz</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/books">
            <Books user={user} />
          </Route>
          <Route path="/mathquiz">
            <MathQuiz user={user} />
          </Route>
        </Switch>
      </div>
    );
  } else {
    return (
      <div className="bg">
        <h1 >Welcome to Educational Website</h1>
        <h2>Please login or signup to explore world of Books and MathQuiz</h2>
        <p>Explore the world of fun books , Reading is fun! Independent learning comes from reading books. This Website is targeted to design for kids for early learner that supports students to empower their skills!! </p>
      </div>
    );
    
  }
}

// function Books() {
//   return <h2>Books Component</h2>;
// }

// function Math() {
//   return <h2>Math Component</h2>;
// }

// function Logic() {
//   return <h2>Logic Component</h2>;
// }

export default Home;

// function Home({ user }) {
//     if (user) {
//       return (
//       <div>
//       <h1>Welcome, {user.username} !</h1>

//     </div>
//       )
//     } else {
//       return <h1>Please Login or Sign Up</h1>;
//     }
//   }

//   export default Home;
