const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductsById,
  updateProduct,
} = require("../controller/product");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductsById)
  .patch("/:id", updateProduct);

exports.router = router;
