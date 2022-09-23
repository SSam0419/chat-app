const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
var bodyParser = require("body-parser");

const PORT = "https://git.heroku.com/frozen-dawn-54971.git" || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-bvp.pages.dev/", //3000 => react dev server
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const jsonString = fs.readFileSync("./data.json", "utf-8");
const jsonData = JSON.parse(jsonString);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/data.json");
});

//user info
let users = [];
function joinRoom(data) {
  users.push(data);
}

function leaveRoom(id) {
  for (let x = 0; x < users.length; x++) {
    if (users[x].socketId == id) {
      removeChatroomListUsers(users[x].room, users[x].user);
      console.log(users[x].user, "leaving room: ", users[x].room);
      users = users.filter((user) => {
        return user.user !== users[x].user;
      });
    }
  }

  io.sockets.emit("dataToBeUpdated");
}

function addChatroomListUsers(room, user) {
  console.log(jsonData.chatrooms[room]);

  jsonData.chatrooms[room].users.push(user);

  const newData = {
    chatrooms: [...jsonData.chatrooms],
    users: [...jsonData.users],
  };

  fs.writeFileSync("./data.json", JSON.stringify(newData));

  io.sockets.emit("dataToBeUpdated");
}

function removeChatroomListUsers(room, username) {
  let index = -1;
  console.log(jsonData.chatrooms[Number(room)]);
  for (let x = 0; x < jsonData.chatrooms[Number(room)].users.length; x++) {
    if (jsonData.chatrooms[room].users[x] == username) {
      index = x;
    }
  }
  if (index == -1) {
    return;
  }
  jsonData.chatrooms[room].users.splice(index, 1);
  const newData = {
    chatrooms: [...jsonData.chatrooms],
    users: [...jsonData.users],
  };

  fs.writeFileSync("./data.json", JSON.stringify(newData));
}

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log("socket : ", socket.id);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    console.log("socket : ", socket.id);

    let user;
    let room;
    for (let x = 0; x < users.length; x++) {
      if (users[x].socketId == socket.id) {
        user = users[x].user;
        room = users[x].room;
      }
    }

    leaveRoom(socket.id);

    console.log("user left : ", user);
    socket.to(Number(room)).emit("leave_message", user);
  });

  socket.on("send_message", (data) => {
    console.log("send_message", data);
    socket.to(Number(data[0])).emit("receive_message", data[1]);
  });

  socket.on("get_users_info", (room) => {
    socket.to(Number(room)).emit("roomInfo", users);
  });

  socket.on("join_room", (data) => {
    const roomNumber = data[0];
    const username = data[1];

    socket.join(Number(roomNumber));

    joinRoom({ room: roomNumber, user: username, socketId: socket.id });

    socket.to(Number(roomNumber)).emit("welcome_message", username);

    socket.emit("roomInfo", users);

    addChatroomListUsers(roomNumber, username);
  });

  socket.on("leave_room", (username) => {
    let leaveId;
    let leaveUser;
    let leavRoom;

    for (let x = 0; x < users.length; x++) {
      if (users[x].user == username) {
        leaveId = users[x].socketId;
        leaveUser = users[x].user;
        leavRoom = users[x].room;
      }

      leaveRoom(leaveId);

      socket.to(Number(leavRoom)).emit("leave_message", leaveUser);
      socket.to(Number(leavRoom)).emit("roomInfo", users);
    }
  });

  socket.on("update_history", (data) => {
    console.log("update_history: ", data);

    const chatroom = data[0];
    const messageDetail = data[1];

    if (chatroom == "###AddChatroom###") {
      const chatroomToBePushed = {
        id: jsonData.chatrooms.length + 1,
        name: messageDetail,
        users: [],
        messages: [],
      };

      jsonData.chatrooms.push(chatroomToBePushed);

      io.sockets.emit("dataToBeUpdated");
    } else {
      jsonData.chatrooms[chatroom].messages.push(messageDetail);
    }

    const newData = {
      chatrooms: [...jsonData.chatrooms],
      users: [...jsonData.users],
    };

    fs.writeFileSync("./data.json", JSON.stringify(newData));
  });

  socket.on("register_user", (data) => {
    console.log("register_user: ", data);

    const userId = data.id;
    const username = data.username;
    const password = data.password;

    const newUserInfo = {
      id: userId,
      username: username,
      password: password,
    };

    jsonData.users.push(newUserInfo);

    io.sockets.emit("dataToBeUpdated");

    const newData = {
      chatrooms: [...jsonData.chatrooms],
      users: [...jsonData.users],
    };

    fs.writeFileSync("./data.json", JSON.stringify(newData));
  });
});

server.listen(PORT, () => {
  console.log("listening on *:", PORT);
});
