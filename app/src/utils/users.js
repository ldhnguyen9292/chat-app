let userList = [];

const getUserList = (room) => userList.filter((user) => user.room === room);

const addUser = (user) => (userList = [...userList, user]);

const removeUser = (id) =>
  (userList = userList.filter((user) => user.id !== id));

module.exports = {
  getUserList,
  addUser,
  removeUser,
};
