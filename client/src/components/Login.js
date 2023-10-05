import React, { useState } from "react";
//import { useHistory } from "react-router-dom";

function Login({ setUser }) {
 // let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // error message if password is not correct

  function handleSubmit(e) {
    e.preventDefault();

    //making request to server to validate login
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => { 
          
        // // Assuming user.token is where your token is located in the response
        // const token = user.token;
        // localStorage.setItem('token', token); // Save token to localStorage

          setUser(user)});
        // history.push("/"); //after successfull login going back to login home page
      } else {
        setError("Username or password is incorrect");

        // Reset form fields
        setUsername("");
        setPassword("");
      }
    });
    //  console.log(username);
    //  console.log(password)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
