import { Blog } from "../models/blogModel.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category } from "../models/categoryModel.js";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "utsav", {
    expiresIn: maxAge,
  });
};

const dashboardController = (req, res) => {
  try {
    console.log("============= this is home page =======================");
    console.log(req.session.user);    
    console.log("====================================");
    console.log(req.session.jwt);  
    console.log("====================================");
    Blog.find()
      .then((result) => {
        res.render("pages/dashboard", { data: result, isLogged: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json(error.message);
    console.log(error.message);
  }
};

const iconController = (req, res) => {
  res.render("pages/icons", { isLogged: true });
};

const addBlog = (req, res) => {
  Category.find()
    .then((result) => {
      res.render("pages/createBlog", { catData: result, isLogged: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

const viewCategory = (req, res) => {
  try {
    Category.find()
      .then((result) => {
        res.render("pages/categories", { catData: result, isLogged: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

const addCategory = (req, res) => {
  res.render("pages/category", { isLogged: true });
};

const userSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    // Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    /* Setting the session data. */
    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    req.session.isAdmin = newUser.isAdmin;

    console.log("====================================");
    console.log(req.session.user);
    console.log(req.session.isAdmin);
    console.log("====================================");

    res.redirect("/login");
    return next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("====================================");
    console.log(email, password);
    console.log("====================================");
    // Check if user is already logged in
    if (req.session.user) {
      if (req.session.user.isAdmin) {
        res.redirect("/");
      }else{
        return res.redirect("/home");
      }
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    req.session.jwt = token;

    console.log("this is cookie from session" + req.session.jwt);
    // Set the session data and redirect to homepage
    req.session.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    if (user.isAdmin) {
      req.session.isAdmin = true;
      return res.status(200).redirect("/");
    }
    return res.status(200).redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginPage = (req, res, next) => {
  try {
    console.log("this is login page " + req.session.user || req.session.id);
    if (req.session.user) {
      if (req.session.isAdmin) {
        res.redirect('/')
      }else{
        res.redirect("/home");
      }
    } else {
      res.render("pages/login");
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

const signupPage = (req, res) => {
  res.render("pages/register");
};

const viewProfile = (req, res) => {
  try {
    const id = req.session.user.id;
    User.findById(id)
      .then((result) => {
        res.render("pages/profile", { data: result, isLogged: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

const logoutController = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

const homeController = async (req, res) => {
  try {

    const profile = req.session.user;
    const blogData = await Blog.find().sort({ createdAt: -1 });

    res.render("pages/home", { data: blogData, userData: profile });
  } catch (error) {
    console.log(error.message);
  }
};

const blogDetailed = async (req, res) => {
  try {
    console.log("this is slug   " + req.params.slug);
    const blogDetail = await Blog.find({ slug: req.params.slug });
    console.log(blogDetail);

    res.render("pages/blog", { data: blogDetail });
  } catch (error) {
    console.log(error.message);
  }
};

const aboutPage = (req,res)=>{
  res.render("pages/about");
}

export {
  dashboardController,
  iconController,
  addBlog,
  viewCategory,
  addCategory,
  userSignup,
  userLogin,
  loginPage,
  signupPage,
  viewProfile,
  logoutController,
  homeController,
  blogDetailed,
  aboutPage,
  maxAge,
};
