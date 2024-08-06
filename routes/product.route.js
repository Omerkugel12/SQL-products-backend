const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductsCount,
  getProductById,
  deleteProduct,
  addProduct,
  updateProduct,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);
router.get("/count", getProductsCount);
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProduct);
router.post("/", addProduct);
router.patch("/:productId", updateProduct);

module.exports = router;
