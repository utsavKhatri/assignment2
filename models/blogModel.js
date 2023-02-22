import mongoose, { Schema } from "mongoose";

/* This is creating a schema for the blog model. */
const blogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    blogImage: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, required: true },
    publishDate: { type: Date, required: true },
    thumbnail: { type: Schema.Types.Mixed, required: true },
    subtitle:{ type: String, required: true },
    author:{ type: String, required: true }
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model("Blogs", blogSchema);
