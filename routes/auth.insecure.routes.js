const { Router } = require("express");

const dbInstance = require("../connection");
const ApiResponse = require("../utils/ApiResponse");
const { compareSync, hashSync } = require("bcrypt");
const initDbConnection = require("../connection");

const insecAuthRouter = Router();

insecAuthRouter.post("/register", (req, res) => {
  const { name, username, password, email } = req.body;
  const id = crypto.randomUUID();
  initDbConnection().then((dbInstance) => {
    dbInstance
      .exec(
        `insert into 'users' (userid, username, email, password, full_name) values ('${id}', '${username}', '${email}', '${hashSync(
          password,
          5
        )}', '${name}')`
      )
      .then((dbRes) => {
        res.status(201).json(
          new ApiResponse({
            statusCode: 201,
            message: "New user registered",
            data: {
              username: username,
            },
          })
        );
      })
      .catch((err) => {
        res.json(
          new ApiResponse({
            statusCode: err.code === "SQLITE_CONSTRAINT" ? 422 : 500,
            message:
              err.code === "SQLITE_CONSTRAINT"
                ? "Username and email should be unique"
                : "Failed user registeration",
          })
        );
      });
  });
});

insecAuthRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`select userid, username, password from users where username = '${username}'`)
  initDbConnection().then((dbInstance) => {
    dbInstance
      .get(
        `select userid, username, password from users where username = '${username}'`
      )
      .then((row) => {
        console.log(row)
        if (compareSync(password, row.password)) {
          if (!req.session.userId) {
            req.session.userId = row.userid;
            console.log("Saved session: ");
            return res.status(200).json(
              new ApiResponse({
                statusCode: 200,
                message: "Login Successful",
              })
            );
          }
          return res.status(200).json(
            new ApiResponse({
              statusCode: 302,
              message: "Redirect to todos",
              data: {
                url: "/todos",
              },
            })
          );
        } else {
          return res.json(
            new ApiResponse({
              statusCode: 401,
              message: "Invalid login attempt",
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(
          new ApiResponse({
            statusCode: 500,
            message: "Couldn't login",
          })
        );
      });
  });
});
module.exports = insecAuthRouter;
