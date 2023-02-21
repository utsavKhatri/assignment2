import { Router } from "express";

import { requireLogin } from "../middlewares/checkAuth.js";

import {
  aboutPage,
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

indexRouter.get("/icons",requireLogin, iconController);

indexRouter.get("/add-blog",requireLogin, addBlog);

indexRouter.get("/categories",requireLogin, viewCategory);

indexRouter.get("/add-category",requireLogin, addCategory);

indexRouter.post("/register", userSignup);

indexRouter.post("/login", userLogin);

indexRouter.get("/login", loginPage);

indexRouter.get("/signup", signupPage);

indexRouter.get("/profile",requireLogin, viewProfile);

indexRouter.get("/logout", logoutController);

indexRouter.get("/home", homeController);
indexRouter.get("/home/:slug", blogDetailed);
indexRouter.get("/about",aboutPage)


export default indexRouter;
