//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const salt = 10;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/submit", function (req, res) {
  res.render("submit");
});

app.post("/login", function (req, res) {
  let userId = req.body.username;
  let password = req.body.password;
  User.findOne({ username: userId }, function (err, foundUser) {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result === true) {
          res.render("secrets");
        }
      });
    }
  });
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, salt, function (err, hash) {
    let userId = req.body.username;
    User.findOne({ username: userId }, function (err, result) {
      if (!err) {
        if (result) {
          res.redirect("/register");
        } else {
          let newUser = new User({
            username: userId,
            password: hash,
          });
          newUser.save(function (err) {
            if (!err) {
              console.log("Save into database!");
              res.render("secrets");
            }
          });
        }
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Goto: locathost:3000");
});
