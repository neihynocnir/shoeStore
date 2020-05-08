// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('../lib/db');
const db = new Pool(dbParams);
db.connect();

/// Users

/// get all Users
const getAllUsers = function() {
  const querySQL = `SELECT * FROM users`
  return db.query(querySQL)
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('eror', err));
}
exports.getAllUsers = getAllUsers;


// Get User by email
const getUserWithEmail = function (email) {
  const querySQL = `SELECT * FROM users WHERE email = $1`
  return db.query(querySQL,[email])
   .then((res) => res.rows[0]);
 }
 exports.getUserWithEmail = getUserWithEmail;


 // Get User by id
 const getUserWithId = function (id) {
   const querySQL = `SELECT * FROM users WHERE id = $1`
   return db.query(querySQL,[id])
     .then((res) => res.rows[0]);
 };
 exports.getUserWithId = getUserWithId;


/// Sneakers

// Get all sneakers
const getAllSneakers = function() {
  const querySQL = `SELECT * FROM items WHERE active = true ORDER BY id DESC`
  return db.query(querySQL)
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('eror', err));
}
exports.getAllSneakers = getAllSneakers;


// Get a list of sneakers filter featured
const getFeaturedSneakers = function() {
  const querySQL = `SELECT * FROM items WHERE featured = true ORDER BY id DESC`
  return db.query(querySQL)
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('eror', err));
}
exports.getFeaturedSneakers = getFeaturedSneakers;


// Filter sneaker by price
const sneakersFilterByPrice = function(range) {
  const querySQL = `SELECT * FROM items WHERE price BETWEEN
  $1 AND $2 ORDER BY price DESC`
  return db.query(querySQL, [range.min, range,max])
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('eror', err));
}
exports.sneakersFilterByPrice = sneakersFilterByPrice;

// Get a list of sneakers for each owner
const getShoesBySeller = function(user_id) {
  const querySQL = `SELECT items.id, items.brand, items.size, items.title, items.price, items.description, items.cover_photo_url, active
  FROM items
  JOIN users ON users.id = admin_id
  WHERE users.id=$1
  ORDER BY items.id DESC`
  return db.query(querySQL,[user_id])
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('error', err));
}
exports.getShoesBySeller = getShoesBySeller;


// Add a new pair of sneakers to sell.
 const addSneaker = function(sneaker){
   const querySQL = `INSERT INTO items (admin_id, brand, title, price, colour, size, description, cover_photo_url, gender, featured, active )
   VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'true')
   RETURNING *`
   return db.query(querySQL,[sneaker.admin_id,sneaker.brand, sneaker.title, sneaker.price, sneaker.colour, sneaker.size, sneaker.description, sneaker.cover_photo_url, sneaker.gender, sneaker.featured])
   .then(res => {
     if(res.rows) {
       return res;
      } else {
        return null
      }
    })
  .catch(err => console.log('error', err));
 }
 exports.addSneaker = addSneaker;


// List a specific pair of sneakers
const getSneakersById = function(id){
  const querySQL = `SELECT id, brand, admin_id, title, price, size, description, cover_photo_url, active FROM items WHERE id = $1`
  return db.query(querySQL,[id])
  .then(res => {
    if(res.rows) {
      return res;
     } else {
       return null
     }
   })
 .catch(err => console.log('error', err));
}
exports.getSneakersById = getSneakersById;


// Update a specific pair of sneakers
const updateSneakerById = function(sneaker){
  const querySQL = `UPDATE items SET active = $1, featured = $2  WHERE id = $3`
  return db.query(querySQL,[sneaker.active,sneaker.featured, sneaker.id,])
  .then(res => {
    if(res.rows) {
      return res;
     } else {
       return null
     }
   })
 .catch(err => console.log('error', err));
}
exports.updateSneakerById = updateSneakerById;

// Delete a specific pair of sneakers
const delSneakerById = function(id){
  const querySQL = `DELETE FROM items WHERE id = $1`
  return db.query(querySQL,[id])
  .then(res => {
    if(res.rows) {
      return res;
     } else {
       return null
     }
   })
 .catch(err => console.log('error', err));
}
exports.delSneakerById = delSneakerById;


/// Favourites

// Find List of favourites sneakers according with a user_id
const findFavouriteSneaker = (id) => {
  const querySQL = `SELECT * FROM favourites WHERE user_id = $1`
  return db.query(querySQL, [id])
    .then((res) => res.rows);
};
exports.findFavouriteSneaker = findFavouriteSneaker;

// Get the item_id of a specific user_id in favourites
const getFavouriteSneakers = function (user) {
  const querySQL = `SELECT item_id FROM favourites WHERE user_id = $1`
  return db.query(querySQL,[user])
  .then((res) => res.rowss);
};
exports.getFavouriteSneakers = getFavouriteSneakers;


/// Messages

// get messages
const getMessages = function(userId) {
    const querySQL = `SELECT from_users.id AS from_user_id, from_users.name AS from_user_name, to_users.name AS to_user_name, items.brand, items.title, STRING_AGG(messages.message, '|')
    FROM messages
    JOIN users AS to_users ON to_user_id = to_users.id
    JOIN users AS from_users ON from_user_id = from_users.id
    JOIN items ON item_id = items.id
    WHERE to_users.id = $1 OR from_users.id = $1
    GROUP BY from_users.id, from_users.name, to_users.name, items.brand, items.title;`

    return db.query(querySQL, [userId])
      .then((res) => {
        // console.log("database result", res);
        return res
      });
  };
exports.getMessages = getMessages;


/// Users that have messaged
const getUserMessages = function(userId) {
    const querySQL = `SELECT DISTINCT from_users.id AS from_user_id, from_users.name
    FROM messages
    JOIN users AS to_users ON to_user_id = to_users.id
    JOIN users AS from_users ON from_user_id = from_users.id
    JOIN items ON item_id = items.id
    WHERE to_users.id = $1 OR from_users.id = $1;`

    return db.query(querySQL, [userId])
      .then((res) => {
        // console.log("database result", res);
        return res
      });
  };
exports.getUserMessages = getUserMessages;


//// Get messages from specific user
const getMessagesFromUser = function(userId, fromUser) {
  const querySQL = `SELECT messages.id, messages.from_user_id, from_users.name AS from_user_name, messages.to_user_id, to_users.name AS to_user_name, items.brand, items.title, messages.message, items.id AS item_id
  FROM messages
  JOIN users AS to_users ON to_user_id = to_users.id
  JOIN users AS from_users ON from_user_id = from_users.id
  JOIN items ON item_id = items.id
  WHERE from_users.id = $2 AND to_users.id = $1 OR from_users.id = $1 AND to_users.id = $2
  ORDER BY messages.id;`

  return db.query(querySQL, [userId, fromUser])
    .then((res) => {
      //  console.log("database result", res);
      return res
    });
};
exports.getMessagesFromUser = getMessagesFromUser;

//// Post message to specific user
const postMessagesToUser = function(messageText, fromUser, toUser, sneakerId) {
  console.log(messageText);
  const sql = "INSERT INTO messages (from_user_id, to_user_id, item_id, message) VALUES ($2, $3, $4, $1);"
  return db.query(sql, [messageText, fromUser, toUser, sneakerId])
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('error', err));
};
exports.postMessagesToUser = postMessagesToUser;


///// General post message
const postMessages = function(messageText) {
  console.log(messageText);
  const sql = "INSERT INTO messages (from_user_id, to_user_id, item_id, message) VALUES (4, 5, 5, $1);"
  return db.query(sql, [messageText])
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('error', err));
};
exports.postMessages = postMessages;

/// Post messages to specific sneaker owner
/// .postMessagesToSneaker(messageText, userId, adminId)
const postMessagesToSneaker = function(messageText, fromUser, adminId, productId) {
  console.log(messageText);
  const sql = "INSERT INTO messages (from_user_id, to_user_id, item_id, message) VALUES ($2, $3, $4, $1);"
  return db.query(sql, [messageText, fromUser, adminId, productId])
  .then(res => {
    if(res.rows) {
      return res;
    } else {
      return null
    }
  })
  .catch(err => console.log('error', err));
};
exports.postMessagesToSneaker = postMessagesToSneaker;
