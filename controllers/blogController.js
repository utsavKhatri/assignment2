
import slugify from "slugify";

import { Blog } from "../models/blogModel.js";
import { Category } from "../models/categoryModel.js";



const getBlog = async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const catData = await Category.find();
    const data = await Blog.findById(id);

    res.status(200).render("pages/editBlog", {
      data,
      catData,
      isLogged: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createBlog = (req, res) => {
  const { name, category, description, publishdate } = req.body;

  const { thumbnails, images } = req.files;
  console.log(req.body);
  const blogData = [
    name,
    category,
    description,
    publishdate,
    thumbnails,
    images,
  ];
  console.log(blogData);

  try {
    const blog = new Blog({
      name: name,
      category: category,
      description: description,
      blogImage: images,
      slug: slugify(name),
      publishDate: publishdate,
      thumbnail: thumbnails,
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
};

const createCategory = (req, res) => {
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
};

const editCategoryPage = (req, res) => {
  const id = req.params.catId;
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
};

const updateCategory = (req, res) => {
  try {
    const id = req.params.catId;

    console.log(req.body);
    Category.findByIdAndUpdate(id, req.body, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Category : ", data);
      }
    });
    res.redirect("/categories");
  } catch (error) {
    console.log("================= ===================");
    console.log(error);
    console.log("================= ===================");
  }
};

const removeCategory = (req, res, next) => {
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
};

const deleteBlog = (req, res, next) => {
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
  }

  const updateBlog = (req, res, next) => {
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
  }

export {
  getBlog,
  createBlog,
  createCategory,
  editCategoryPage,
  updateCategory,
  removeCategory,
  deleteBlog,
  updateBlog
};
