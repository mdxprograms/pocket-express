export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    next();
  } else {
    res.status(401).redirect("/login");
  }
};
