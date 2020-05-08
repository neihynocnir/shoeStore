const express = require("express");
const router = express.Router();
const database = require("../db/database");

// Display form to login
router.get("/", (req, res) => {
  let user_email = req.cookies.email;
  let templateVars = { current_user_email: user_email};
  res.render("login", templateVars);
});

// Login
router.post("/", (req, res) => {
  const { email } = req.body;
  database.getUserWithEmail(email)
  .then((user) => {
    if (user) {
      res.cookie("email", user.email);
      res.cookie('user_id', user.id);
      res.redirect("/");
    } else {
      res.status(401).send('User does not exist <a href="/">login</a>');
      return;
    }
    })
    .catch((e) => res.send(e));
});

module.exports = router;
