const express = require("express");
const router = express.Router();
const database = require("../db/database");

// Get User Messages
router.get("/", (req, res) => {
  let userId = req.cookies.user_id;
  let user_email = req.cookies.email;
  if (!userId) {
    res.redirect("/login");
  }
  database
    .getUserMessages(userId)
    .then((data) => {
      let messagesFromUsers = data.rows;
      let messagesFromOthersOnly = []
      for (let user of messagesFromUsers) {
        if (user.from_user_id === parseInt(req.cookies.user_id)) {
        } else {
          messagesFromOthersOnly.push(user);
        }
      }
      console.log(messagesFromOthersOnly);
    database
      .getMessages(userId)
      .then((data) => {
        for (let row of data.rows) {
          let array = row.string_agg.split("|");
          row.string_agg = array;
        }

        let templateVars = { data: data.rows , users: messagesFromOthersOnly, current_user_email: user_email };
        res.render("messages", templateVars);
    });
    });
});

// Post a Message
router.post("/", (req, res) => {
  let messageText = req.body.message_text;
  database
    .postMessages(messageText)
    .then(() => {
      console.log("hello");
      res.redirect("/messages");
    })
    .catch((error) => {
      console.log(error);
    });
});

//////// POST TO SPECIFIC USER
router.post("/:id", (req, res) => {
  let messageText = req.body.new_message;
  let userId = req.cookies.user_id;
  let toUser = req.params.id;
  let sneakerId = req.body.sneaker_id
  database
    .postMessagesToUser(messageText, userId, toUser, sneakerId)
    .then(() => {
      res.redirect("/messages/"+toUser);
    })
    .catch((error) => {
      console.log(error);
    });
});

//////// GET MESSAGES FOR SPECIFIC USER
router.get("/:id", (req, res) => {
  let userId = req.cookies.user_id;
  if (!userId) {
    res.redirect("/login");
  }
  let fromUser = req.params.id;
  let user_email = req.cookies.email;
  database
    .getUserMessages(userId)
    .then((data) => {
      let messagesFromUsers = data.rows;
      let messagesFromOthersOnly = []

      for (let user of messagesFromUsers) {
        if (user.from_user_id === parseInt(req.cookies.user_id)) {
        } else {
          messagesFromOthersOnly.push(user);
        }
      }
    database
      .getMessagesFromUser(userId,fromUser)
      .then((data) => {
        console.log("Data of sneaker messages",data.rows)
        let templateVars = { data: data.rows , users: messagesFromOthersOnly, fromUser: fromUser, current_user_email: user_email};
        res.render("messages_by_users", templateVars);
    });
    });
});

module.exports = router;

