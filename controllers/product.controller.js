const db = require("../config/db.js");
const { criteria } = require("../helpers/product.helper.js");

function getAllProducts(req, res) {
  const { query } = req;
  let sql = `select p.product_id, p.product_name, s.seller_name, product_price, p.category, product_description from products p
  join sellers s
  on s.seller_id = p.seller_id`;
  //   let sql = "select * FROM products";

  try {
    const { conditions, params } = criteria(query);

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving products" });
      }

      res
        .status(200)
        .json(result.length === 0 ? { message: "no results" } : result);
    });
  } catch (error) {
    console.log(error);
  }
}

// function getAllProducts(req, res) {
//   // Extract criteria from query parameters
//   const { product_name, category, min_price, max_price } = req.query;

//   // Base SQL query
//   let sql = "SELECT * FROM products";
//   let conditions = [];
//   let params = [];

//   // Add conditions based on criteria
//   if (product_name) {
//     conditions.push("product_name LIKE ?");
//     params.push(`%${product_name}%`);
//   }
//   if (category) {
//     conditions.push("category = ?");
//     params.push(category);
//   }
//   if (min_price) {
//     conditions.push("product_price >= ?");
//     params.push(parseFloat(min_price));
//   }
//   if (max_price) {
//     conditions.push("product_price <= ?");
//     params.push(parseFloat(max_price));
//   }

//   // Combine conditions with the base query
//   if (conditions.length > 0) {
//     sql += " WHERE " + conditions.join(" AND ");
//   }

//   // Execute the query
//   try {
//     db.query(sql, params, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal Server Error" });
//       }

//       res.status(200).json(result);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

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
