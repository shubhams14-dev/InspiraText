import { configDotenv } from "dotenv";
import * as path from "path";
const newPath = path.join(__dirname, "..", "..", ".env");
configDotenv({ path: newPath });

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Blog from "../../models/blog";
import connectDB from "../../db/connect";

const changeContent = async () => {
  try {
    // Connect to MongoDB
    const db = await connectDB(process.env.MONGO_URL as string);

    // Fetch blogs and select only the content field
    const blogs = await Blog.find({}).select("content");

    // Iterate through each blog
    for (let blog of blogs) {
      // If the blog's ID does not start with "bbbbbbbb", log the ID
      if (blog._id.toString().slice(0, 8) !== "bbbbbbbb") {
        console.log(blog._id);
      }

      // Parse the current content, then transform it to the required structure
      const text = JSON.parse(blog.content)
        .blocks.map((block: any) => block.data.text)  // Get text from all blocks
        .join("\n\n");  // Join the text with new lines for separation

      // Update the blog content with the new structure
      blog.content = JSON.stringify({
        time: 1550476186479,  // Timestamp for the content
        blocks: text.split("\n\n").map((paragraph: any) => ({
          id: uuidv4(),  // Generate a new UUID for each block
          type: "paragraph",  // Type for each block is paragraph
          data: {
            text: paragraph.trim(),  // Trim whitespace from each paragraph
          },
        })),
        version: "2.8.1",  // Content version
      });

      // Save the updated blog content to the database
      await blog.save();
    }

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    // Log any errors that occur during the process
    console.error(error);
  }
};

// Run the function
changeContent();
