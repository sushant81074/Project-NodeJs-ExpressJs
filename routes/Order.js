const express = require("express");
const {
  createOrder,
  fetchOrderByUser,
  deleteFromOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controller/Order");
const router = express.Router();

router
  .post("/", createOrder)
  .get("/own", fetchOrderByUser)
  .delete("/:id", deleteFromOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);
exports.router = router;
