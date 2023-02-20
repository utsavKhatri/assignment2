import { Router } from "express";
import multer from "multer";
import slugify from "slugify";

import { Blog } from "../models/blogModel.js";
import { Category } from "../models/categoryModel.js";

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

blogRouter.get("/:blogId", (req, res, next) => {
  const id = req.params.blogId;
  let catData;
  Category.find()
    .then((result) => {
      catData = result;
    })
    .catch((err) => {
      console.log(err);
    });

  Blog.findById(id)
    .exec()
    .then((result) => {
      console.log("From database", result);
      if (result) {
        res.status(200).render("pages/tables", {
          data: result,
          catd: catData,
          isLogged: true,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

blogRouter.post("/add-blog", upload.single("images"), (req, res) => {
  console.log(req.body);
  const blogData = [
    req.body.name,
    req.body.category,
    req.body.description,
    req.file,
  ];
  console.log(blogData);

  try {
    const blog = new Blog({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      blogImage: req.file.filename,
      slug: slugify(req.body.name),
    });

    blog
      .save()
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

blogRouter.post("/create-category", (req, res) => {
  try {
    const catData = req.body.categoryName;
    console.log(catData);

    const category = new Category({
      categoryName: catData,
    });

    category
      .save()
      .then((result) => {
        console.log(result);
        res.redirect("/categories");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    console.log(error);
  }
});

blogRouter.get("/edit-category/:catId", (req, res) => {
  const id = req.params.blogId;
  Category.findById(id)
    .exec()
    .then((result) => {
      console.log("From database", result);
      if (result) {
        res
          .status(200)
          .render("pages/editcategory", { catData: result, isLogged: true });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

blogRouter.post("/update-category/:catId", (req, res) => {
  try {
    const id = req.params.catId;

    console.log(req.body);
    Category.findByIdAndUpdate(id, req.body, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", data);
      }
    });
    res.redirect("/categories");
  } catch (error) {
    console.log("================= ===================");
    console.log(error);
    console.log("================= ===================");
  }
});

blogRouter.delete("/remove-category/:catId", (req, res, next) => {
  const id = req.params.catId;
  console.log(id);
  Category.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.json({ redirect: "/categories" });
      // res.status(200).json({redirect: '/'});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

blogRouter.delete("/:blogId", (req, res, next) => {
  const id = req.params.blogId;
  console.log(id);
  Blog.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.json({ redirect: "/" });
      // res.status(200).json({redirect: '/'});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

blogRouter.post("/update/:blogId", (req, res, next) => {
  try {
    const id = req.params.blogId;

    console.log(req.body);
    Blog.findByIdAndUpdate(id, req.body, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", data);
      }
    });
    res.redirect("/");
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

export default blogRouter;
