import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDataContext } from "../ContextApi/DataContext";
import { AiOutlineSend } from "react-icons/ai";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const Chatroom = () => {
  const { chatroomsList, socket, loggedIn, currentUser, postData, getData } =
    useDataContext();

  const navigate = useNavigate();

  const { chatroomId } = useParams();
  const id = Number(chatroomId.replace(":", ""));

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [currentUsersOnline, setCurrentUsersOnline] = useState([]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else {
      socket.emit("get_users_info", id);
    }
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("received msg: ", data);
      setMessageList((list) => [...list, data]);
    });

    socket.on("roomInfo", (data) => {
      const onlineUsers = data.filter((user) => user.room == id);
      setCurrentUsersOnline(onlineUsers);
    });

    socket.on("welcome_message", (user) => {
      socket.emit("get_users_info", id);

      const now = new Date();
      const current = now.getHours() + ":" + now.getMinutes();
      setMessageList((list) => [
        ...list,
        { time: current, from: user, content: "^^welcome_user^^" },
      ]);
    });

    socket.on("leave_message", (user) => {
      const now = new Date();
      const current = now.getHours() + ":" + now.getMinutes();
      setMessageList((list) => [
        ...list,
        { time: current, from: user, content: "^^leave_user^^" },
      ]);
    });
  }, [socket]);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message === "") return;

    const msgInput = document.querySelector(".message-box");
    msgInput.value = "";

    const msg = message;
    const now = new Date();
    const current = now.getHours() + ":" + now.getMinutes();
    const from = currentUser;

    const messageData = [id, { time: current, from: from, content: msg }];

    // setMessageList((prev) => [...prev, messageData[1]]);

    setMessage("");

    socket.emit("send_message", messageData);

    //push chat history
    socket.emit("update_history", messageData);
  };

  //update state of messages data
  useEffect(() => {
    chatroomsList.map((data, idx) => {
      if (idx == id) {
        setMessageList(data.messages);
      }
    });
  }, [chatroomsList]);

  //scroll down to bottom for each message sent
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div>
      {chatroomsList.map((data, idx) => {
        if (idx == id) {
          return (
            <div className="chatroom-container">
              <BsFillArrowLeftCircleFill
                onClick={() => {
                  navigate("/chatroom_list");
                  socket.emit("leave_room", currentUser);
                }}
                className="return-btn"
              />
              <div className="chatroom-header">
                <h2>{data.name}</h2>
                <p>
                  Online:
                  {currentUsersOnline.map((user, idx) => {
                    return <span key={idx}> {user.user} </span>;
                  })}
                </p>
              </div>

              <div className="chatroom-body">
                {messageList.map((msg, idx) => {
                  if (msg.from == currentUser) {
                    return (
                      <div className="message-from-me" key={idx}>
                        <p>{msg.content}</p>
                        <span>{msg.time} </span>
                        <span>me</span>
                      </div>
                    );
                  } else if (msg.content == "^^welcome_user^^") {
                    return (
                      <div
                        className="welcome-msessage"
                        key={idx}
                        style={{ textAlign: "center" }}
                      >
                        <p>{msg.from} has joined to the Chatroom!</p>
                      </div>
                    );
                  } else if (msg.content == "^^leave_user^^") {
                    return (
                      <div
                        className="welcome-msessage"
                        key={idx}
                        style={{ textAlign: "center" }}
                      >
                        <p>{msg.from} has left to the Chatroom!</p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="message" key={idx}>
                        <p>{msg.content}</p>
                        <span>{msg.time} </span>
                        <span>{msg.from}</span>
                      </div>
                    );
                  }
                })}

                <p ref={messagesEndRef} />
              </div>

              <div className="chatroom-footer">
                <input
                  className="message-box"
                  placeholder="type your message..."
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                ></input>
                <span
                  className="submit-msg-btn"
                  onClick={() => {
                    sendMessage();
                  }}
                >
                  <AiOutlineSend />
                </span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Chatroom;
