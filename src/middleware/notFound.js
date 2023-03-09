const notFound = (req, res) => {
  return res.status(404).render("pages/error", { msg: "Route not found" });
};

module.exports = notFound;
