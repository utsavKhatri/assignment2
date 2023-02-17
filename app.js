import express from "express";
import mongoose from "mongoose";


import * as dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import blogRouter from "./routes/blog.js";

dotenv.config();

const app = express();


const URL = "mongodb://utsavkh:675915xiCD4QCw3Vqt63f@15.206.7.200:28017/utsavkh?authMechanism=DEFAULT&authSource=admin"
/* Connecting to the mongodb database. */

mongoose.set("strictQuery", false);

mongoose
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

/* Allowing the client to access the server. */
// app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use('/', indexRouter);
app.use('/blogs', blogRouter);

// courseController(app);

app.listen(3000, () => {
  console.log(`you are listening to http://localhost:3000/`);
});