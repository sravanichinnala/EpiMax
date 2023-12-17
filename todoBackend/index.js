import express, { response } from "express";
import cors from "cors";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { request } from "http";

const app = express();
app.use(express.json());
app.use(cors());

let db = null;

const authentication = (request, response, next) => {
  try {
    let headers = request.headers["authorization"];
    let accessToken = headers.split(" ")[1];
    // console.log(accessToken);
    let payload = jwt.verify(accessToken, "JJS143");
    if (payload !== undefined) {
      // console.log(payload);
      request.username = payload.username;
      // response.send("Success");
      next();
    }
  } catch (e) {
    console.log("unauthorized access");
    response.status(301);
    response.send("Unauthorized access");
  }
};
app.get("/tasks", authentication, async (request, response) => {
  //Select query based on username
  const username = request.username;
  const selectQuery = `SELECT * FROM tasks where username='${username}'`;
  const tasksList = await db.all(selectQuery);
  response.send(tasksList);
  // console.log(tasksList);
});

app.post("/signup", async (request, response) => {
  try {
    const { userName, email, password } = request.body;
    const checkUserQuery = `SELECT * FROM users WHERE username = '${userName}';`;
    const checkUser = await db.get(checkUserQuery);
    console.log(checkUser);
    if (checkUser === undefined) {
      const hashPassword = await bcrypt.hash(password, 10);
      const userInsertQuery = `INSERT INTO users(username,email,password) values('${userName}','${email}','${hashPassword}');`;
      const queryOp = await db.run(userInsertQuery);
      response.status(200);
      response.send({ message: "Account Created Successfully." });
    } else {
      response.status(301);
      response.send({ message: "User Name already taken" });
    }
  } catch (e) {
    response.send("Account creation failed.");
  }
});

app.post("/login", async (request, response) => {
  const { userName, password } = request.body;
  const selectQuery = `SELECT * FROM users where username = '${userName}'`;
  const userDetails = await db.get(selectQuery);
  if (userDetails !== undefined) {
    // console.log(userDetails, password, userDetails.password);
    let isPassword = await bcrypt.compare(password, userDetails.password);
    if (isPassword === true) {
      const payload = { username: userName };
      const accessToken = jwt.sign(payload, "JJS143");
      // console.log(`Welcome ${userName}.`, accessToken);
      response.status(200);
      response.send({ accessToken });
    } else {
      response.status(301);
      response.send({ message: "Invalid Password" });
    }
  } else {
    response.status(301);
    response.send({ message: "User Not found" });
  }
});

app.post("/add-task", authentication, async (request, response) => {
  const { title, description, duedate, status } = request.body;
  const username = request.username;
  const taskInsertQuery = `
    INSERT INTO tasks(username,title,description,duedate,status) values('${username}','${title}','${description}','${duedate}','${status}');`;
  const insertOp = await db.run(taskInsertQuery);
  response.send(insertOp);
});

app.delete("/delete-task", authentication, async (request, response) => {
  let { id } = request.body;
  let username = request.username;
  // console.log(typeof id);
  let deleteQuery = `DELETE FROM tasks where id = ${id} and username = '${username}';`;
  await db.run(deleteQuery);
  // console.log(delItems);
  response.send("item deleted");
});

app.put("/update-task", authentication, async (request, response) => {
  const { id, title, description, duedate, status, username } = request.body;
  const updateQuery = `UPDATE tasks SET title='${title}',description='${description}',duedate='${duedate}',status='${status}' where id='${id}'`;
  const update = await db.run(updateQuery);
  response.send("updated");
});

app.put("/mark-completed", authentication, async (request, response) => {
  const { id } = request.body;
  console.log(request.body);
  const markQuery = `UPDATE tasks SET status='completed' where id=${id};`;
  const update = await db.run(markQuery);
  response.send("Mark as Completed");
});

const connectToDatabaseAndServer = async () => {
  //   const dbPath = path.join(__dirname, "userAndTask.db");
  db = await open({
    filename: "./userAndTask.db",
    driver: sqlite3.Database,
  });
  if (db !== undefined) {
    console.log("Database connected successfully");
    app.listen(3001, () => {
      console.log("App running successfully");
    });
  } else {
    console.log("Database disconnected");
  }
};
connectToDatabaseAndServer();
