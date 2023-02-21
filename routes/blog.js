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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const filepath = new Date().getTime() + file.originalname;

    cb(null, filepath.replace(/ /g, "-"));
  },
});

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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const blogRouter = Router();

blogRouter.get("/:blogId",requireLogin, getBlog);

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

blogRouter.post("/create-category",requireLogin, createCategory);

blogRouter.get("/edit-category/:catId",requireLogin, editCategoryPage);

blogRouter.post("/update-category/:catId",requireLogin, updateCategory);

blogRouter.delete("/remove-category/:catId",requireLogin, removeCategory);

blogRouter.delete("/:blogId",requireLogin, deleteBlog);

blogRouter.post("/update/:blogId",requireLogin, updateBlog);

export default blogRouter;
