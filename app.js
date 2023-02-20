import express from "express";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import blogRouter from "./routes/blog.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

// import requireLogin from './middlewares/checkAuth.js';

dotenv.config();

const app = express();

const URL =
  "mongodb://utsavkh:675915xiCD4QCw3Vqt63f@15.206.7.200:28017/utsavkh?authMechanism=DEFAULT&authSource=admin";
/* Connecting to the mongodb database. */

mongoose.set("strictQuery", false);

const conn = mongoose
  .connect(URL)
  .then(() => {
    console.log("connection is successful with DB");
  })
  .catch((err) => {
    console.log(`"No Connection...", ${err}`);
  });

app.use(expressEjsLayouts);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* public folder as a static folder. */

// app.use(express.static(path.join("public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
// const sessionStore = new MongoStore({
//   mongooseConnection: conn,
//   collection: "sessions",
// });
//session middleware
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
app.use("/blogs", blogRouter);

// courseController(app);

app.listen(3000, () => {
  console.log(`you are listening to http://localhost:3000/`);
});
