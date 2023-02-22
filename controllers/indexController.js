import { Blog } from "../models/blogModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category } from "../models/categoryModel.js";

const maxAge = 3 * 24 * 60 * 60;
/**
 * It takes an id as an argument and returns a token that expires in 24 hours
 * @param id - The user's id
 * @returns A token is being returned.
 */
const createToken = (id) => {
  return jwt.sign({ id }, "utsav", {
    expiresIn: maxAge,
  });
};

/**
 * It fetches all the blogs from the database and renders the dashboard page with the fetched data
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const dashboardController = (req, res) => {
  try {
    console.log("============= this is home page =======================");
    console.log(req.session.user);
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

/**
 * This function renders the icons page.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - the response object
 */
const iconController = (req, res) => {
  res.render("pages/icons", { isLogged: true });
};

/**
 * It renders the createBlog page with the category data and isLogged value
 * @param req - This is the request object. It contains information about the HTTP request that raised
 * the event.
 * @param res - The response object.
 */
const addBlog = (req, res) => {
  Category.find()
    .then((result) => {
      res.render("pages/createBlog", { catData: result, isLogged: true });
    })
    .catch((err) => {
      console.log(err);
    });
};


// It fetches all the categories from the database and renders the categories page with the fetched data

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


// It renders the category page

const addCategory = (req, res) => {
  res.render("pages/category", { isLogged: true });
};

/**
 * It creates a new user in the database and sets the session data
 */
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
      } else {
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

/* Creating a token and setting it to the session. */
    const token = createToken(user._id);

    req.session.jwt = token;

    console.log("this is cookie from session" + req.session.jwt);
    // Set the session data and redirect to homepage
    req.session.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
/* Checking if the user is an admin or not. If the user is an admin, then it sets the session data and
redirects to the homepage. */
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

/**
 * This function renders the login page if the user is not logged in.
 */
const loginPage = (req, res, next) => {
  try {
    console.log("this is login page " + req.session.user || req.session.id);
    /* This is checking if the user is already logged in or not. If the user is already logged in, then
    it checks if the user is an admin or not. If the user is an admin, then it redirects to the
    homepage. If the user is not an admin, then it redirects to the home page. If the user is not
    logged in, then it renders the login page. */
    if (req.session.user) {
      if (req.session.isAdmin) {
        res.redirect("/");
      } else {
        res.redirect("/home");
      }
    } else {
      res.render("pages/login");
    }
  } catch (error) {
    console.log(error);
  }
};
/**
 * When the user visits the /register route, render the register.ejs file.
 */

const signupPage = (req, res) => {
  res.render("pages/register");
};

/**
 * It finds the user by their id, and then renders the profile page with the user's data
 */
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

/**
 * It destroys the session and then redirects the user to the home page
 */
const logoutController = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

/**
 * It fetches all the blog posts from the database and renders the home page with the blog posts
 */
const homeController = async (req, res) => {
  try {
    const profile = req.session.user;

    const serachterm = req.query.searchTerm;
    console.log(serachterm);
    const categoryData = await Category.find();
    const blogData = await Blog.find().sort({ createdAt: -1 });
    if (serachterm) {
      const searchResult = await Blog.find({ name: { $regex: serachterm } });

      console.log(searchResult);

      return res.render("pages/home", {
        data: blogData,
        userData: profile,
        searchResult: searchResult,
        isResult: true,
        categoryData: categoryData,
      });
    }

    res.render("pages/home", {
      data: blogData,
      userData: profile,
      isResult: false,
      categoryData: categoryData,

    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * It finds the blog post with the slug that matches the slug in the URL and renders the blog page with the data of that blog post
 */
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
/**
 * It takes the category name from the URL and finds all the blogs that have that category name
 */
const categoryPage = async (req, res) => {
  try {
    const profile = req.session.user;
    const term = req.params.categoryname;
    console.log(term);
    const blogData = await Blog.find({ category: term });
    const categoryData = await Category.find();

    console.log(blogData);
    res.render("pages/blogbyCategory", {
      data: blogData,
      categoryData: categoryData,
      userData: profile,
      categoryName: term
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * When the user visits the about page, render the about page.
 */
const aboutPage = (req, res) => {
  res.render("pages/about");
};

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
  categoryPage,
};
