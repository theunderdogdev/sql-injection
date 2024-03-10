const express = require("express");
// const { checkSession } = require("./middlewares/checksession");
const { resolve } = require("path");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const authRouter = require("./routes/auth.routes");
const insecAuthRouter = require("./routes/auth.insecure.routes");
const initDbConnection = require("./connection");
const { checkSession } = require("./middlewares/checksession");
const app = express();
app.use(express.json());
app.use("/static", express.static(resolve("./staticfiles")));
app.use(
  session({
    name: "USER_SESSION",
    store: new SQLiteStore({
      db: "./databases/session.db",
      table: "sessions",
      concurrentDB: true,
    }),
    resave: false,
    saveUninitialized: false,
    secret: "HelloW!2ks&802",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2700000,
    },
  })
);

initDbConnection()
  .then((dbInstance) => {
    dbInstance
      .run(
        "CREATE TABLE if not exists users(userid varchar(36) primary key, username varchar(20) unique, password char(60), full_name varchar(40), email varchar(60) unique);"
      )
      .then(res => {
        console.log("Users table created/loaded successfully");
      });
  })
  .catch((err) => {
    console.log(err);
  });


app.get("/", (req, res) => {
  res.sendFile(resolve("./views/index.html"));
});
app.get("/user", checkSession, (req, res)=>{
  res.json({msg: "Success"})
})

app.use("/api/auth", authRouter);
app.use("/api/insecure/auth", insecAuthRouter);

app.listen(4100, () => {
  console.log("http://localhost:4100/");
});
