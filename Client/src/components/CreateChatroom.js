import React, { useState } from "react";
import { useDataContext } from "../ContextApi/DataContext";

const CreateChatroom = ({ setShowCreateChatroom }) => {
  const [chatroomName, setChatroomName] = useState("");
  const { socket } = useDataContext();

  const handleChange = (e) => {
    setChatroomName(e.target.value);
  };

  function handleEnter(e) {
    const newDataToBeUpdated = ["###AddChatroom###", chatroomName];
    socket.emit("update_history", newDataToBeUpdated);
    socket.emit("creating_new_chatroom", chatroomName);
    setChatroomName("");
    e.target.value = "";
    setShowCreateChatroom(false);
  }

  return (
    <div className="CreateChatroom">
      <input
        onChange={(e) => {
          handleChange(e);
        }}
        placeholder="enter chatroom name..."
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleEnter(event);
          }
        }}
      ></input>
    </div>
  );
};

export default CreateChatroom;
