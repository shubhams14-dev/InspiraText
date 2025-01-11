import { configDotenv } from "dotenv"; // Corrected import statement for dotenv
import * as path from "path";
const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath }); // Load environment variables from .env file

import Blog from "../../models/blog";
import User from "../../models/user";
import connectDB from "../../db/connect";
import { Schema, Types } from "mongoose";

// Function to get the number of blogs for each user
const getBlogsByEachUser = async () => {
  try {
    const db = await connectDB(process.env.MONGO_URL as string);

    // Fetch all blogs
    const blogs = await Blog.find({});

    // Count blogs by author
    let acc: { [key: string]: number } = {};
    const blogsByAuthor = blogs.reduce(
      (acc, blog) => {
        const author = blog.author.toString();
        if (!acc[author]) {
          acc[author] = 0;
        }
        acc[author]++;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Sort blogs by author count in descending order
    const sortedBlogsByAuthor = Object.entries(blogsByAuthor).sort(
      (a, b) => b[1] - a[1]
    );

    console.log(sortedBlogsByAuthor.slice(0, 5)); // Top 5 authors by blog count

  } catch (error) {
    console.error(error);
  }
};

// Function to change the author of the first 40 blogs
const changeBlogAuthor = async () => {
  try {
    const db = await connectDB(process.env.MONGO_URL as string);

    // Fetch all blogs
    const blogs = await Blog.find({});

    // Change author of the first 40 blogs to a new author ID
    const blogsToUpdate = blogs.slice(0, 40);
    await Promise.all(
      blogsToUpdate.map(async (blog) => {
        blog.author = new Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa1") as any as Schema.Types.ObjectId;
        await blog.save();
      })
    );

    // Find the user by ID
    const user = await User.findById("aaaaaaaaaaaaaaaaaaaaaa");
    if (!user) {
      console.log("User not found");
      process.exit(0);
    }
    console.log("User found");

    // Fetch updated blogs for the user
    const updatedBlogs = await Blog.find({ author: user._id });
    console.log(updatedBlogs.length); // Log the number of blogs associated with the user

    // Update user's blogs array
    user.set(
      "blogs",
      updatedBlogs.map((blog) => blog._id)
    );
    await user.save();

    console.log(user);
    console.log("Author changed successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
  }
};

// Call the function to get blogs by each user
getBlogsByEachUser();
changeBlogAuthor()