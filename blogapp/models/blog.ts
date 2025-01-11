import { Schema, model } from "mongoose";
import { IBlog } from "../types/models";

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title."],
      minlength: [6, "Title should be at least 6 characters long."],
      maxlength: [100, "Title should be less than 100 characters long."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
      minlength: [10, "Description should be at least 10 characters long."],
      maxlength: [250, "Description should be less than 250 characters long."],
    },
    content: {
      type: String,
      required: [true, "Please provide content."],
      minlength: [50, "Content should be at least 50 characters long."],
    },
    img: {
      type: String,
      default: "",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the author."],
    },
    tags: {
      type: [
        {
          type: String,
          maxlength: [30, "Each tag should be less than 30 characters long."],
          lowercase: true,
        },
      ],
      required: [true, "Please provide at least one tag."],
      validate: {
        validator: (tags: string[]) => tags.length > 0,
        message: "Please provide at least one tag.",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ tags: 1 });

const Blog = model<IBlog>("Blog", BlogSchema);

export default Blog;
