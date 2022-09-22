import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateChatroom from "../components/CreateChatroom";
import DataContext from "../ContextApi/DataContext";

const ChatroomList = () => {
  const {
    chatroomsList,
    socket,
    loggedIn,
    currentUser,
    setChatroomsList,
    getData,
  } = useContext(DataContext);

  const [showCreateChatroom, setShowCreateChatroom] = useState(false);

  const navigate = useNavigate();

  const username = currentUser;

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    socket.on("dataToBeUpdated", () => {
      console.log("getting data");
      getData();
    });
  }, [socket]);

  return (
    <div>
      <div className="chatroomList-container">
        <h1>Chat rooms : </h1>

        <button
          id="create-chatroom-btn"
          onClick={() => {
            setShowCreateChatroom(!showCreateChatroom);
          }}
        >
          <h1>Create</h1>
        </button>
        {showCreateChatroom && (
          <CreateChatroom setShowCreateChatroom={setShowCreateChatroom} />
        )}
        {chatroomsList.length === 0 && <h1>Create a room!</h1>}
        {chatroomsList.map((chatroom, idx) => {
          return (
            <div
              key={idx}
              className="chatroom-card"
              onClick={() => {
                const link = "/chatroom/" + idx;
                let data = [idx, username];
                socket.emit("join_room", data);
                navigate(link);
              }}
            >
              <h2>{chatroom.name}</h2>
              <p>
                Users in chat ({chatroom.users.length}) :
                {chatroom.users.map((user, idx) => {
                  if (idx + 1 === chatroom.users.length)
                    return <span key={idx}> {user} </span>;
                  else return <span key={idx}> {user} ,</span>;
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatroomList;
