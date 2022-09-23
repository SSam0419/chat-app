import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const dataUrl = "https://git.heroku.com/frozen-dawn-54971.git";

  const socket = io.connect(dataUrl); // 5000 => socket io server

  const [chatroomsList, setChatroomsList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  function updateData(data) {
    setChatroomsList(data.chatrooms);
    setUserData(data.users);
  }

  function postData(url, newData) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function getData() {
    fetch(dataUrl)
      .then((response) => response.json())
      .then((data) => {
        updateData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    getData();
  }, [dataUrl]);

  return (
    <DataContext.Provider
      value={{
        chatroomsList,
        socket,
        userData,
        setLoggedIn,
        loggedIn,
        currentUser,
        setCurrentUser,
        postData,
        setChatroomsList,
        getData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

export const useDataContext = () => {
  return useContext(DataContext);
};
