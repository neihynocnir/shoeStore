-- Widgets table seeds here (Example)
INSERT INTO messages (id, from_user_id, to_user_id, item_id, message) VALUES (1, 1, 2, 1, 'Hey, I like these snickers');
INSERT INTO messages (id, from_user_id, to_user_id, item_id, message) VALUES (2, 2, 3, 3, 'Hey, I love these snickers');
INSERT INTO messages (id, from_user_id, to_user_id, item_id, message) VALUES (3, 3, 4, 5, 'These snickers are cool');

ALTER SEQUENCE messages_id_seq RESTART WITH 4;
