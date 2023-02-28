const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Express-Portfolio";
  next();
};

module.exports = localsMiddleware;
