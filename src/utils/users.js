const users = [];

const addUser = ({ id, username, room }) => {
  //* clean the data

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validation

  if (!username || !room) {
    return { error: "Username and room are Required" };
  }
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "username is already in use",
    };
  }
  const user = {
    id,
    username,
    room,
  };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => (user.id = id));
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => (user.id = id));
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
};

console.log(users);
