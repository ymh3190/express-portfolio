const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Express-Portfolio";
  res.locals.user = req.session.user || null;
  next();
};

module.exports = localsMiddleware;
