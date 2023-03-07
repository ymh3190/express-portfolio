const mysql = require("../dbs/mysql");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllProducts = async (req, res) => {
  mysql.query("SELECT * FROM `products`", (err, results) => {
    if (err) throw err;
    res
      .status(200)
      .render("pages/products", { results, pageTitle: "Products" });
  });
};

const getProduct = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const sql = "SELECT * FROM `products` WHERE `id` = ?";
  mysql.query(sql, id, (err, results) => {
    if (err) throw err;
    if (!results[0]) {
      return next(new NotFoundError("Product does not exist"));
    }
    res.status(200).render("pages/products", {
      result: results[0],
      results: null,
      pageTitle: "Product",
    });
  });
};

const updateProduct = (req, res) => {
  const {
    params: { id },
  } = req;
  let sql = "SELECT price FROM `products` WHERE `id` = ?";
  mysql.query(sql, id, (err, results) => {
    if (err) throw err;
    if (!results[0]) {
      return next(new NotFoundError("Product does not exist"));
    }
    sql = "UPDATE `products` SET `price` = ? WHERE `id` = ?";
    mysql.query(sql, [results[0].price + 1, id], (err, results) => {
      if (err) throw err;
      res.status(200).redirect(`/products/${id}`);
    });
  });
};

const deleteProduct = (req, res) => {
  const {
    params: { id },
  } = req;
  const sql = "DELETE FROM `products` WHERE `id` = ?";
  mysql.query(sql, id, (err, results) => {
    if (err) throw err;
    res.status(200).redirect("/products");
  });
};

const getInsertProduct = (req, res) => {
  res.status(201).render("pages/insert", { pageTitle: "Insert" });
};

const postInsertProduct = (req, res, next) => {
  const {
    body: { name, price },
  } = req;
  if (!name || !price) {
    return next(new BadRequestError("please provide name and price"));
  } else if (price.match(/\D/)) {
    return next(new BadRequestError("only digit"));
  }
  const sql = "INSERT INTO products(name, price) VALUES(?, ?)";
  mysql.query(sql, [name, price], (err, results) => {
    if (err) throw err;
    res.status(200).redirect("/products");
  });
};

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getInsertProduct,
  postInsertProduct,
};
