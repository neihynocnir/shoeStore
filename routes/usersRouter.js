const express = require('express');
const router = express.Router();
const database = require('../db/database');

// Display all the users
router.get("/", (req, res) => {
  const user_id = req.cookies.user_id;
  if (!user_id) {
    res.redirect("/login");
  }
  database.getAllUsers()
  .then(data => {
    const users = data.rows;
    res.json({ users });
  })
  .catch(err => {
    res
    .status(500)
    .json({ error: err.message });
    });
  });

  // Display the details of a user
  router.get("/userid", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({ message: "not logged in" });
      return;
    }
    database.getUserWithId(userId)
      .then((user) => {
        if (!user) {
          res.send({ error: "no user with that id" });
          return;
        }
        res.send({ user: { name: user.name, email: user.email, id: userId } });
      })
      .catch((e) => res.send(e));
  });

module.exports = router;
