import User from "../models/user";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
    uploadAssetsImages as cloudinaryUploadAssetsImages,
    deleteAssetImages as cloudinaryDeleteAssetImages,
} from "../utils/imageHandlers/cloudinary";

const updateUser = async (
    userId: mongoose.Types.ObjectId,
    key: string,
    value: any
) => {
    const user = await User.findById(userId);
    if (!user) throw new UnauthenticatedError("User Not Found");

    user.set({ [key]: value });
    await user.save();
};

const updateCompleteProfile = async (req: Request, res: Response) => {
    const { name, bio, myInterests } = req.body;
    const userId = req.user.userId;

    if (!name || !bio || !myInterests)
        throw new BadRequestError("Name, Bio or Interests are required.");

    await User.findByIdAndUpdate(userId, { name, bio, myInterests });

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Profile Updated Successfully",
    });
};

const updateProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId;

    if (!req.file) throw new BadRequestError("Image is required.");

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId.toString()); // Convert ObjectId to string

    if (!isDeleted) throw new BadRequestError("Failed to delete previous profile image.");

    const cloudinary_img_url = await cloudinaryUploadProfileImage(req.file.path);

    await updateUser(userId, "profileImage", cloudinary_img_url);

    res.status(StatusCodes.OK).json({
        data: { profileImage: cloudinary_img_url },
        success: true,
        msg: "Image Updated Successfully",
    });
};

const deleteProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId.toString()); // Convert ObjectId to string

    if (!isDeleted) throw new BadRequestError("Failed to delete profile image.");

    const defaultProfileImage = "https://res.cloudinary.com/dzvci8arz/image/upload/v171515-default-profile.jpg";
    await updateUser(userId, "profileImage", defaultProfileImage);

    res.status(StatusCodes.OK).json({
        data: { defaultProfileImage },
        success: true,
        msg: "Image Deleted Successfully",
    });
};

const getAllAssets = async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("myAssets");
    if (!user) throw new UnauthenticatedError("User Not Found");

    res.status(StatusCodes.OK).json({
        data: { assets: user.myAssets },
        success: true,
        msg: "All Assets Fetched Successfully",
    });
};


const uploadAssets = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const files = req.files as Express.Multer.File[]; // Explicitly cast files
  
    if (!files || files.length === 0) throw new BadRequestError("Files are required.");
  
    // Pass files and userId to the updated function
    const cloudinary_img_urls = await cloudinaryUploadAssetsImages(files, userId.toString());
  
    await User.findByIdAndUpdate(userId, {
      $push: { myAssets: { $each: cloudinary_img_urls } },
    });
  
    res.status(StatusCodes.OK).json({
      data: cloudinary_img_urls,
      success: true,
      msg: "Assets Uploaded Successfully",
    });
  };
  

const deleteAsset = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { assets } = req.body;

    if (!assets) throw new BadRequestError("Assets are required.");

    const public_id = assets
        .split("/")
        .slice(-3)
        .join("/")
        .split(".")
        .slice(0, -1)
        .join(".");

    const userIdFromUrl = public_id.split("/")[1];
    if (userIdFromUrl !== userId.toString()) // Ensure userId is compared as a string
        throw new BadRequestError("You are not authorized to delete this asset.");

    const isDeleted: boolean = await cloudinaryDeleteAssetImages(public_id);

    if (!isDeleted) throw new BadRequestError("Failed to delete asset.");

    await User.findByIdAndUpdate(userId, {
        $pull: { myAssets: assets },
    });

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Assets Deleted Successfully",
    });
};

const followUnfollowUser = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { followId } = req.body;

    if (!followId) throw new BadRequestError("FollowId is required.");

    const user = await User.findById(userId);
    if (!user) throw new UnauthenticatedError("User Not Found");

    const followUser = await User.findById(followId);
    if (!followUser) throw new BadRequestError("Follow User Not Found.");

    const isFollowing = user.following.includes(followId);
    const isFollower = followUser.followers.includes(userId);

    if (isFollowing && isFollower) {
        await User.findByIdAndUpdate(userId, { $pull: { following: followId } });
        await User.findByIdAndUpdate(followId, { $pull: { followers: userId } });
    } else if (!isFollowing && !isFollower) {
        await User.findByIdAndUpdate(userId, { $push: { following: followId } });
        await User.findByIdAndUpdate(followId, { $push: { followers: userId } });
    } else {
        throw new BadRequestError("Something Went Wrong");
    }

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Follow/Unfollow User Successfully",
    });
};

const isFollowing = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { followId } = req.body;

    if (!followId) throw new BadRequestError("FollowId is required.");

    const user = await User.findById(userId);
    if (!user) throw new UnauthenticatedError("User Not Found");

    const followUser = await User.findById(followId);
    if (!followUser) throw new BadRequestError("Follow User Not Found.");

    const isFollowing = user.following.includes(followId);
    const isFollower = followUser.followers.includes(userId);

    res.status(StatusCodes.OK).json({
        data: { isFollowing: isFollowing && isFollower },
        success: true,
        msg: "Check Following Successfully",
    });
};

export {
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    getAllAssets,
    uploadAssets,
    deleteAsset,
    followUnfollowUser,
    isFollowing,
};
