import { CustomAPIError } from "../errors"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import multer from "multer"
const errorHandlerMiddleware = (
// err can be instance of Error or CustomAPIError or mongoos
err: Error | CustomAPIError | mongoose.Error | multer.Multer,
req: Request,
res: Response,
next: NextFunction,
) => {
if (process.env.NODE_ENV === "development")
console.error("ERROR: " + err.message)
//These all are known error that why there is no need to log
// Custom Error
if (err instanceof CustomAPIError) {
// console.log(err)
return res
.status(err.statusCode)
.json({ success: false, msg: err.message })
}
//JWT error
if (err instanceof jwt.JsonWebTokenError) {
if (err instanceof jwt.TokenExpiredError) {
return res.status(StatusCodes.UNAUTHORIZED).json({
success: false,
msg: "Session Expired. Please login again.",
})
}
if (err instanceof jwt.NotBeforeError) {
return res.status(StatusCodes.UNAUTHORIZED).json({
success: false,
msg: "Login Expired. Please login again.",
})
}
return res
.status(StatusCodes.UNAUTHORIZED)
.json({ success: false, msg: "Not authorized" })
}
// Handle CastError, ValidationError, ValidatorError separat
if (err instanceof mongoose.Error) {
console.log(err)
if (err instanceof mongoose.Error.CastError) {
return res.status(StatusCodes.NOT_FOUND).json({
success: false,
msg: `No item found with id : ${err.value}`,
})

} else if (err instanceof mongoose.Error.ValidationError) {
const messages = Object.values(err.errors)
.map((item) => item.message)
.join("\n")
return res
.status(StatusCodes.BAD_REQUEST)
.json({ success: false, msg: messages })
} else if (
    err instanceof mongoose.Error.DocumentNotFoundError ||
    err instanceof mongoose.Error.DivergentArrayError ||
    err instanceof mongoose.Error.MissingSchemaError ||
    err instanceof mongoose.Error.MongooseServerSelectionError ||
    err instanceof mongoose.Error.OverwriteModelError ||
    err instanceof mongoose.Error.ParallelSaveError ||
    err instanceof mongoose.Error.StrictModeError ||
    err instanceof mongoose.Error.StrictPopulateError ||
    err instanceof mongoose.Error.VersionError
) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Mongoose error: Something went wrong" });
  } else {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Unknown Mongoose error" });
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
    LIMIT_UNEXPECTED_FILE: "Unexpected file: Accepted files are jpg, jpeg, png",
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