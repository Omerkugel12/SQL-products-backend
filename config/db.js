const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Omer2305!",
  database: "products_schema",
});

module.exports = db;
