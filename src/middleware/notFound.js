const notFound = (req, res) => {
  res.status(404).render("pages/error", { msg: "Route not found" });
};

export default notFound;
