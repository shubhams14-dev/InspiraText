import { CustomAPIError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";

const errorHandlerMiddleware = (
  err: Error | CustomAPIError | mongoose.Error | multer.MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "development") {
    // Check if the error has a `message` property
    if ("message" in err) {
      console.error("ERROR: " + err.message);
    } else {
      console.error("ERROR: Unknown error type.");
    }
  }

  // Custom Error
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ success: false, msg: err.message });
  }

  // JWT Error
  if (err instanceof jwt.JsonWebTokenError) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Session Expired. Please login again.",
      });
    }
    if (err instanceof jwt.NotBeforeError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Login Expired. Please login again.",
      });
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "Not authorized" });
  }

  // Mongoose Error
  if (err instanceof mongoose.Error) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `No item found with id : ${err.value}`,
      });
    } else if (err instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(err.errors)
        .map((item: any) => item.message)
        .join("\n");
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: messages,
      });
    } else {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: "Mongoose error: Something went wrong" });
    }
  }

  // Multer Error
  const multerErrorMessages: { [key: string]: string } = {
    LIMIT_PART_COUNT: "Too many parts",
    LIMIT_FILE_SIZE: "File size is too large. Max limit is 4MB",
    LIMIT_FILE_COUNT: "Too many files",
    LIMIT_FIELD_KEY: "Field name is too long",
    LIMIT_FIELD_VALUE: "Field value is too long",
    LIMIT_FIELD_COUNT: "Too many fields",
    LIMIT_UNEXPECTED_FILE:
      "Unexpected file: Accepted files are jpg, jpeg, png",
  };

  if (err instanceof multer.MulterError) {
    const errorCode = err.code;
    const errorMessage =
      multerErrorMessages[errorCode] || "Unknown Multer error";
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      msg: errorMessage,
    });
  }

  // Unknown error occurred
  console.log(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: "Something went wrong" });
};

export default errorHandlerMiddleware;
