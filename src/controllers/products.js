const mysql = require("../db/mysql");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllProducts = (req, res) => {
  mysql.query("SELECT * FROM `products`", (err, results, fields) => {
    if (err) throw err;
    res.status(200).render("products", { results, pageTitle: "Products" });
  });
};

const getProduct = (req, res, next) => {
  const {
    params: { id },
  } = req;

  mysql.query(
    "SELECT * FROM `products` WHERE `id` = ?",
    id,
    (err, results, fields) => {
      if (err) throw err;
      if (!results[0]) {
        return next(new NotFoundError("Product does not exist"));
      }
      res.status(200).render("products", {
        result: results[0],
        results: null,
        pageTitle: "Product",
      });
    }
  );
};

const updateProduct = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query(
    "SELECT price FROM `products` WHERE `id` = ?",
    id,
    (err, results, fields) => {
      if (err) throw err;
      if (!results[0]) {
        return next(new NotFoundError("Product does not exist"));
      }
      mysql.query(
        "UPDATE `products` SET `price` = ? WHERE `id` = ?",
        [results[0].price + 1, id],
        (err, results, fields) => {
          if (err) throw err;
          res.status(200).redirect(`/products/${id}`);
        }
      );
    }
  );
};

const deleteProduct = (req, res) => {
  const {
    params: { id },
  } = req;

  mysql.query(
    "DELETE FROM `products` WHERE `id`= ?",
    id,
    (err, results, fields) => {
      if (err) throw err;
      res.status(200).redirect("/products");
    }
  );
};

const getInsertProduct = (req, res) => {
  res.status(201).render("insert", { pageTitle: "Insert" });
};

const postInsertProduct = (req, res, next) => {
  const {
    body: { name, price },
  } = req;
  if (!name || !price) {
    return next(
      new BadRequestError("Bad request, please provide name and price")
    );
  } else if (price.match(/\D/)) {
    return next(new BadRequestError("Bad request, only digit"));
  }
  mysql.query(
    "INSERT INTO products(name, price) VALUES(?,?)",
    [name, price],
    (err, results, fields) => {
      if (err) throw err;
      res.status(200).redirect("/products");
    }
  );
};

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  getInsertProduct,
  postInsertProduct,
};
