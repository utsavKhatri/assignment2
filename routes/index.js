import { Router } from "express";
import { Blog } from "../models/blogModel.js";


const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  Blog.find().then((result) => {
    res.render("pages/dashboard", { data: result });
  }).catch((err)=>{
    console.log(err);
  })
});

indexRouter.get("/icons", (req, res) => {
  res.render("pages/icons");
});

indexRouter.get("/add-blog", (req, res) => {
  res.render("pages/maps");
});

indexRouter.get("/tables", (req, res) => {
  res.render("pages/tables");
});
indexRouter.get("/login", (req, res) => {
  res.render("pages/login");
});
indexRouter.get("/signup", (req, res) => {
  res.render("pages/register");
});
indexRouter.get("/profile", (req, res) => {
  res.render("pages/profile");
});

// blogRouter.get('/add-blog',(req,res)=>{
//   const blogData = [req.body.name, req.body.category, req.body.description];
//   console.log(blogData);

//   try {
//       const blog = new Blog({
//           name: req.body.name,
//           category: req.body.category,
//           description:req.body.description
//       });

//       blog.save().then(result => {
//           console.log(result);
//           res.status(201).json(result);
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(500).json({
//             error: err
//           });
//         });
//   } catch (error) {
//       res.status(400).json(error)
//   }
  
// })

export default indexRouter;
