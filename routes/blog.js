import { Router } from "express";
import multer from "multer";
import {
  createBlog,
  createCategory,
  deleteBlog,
  editCategoryPage,
  getBlog,
  removeCategory,
  updateBlog,
  updateCategory,
} from "../controllers/blogController.js";
import { requireLogin } from "../middlewares/checkAuth.js";

/* This is the configuration for multer. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const filepath = new Date().getTime() + file.originalname;

    cb(null, filepath.replace(/ /g, "-"));
  },
});

/**
 * If the file is an image, then accept it, otherwise reject it
 */
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/* This is the configuration for multer. */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const blogRouter = Router();

/* This is a route that is used to get a blog post. */
blogRouter.get("/:blogId", requireLogin, getBlog);

/* This is a route that is used to create a blog post. */
blogRouter.post(
  "/add-blog",
  requireLogin,
  upload.fields([
    {
      name: "images",
      maxCount: 4,
    },
    {
      name: "thumbnails",
      maxCount: 1,
    },
  ]),
  createBlog
);

/* This is a route that is used to create a category. */
blogRouter.post("/create-category", requireLogin, createCategory);

/* This is a route that is used to get the edit category page. */
blogRouter.get("/edit-category/:catId", requireLogin, editCategoryPage);

/* This is a route that is used to update a category. */
blogRouter.post("/update-category/:catId", requireLogin, updateCategory);

/* This is a route that is used to delete a category. */
blogRouter.delete("/remove-category/:catId", requireLogin, removeCategory);

/* This is a route that is used to delete a blog post. */
blogRouter.delete("/:blogId", requireLogin, deleteBlog);

/* This is a route that is used to update a blog post. */
blogRouter.post(
  "/update/:blogId",
  requireLogin,
  upload.fields([
    {
      name: "images",
      maxCount: 4,
    },
    {
      name: "thumbnails",
      maxCount: 1,
    },
  ]),
  updateBlog
);

export default blogRouter;
