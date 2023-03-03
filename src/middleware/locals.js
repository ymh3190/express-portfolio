const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Express-Portfolio";
  res.locals.user = req.user || {};
  next();
};

module.exports = localsMiddleware;
