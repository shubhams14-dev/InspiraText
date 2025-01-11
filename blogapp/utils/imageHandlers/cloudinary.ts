import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { UploadApiResponse } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud: process.env.CLOUDINARY_URL,
    secure: true,
    })

// Upload profile image to Cloudinary and return the URL
const uploadProfileImage = async (req: Request) => {
  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      folder: `blogmind/${req.user.userId}`,
      public_id: "profile",
      overwrite: true,
      format: "webp",
      invalidate: true,
      width: 400,
      height: 400,
    }
  );
  return result.secure_url;
};

// Delete profile image from Cloudinary
const deleteProfileImage = async (userId: string): Promise<boolean> => {
    const result = await cloudinary.uploader.destroy(
        `blogmind/${userId}/profile`,
        { invalidate: true },
        (error, result) => {
        if (error) return false
        if (result.result === "ok") return true
        return false
        },
        )
        return result
        }

// Upload multiple asset images to Cloudinary and return the URLs
const uploadAssetsImages = async (
  files: Express.Multer.File[],
  userId: string
): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of files) {
    const originalName = file.originalname.split(".")[0] + uuidv4();
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: `blogmind/${userId}`,
        public_id: originalName,
        overwrite: false,
        format: "webp",
      }
    );
    urls.push(result.secure_url);
  }

  return urls;
};

// Delete asset image from Cloudinary
const deleteAssetImages = async (public_id: string): Promise<boolean> => {
    const res = await cloudinary.uploader.destroy(
        public_id,
        { invalidate: true },
        (error, result) => {
        if (error) return false
        if (result.result === "ok") return true
        return false
        },
        )
        return res
}

export {
    uploadProfileImage,
    deleteProfileImage,
    uploadAssetsImages,
    deleteAssetImages,
}
