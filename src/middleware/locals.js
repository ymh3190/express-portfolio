/**
 * res.render에서 객체를 따로 추가하지 않더라도
 * app.use()를 통해 ejs파일 전역에서 사용 가능하게 함
 */
const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Express-Portfolio";
  res.locals.user = req.session.user || null;
  next();
};

export default localsMiddleware;
