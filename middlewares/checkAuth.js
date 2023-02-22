const requireLogin = (req, res, next) => {
  /* Checking if the token is valid or not. */
  const token = req.session.jwt;
  /* This is checking if the token is valid or not. */

  console.log("====================================");
  console.log(req.session);
  console.log("====================================");

  /* Checking if the user is logged in or not. */
  if ((!req.session.user && !req.session.isAdmin) || !token) {
    return res.redirect("/login");
  }
  next();
};

export { requireLogin };
