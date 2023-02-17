import { Router } from "express";
import { Blog } from "../models/blogModel.js";

const blogRouter = Router();

blogRouter.post("/add-blog", (req, res) => {
  const blogData = [req.body.name, req.body.category, req.body.description];
  console.log(blogData);

  try {
    const blog = new Blog({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
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
    res.status(400).json(error);
  }
});

blogRouter.delete("/:blogId", (req, res, next) => {
    const id = req.params.blogId;
    console.log(id);
    Blog.findByIdAndRemove({ _id: id })
      .exec()
      .then(result => {
        res.json({ redirect: "/" });
        // res.status(200).json({redirect: '/'});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  blogRouter.get("/:blogId", (req, res, next) => {
    const id = req.params.blogId;
    Blog.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
  
  blogRouter.patch("/:blogId", (req, res, next) => {
    const id = req.params.blogId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Blog.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

export default blogRouter;
