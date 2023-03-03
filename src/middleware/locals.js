const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Express-Portfolio";
  res.locals.user = req.user || null;
  next();
};

module.exports = localsMiddleware;
