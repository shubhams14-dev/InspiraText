import { configDotenv } from "dotenv";  // Corrected import statement
import * as path from "path";
const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath });  // Load environment variables from .env file

import mongoose from "mongoose";
import Blog from "../../models/blog";
import connectDB from "../../db/connect";

const changeTagsToLowerCase = async () => {
  try {
    // Connect to the database
    const db = await connectDB(process.env.MONGO_URL as string);

    // Fetch all blogs with tags and title
    const blogs = await Blog.find({}).select("tags title");

    // Loop through each blog
    for (let blog of blogs) {
      console.log(blog._id);

      // Trim title to 100 characters if it exceeds 100 characters
      if (blog.title.length > 100) {
        blog.title = blog.title.slice(0, 100);
      }

      // Convert all tags to lowercase
      blog.tags.forEach((tag, index) => {
        blog.tags[index] = tag.toLowerCase();
      });

      // Save the updated blog
      await blog.save();
    }

    // Close the MongoDB connection
    mongoose.connection.close();

    // Exit the process after completion
    process.exit(0);
  } catch (error) {
    console.error(error);
 
  }
};

// Run the function
changeTagsToLowerCase();
