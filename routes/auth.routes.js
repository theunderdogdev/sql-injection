const { Router } = require("express");
const { hashSync, compareSync } = require("bcrypt");

const ApiResponse = require("../utils/ApiResponse");
const initDbConnection = require("../connection");

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const { name, username, password, email } = req.body;
  const id = crypto.randomUUID();
  initDbConnection().then((dbInstance) => {
    dbInstance
      .run(
        "insert into 'users' (userid, username, password, full_name, email) values ($userId, $username, $pass, $name, $email)",
        {
          $userId: id,
          $username: username,
          $pass: hashSync(password, 5),
          $name: name,
          $email: email,
        }
      )
      .then(() => {
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
        console.log(err);
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

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  initDbConnection().then((dbInstance) => {
    dbInstance
      .get(
        "select userid, username, password from users where username = $username",
        { $username: username }
      )
      .then((row) => {
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
      }).catch(err => {
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
module.exports = authRouter;
