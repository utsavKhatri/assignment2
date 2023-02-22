import mongoose from "mongoose";

/* Creating a schema for the category model. */
const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
