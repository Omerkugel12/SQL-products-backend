const db = require("../config/db.js");

function getAllProducts(req, res) {
  const { product_name, category, min_price, max_price } = req.query;
  let sql = `select * from products`;
  let conditions = [];
  let params = [];

  if (product_name) {
    conditions.push(`product_name LIKE ?`);
    params.push(`%${product_name}%`);
  }

  if (category) {
    conditions.push(`category LIKE ?`);
    params.push(`%${category}%`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  try {
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
}

function getProductsCount(req, res) {
  const sql = "SELECT COUNT(*) as count FROM products";
  try {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
}

function getProductById(req, res) {
  const { productId } = req.params;
  try {
    const sql = "SELECT * FROM products WHERE product_id = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.log(err);
      }
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (!result.length) {
        console.log(
          `product.controller, getProductById: Product not found with id: ${productId}`
        );
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(result[0]);
    });
  } catch (error) {
    console.log(error);
  }
}

function deleteProduct(req, res) {
  const { productId } = req.params;
  try {
    const sql = "DELETE FROM products WHERE product_id = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    });
  } catch (error) {
    console.log(error);
  }
}

function addProduct(req, res) {
  const newProduct = req.body;
  try {
    const sql = "INSERT INTO products SET?";
    db.query(sql, newProduct, (err, result) => {
      res.status(201).json({ message: "Product added successfully" });
    });
  } catch (error) {
    console.log(error);
  }
}

function updateProduct(req, res) {
  const { productId } = req.params;
  try {
    const sql = "UPDATE products SET? WHERE product_id =?";
    db.query(sql, [req.body, productId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAllProducts,
  getProductsCount,
  getProductById,
  deleteProduct,
  addProduct,
  updateProduct,
};
