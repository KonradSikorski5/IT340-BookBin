const express = require("express");
const { MongoClient } = require("mongodb");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const client = new MongoClient("mongodb://192.168.50.30:27017");
let users;

client.connect().then(() => {
  users = client.db("bookbin").collection("users");
  console.log("Connected to MongoDB");
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return salt + ":" + hash;
}

app.get("/", (req, res) => {
  res.send("BookBin back-end is running");
});

app.post("/register", async (req, res) => {
  const username = String(req.body.username);
  const email = String(req.body.email);
  const password = String(req.body.password);

  const existing = await users.findOne({ username: username });
  if (existing) {
    return res.json({ message: "Username already taken" });
  }

  await users.insertOne({
    username: username,
    email: email,
    password: hashPassword(password)
  });

  console.log("New account created: " + username);
  res.json({ message: "Account created" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});