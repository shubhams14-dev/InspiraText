import { Router } from "express";
import {
    register,
    login,
    continueWithGoogle,
    verifyEmail,
    signOut,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
} from "../controllers/auth";

const router = Router();

// Route for user registration
router.route("/sign-up").post(register);

// Route for user login
router.route("/sign-in").post(login);

// Route for Google sign-in
router.route("/sign-in/google").post(continueWithGoogle);

// Route to send OTP for password recovery
router.route("/forgot-password/send-otp").post(forgotPasswordSendOtp);

// Route to verify OTP for password recovery
router.route("/forgot-password/verify-otp").post(forgotPasswordVerifyOtp);

// Route to verify user email
router.route("/verify").post(verifyEmail);

// Route for user logout
router.route("/sign-out").post(signOut);

export default router;
