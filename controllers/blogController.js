import slugify from "slugify";

import { Blog } from "../models/blogModel.js";
import { Category } from "../models/categoryModel.js";


// render blog on home page
const getBlog = async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const catData = await Category.find();
    const data = await Blog.findById(id);

    /* This is rendering the editBlog page with the data from the database. */
    res.status(200).render("pages/editBlog", {
      data,
      catData,
      isLogged: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * It takes the data from the form, 
 * creates a new blog object, 
 * and saves it to the database
 */
const createBlog = (req, res) => {
  /* Destructuring the data from the form. */
  const { name, category, description, publishdate, subtitle, author } =
    req.body;

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
      subtitle: subtitle,
      author: author,
    });

    /* Saving the blog data to the database. */
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
// create category and store in db
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
// render editCategoryPage
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

/**
 * It finds the category by its id and 
 * updates it with the new data
 */
const updateCategory = async(req, res) => {
  try {
    const id = req.params.catId;

    console.log(req.body);
    await Category.findByIdAndUpdate(id, req.body);
    console.log("data update successfully");
    res.redirect("/categories");
  } catch (error) {
    console.log(error.message);
  }
};
// handle remove category from db
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
// handle remove blog data from db
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
};
// handle update blog functionality
const updateBlog = (req, res, next) => {
  try {
    const id = req.params.blogId;

    const { name, category, description, subtitle, author } =
    req.body;

  const { thumbnails, images } = req.files;

  const updateData = {
    name:name,
    category:category,
    description: description,
    blogImage: images,
    slug: slugify(name),
    thumbnail: thumbnails,
    author:author,
    subtitle:subtitle,
  }

    console.log(req.body);
    Blog.findByIdAndUpdate(id, updateData, (err, data) => {
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
};

/**
 * It takes the search term from the search bar and 
 * searches the database for any blogs that have the
 * search term in their name or description
 */
const searchBlog = async (req, res) => {
/* Searching the database for any blogs that have the search term in their name or description. */
  try {
    const query = req.body.searchTerm;
    console.log(query);
    const searchResult = await Blog.find({
      $or: [{ name: query }, { description: query }],
    });
    res.json(searchResult).redirect("/home");
  } catch (error) {
    console.log(error.message);
  }
};

export {
  getBlog,
  createBlog,
  createCategory,
  editCategoryPage,
  updateCategory,
  removeCategory,
  deleteBlog,
  updateBlog,
  searchBlog,
};
