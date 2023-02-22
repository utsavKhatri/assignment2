import express from "express";
import * as dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import blogRouter from "./routes/blog.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { notFound } from "./middlewares/notFound.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();


// "mongodb://utsavkh:675915xiCD4QCw3Vqt63f@15.206.7.200:28017/utsavkh?authMechanism=DEFAULT&authSource=admin";
const URL = process.env.MONGO_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



mongoose.set("strictQuery", false);

/* Connecting to the mongodb database. */
const conn = mongoose
  .connect(URL)
  .then(() => {
    console.log("connection is successful with DB");
  })
  .catch((err) => {
    console.log(`"No Connection...", ${err}`);
  });

  /* A middleware that is used to render the layout.ejs file. */
app.use(expressEjsLayouts);

app.use(express.urlencoded({ extended: false }));

/* public folder as a static folder. */
app.use(express.static(__dirname + "/public"));

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: MongoStore.create({
      mongoUrl: URL,
      secret: "secret",
      touchAfter: 24 * 60 * 60,
    }),
  })
);
// app.use(requireLogin)
app.use("/", indexRouter);

/* A middleware that is used to render the blogRouter.js file. */
app.use("/blogs", blogRouter);

app.use(notFound);

app.listen(3000, () => {
  console.log(`you are listening to http://localhost:3000/`);
});
