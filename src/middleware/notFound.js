/**
 * 정의된 route가 없을 경우 에러를 던짐
 */
const notFound = (req, res) => {
  res.status(404).render("pages/error", { msg: "Route not found" });
};

export default notFound;
