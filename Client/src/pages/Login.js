import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDataContext } from "../ContextApi/DataContext";

const Login = () => {
  const navigate = useNavigate();

  const { userData, setLoggedIn, setCurrentUser } = useDataContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState(false);

  function sumbitForm(event) {
    event.preventDefault();
    setWarning(false);
    console.log(username, password);

    //check user
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].username == username) {
        if (userData[i].password == password) {
          setLoggedIn(true);
          navigate("/chatroom_list");
          setCurrentUser(username);
          return;
        }
      }
    }

    //notify user for wrong info inputted
    setWarning(true);
  }

  return (
    <div>
      <form className="login-form" onSubmit={sumbitForm}>
        <h1>Login to connect with people!</h1>
        <label>
          username
          <input
            type="text"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </label>

        <label>
          password
          <input
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </label>

        {warning && (
          <div style={{ color: "red", margin: "10px" }}>
            Password or username entered is not correct! Try again!
          </div>
        )}
        <div>
          <button
            className="guest-btn"
            onClick={() => {
              navigate("/chatroom_list");
              setLoggedIn(true);
              let randomString = (Math.random() + 1).toString(36).substring(7);
              setCurrentUser("Guest-" + randomString);
            }}
          >
            Guest
          </button>
          <input type="submit" />
        </div>
        <div>
          <span>
            <Link to="/register" id="register-link">
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
