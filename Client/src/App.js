import Login from "./pages/Login";
import Error from "./pages/Error";
import Chatroom from "./pages/Chatroom";
import ChatroomList from "./pages/ChatroomList";
import DataContext from "./ContextApi/DataContext";
import React, { useState, useContext, Link } from "react";
import { Routes, Route } from "react-router-dom";
import UserInfo from "./components/UserInfo";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <UserInfo />
      <Routes>
        <Route
          path="/chatroom/:chatroomId"
          element={<Chatroom loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        ></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forget_password" element={<ForgetPassword />}></Route>
        <Route
          path="/chatroom_list"
          element={
            <ChatroomList loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          }
        ></Route>
        <Route
          path="/"
          element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        ></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </>
  );
}

export default App;
