import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    blogImage: { type: Schema.Types.Mixed },
    slug: { type: String, required: true },
    publishDate: { type: Date, required: true },
    thumbnail: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model("Blogs", blogSchema);
