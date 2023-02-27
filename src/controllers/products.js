const mysql = require("../db/mysql");
const { createCustomError } = require("../errors/custom-error");

const getAllProducts = (req, res) => {
  mysql.query("SELECT * FROM products", (err, results, fields) => {
    if (err) throw err;
    res.status(200).render("products", { results });
  });
};

const getProduct = (req, res, next) => {
  const {
    params: { id },
  } = req;
  mysql.query(
    `SELECT * FROM products WHERE id=${id}`,
    (err, results, fields) => {
      if (err) throw err;
      if (!results[0]) {
        return next(createCustomError("Product does not exist", 404));
      }
      // console.log(`/:id ${results[0]}`);
      res.status(200).render("products", { result: results[0], results: null });
    }
  );
};

const updateProduct = (req, res) => {
  const {
    params: { id },
  } = req;
  mysql.query(
    `SELECT price FROM products WHERE id=${id}`,
    (err, results, fields) => {
      if (err) throw err;
      mysql.query(
        `UPDATE products SET price=${results[0].price + 1} WHERE id=${id}`,
        (err, results, fields) => {
          if (err) throw err;
          console.log(`update: ${results.message}`);
          res.status(200).redirect(`/${id}`);
        }
      );
    }
  );
};

const deleteProduct = (req, res) => {
  const {
    params: { id },
  } = req;
  mysql.query(`DELETE FROM products WHERE id=${id}`, (err, results, fields) => {
    if (err) throw err;
    console.log(`DELETE ${id}`);
    res.status(200).render("products", { results });
  });
};

const insertProduct = (req, res) => {
  mysql.query(
    "INSERT INTO products(name, price) VALUES('iphone',100), ('ipad',100), ('macbook', 130)",
    (err, results, fields) => {
      if (err) throw err;
      console.log(results.message);
      res.status(201).render("products", {
        results: results.message ? results.message : [],
      });
    }
  );
};

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  insertProduct,
};
