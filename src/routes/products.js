const express = require("express");
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getInsertProduct,
  postInsertProduct,
} = require("../controllers/products");
const router = express.Router();

router.route("/").get(getAllProducts);
router.route("/insert").get(getInsertProduct).post(postInsertProduct);
router.route("/:id(\\d+)").get(getProduct);
router.route("/:id(\\d+)/update").get(updateProduct);
router.route("/:id(\\d+)/delete").get(deleteProduct);

module.exports = router;
