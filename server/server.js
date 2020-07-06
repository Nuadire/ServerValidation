const express = require("express");
const bodyParser = require("body-parser");

const users = [];
const port = 4000;
const server = express();

server.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.send("ok");
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

server.post("/sign-up", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  const user = req.body;
  const { email } = user;
  console.log(users);
  if (users.findIndex((i) => i.email === email) === -1) {
    delete user.acceptTerms;
    users.push(user);
    res.json({ code: 1, message: "user created successfully" });
  } else {
    res.json({ code: 0, message: "Such user already exist" });
  }
});

server.listen(port, (err) => {
  if (err) return console.log("something bad happened", err);
  return console.log(`Server listening at ${port}`);
});
