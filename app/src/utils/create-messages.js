const format = require("date-format");

const createMessages = (username, message) => {
  return {
    username,
    message,
    createAt: format("hh:mm", new Date()),
  };
};

module.exports = {
  createMessages,
};
