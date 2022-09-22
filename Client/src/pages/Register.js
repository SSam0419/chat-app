import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../ContextApi/DataContext";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warning, setWarning] = useState(false);

  const { postData, userData, socket } = useDataContext();

  function sumbitForm() {
    //check pw
    if (password !== confirmPassword) {
      setWarning(true);
      return;
    }

    //check username
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].username == username) {
        setWarning(true);
        return;
      }
    }

    //update user to database
    // postData("http://localhost:5000/users", {
    //   id: userData.length + 1,
    //   username: username,
    //   password: password,
    // });

    socket.emit("register_user", {
      id: userData.length + 1,
      username: username,
      password: password,
    });

    //notify user
    window.confirm("Sucessful registered! Login now. ");

    //go back to login page
    navigate("/");
    window.location.reload();
  }

  return (
    <div>
      <form className="login-form" onSubmit={sumbitForm}>
        <h1>Register your account to start connecting with people!</h1>
        <div className="register-form-body">
          <label>
            <span>username</span>

            <input
              required
              type="text"
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></input>
          </label>
          <label>
            <span> password</span>

            <input
              required
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </label>
          <label>
            <span>confirm password</span>

            <input
              required
              type="password"
              placeholder="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></input>
          </label>
          {warning && (
            <div style={{ color: "red", margin: "10px" }}>
              Password entered is not the same! Try again!
            </div>
          )}
          <input type="submit" />
        </div>

        <div></div>
      </form>
    </div>
  );
};

export default Register;
