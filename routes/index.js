import { Router } from "express";

import { requireLogin } from "../middlewares/checkAuth.js";

import {
  addBlog,
  addCategory,
  blogDetailed,
  dashboardController,
  homeController,
  iconController,
  loginPage,
  logoutController,
  signupPage,
  userLogin,
  userSignup,
  viewCategory,
  viewProfile,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", requireLogin, dashboardController);

indexRouter.get("/icons", iconController);

indexRouter.get("/add-blog", addBlog);

indexRouter.get("/categories", viewCategory);

indexRouter.get("/add-category", addCategory);

indexRouter.post("/register", userSignup);

indexRouter.post("/login", userLogin);

indexRouter.get("/login", loginPage);

indexRouter.get("/signup", signupPage);

indexRouter.get("/profile", viewProfile);

indexRouter.get("/logout", logoutController);

indexRouter.get("/home", homeController);
indexRouter.get("/home/:slug", blogDetailed);


export default indexRouter;
