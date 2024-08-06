const express = require("express");
const app = express();
const cors = require("cors");
PORT = process.env.PORT || 3000;
const db = require("./config/db");

// Middleware to parse JSON request bodies

function main() {
  db.connect((err) => {
    if (err) {
      console.log(err);
    }
    console.log("Connected to MySQL database");
  });

  app.use(express.json());
  app.use(cors());

  //routes
  const productRoutes = require("./routes/product.route");

  app.use("/product", productRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();

// Middleware to log incoming requests
