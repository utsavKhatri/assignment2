import jwt from "jsonwebtoken";

const requireLogin = (req, res, next) => {
  console.log("this is checkAuth middleware" + req.session.user);
  const token = req.session.jwt;
  /* This is checking if the token is valid or not. */
  if (token) {
    jwt.verify(token, "utsav", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
      }
    });
    return next();
  }
  res.redirect("/login");

  // console.log("====================================");
  // console.log(req.session);
  // console.log(req.session.jwt);
  // console.log("====================================");
  // if (!req.session.user) {
  //   return res.redirect("/login");
  // }
  // next();
};

export { requireLogin };
