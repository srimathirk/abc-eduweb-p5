import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import NavBar from "./NavBar";
import Home from "./Home";
import Books from "./Books";
import MathQuiz from "./MathQuiz";

// import '../css/Home.css'
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Chcking session works");
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          return r.text(); // Get the response as text
        }
      })
      .then((text) => {
        console.log("Response Text:", text);
        // Now try to parse it as JSON if it's not empty
        if (text.trim() !== "") {
          const user = JSON.parse(text); //converting text to JSON
          setUser(user);
          console.log(user);
        }
      });
  }, []);
  console.log(user);
  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <main>
        {user ? (
          <Switch>
            <Route path="/">
              <Home user={user} />
            </Route>
            <Route path="/books">
              <Books user={user} />
            </Route>
            <Route path="/mathquiz">
              <MathQuiz user={user} />
            </Route>
          </Switch>
        ) : (
          <Switch>
            <Route path="/signup">
              <SignUp setUser={setUser} />
            </Route>
            <Route path="/login">
              <Login setUser={setUser} />
            </Route>
            <Route path="/">
              <Home user={user} />
            </Route>
          </Switch>
        )}
      </main>
    </div>
  );
}

export default App;
