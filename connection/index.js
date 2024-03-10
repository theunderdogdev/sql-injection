const { Database } = require("sqlite3");
const { open } = require("sqlite");
const initDbConnection = () => {
  return open({
    filename: "./databases/todo.db",
    driver: Database,
  });
};
module.exports = initDbConnection;
