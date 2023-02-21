import jwt from "jsonwebtoken";

const requireLogin = (req, res, next) => {
  console.log("this is checkAuth middleware" + req.session.user);
  const token = req.session.jwt;
  /* This is checking if the token is valid or not. */

  console.log("====================================");
  console.log(req.session);
  console.log(token);
  console.log("====================================");
  if (!req.session.user && !req.session.isAdmin || !token) {
    return res.redirect("/login");
  }
  next();
};

export { requireLogin };