import { Router } from "express";
import { getTextSuggestion, getImageSuggestionPrompt } from "../controllers/ai";

const router = Router();

// Route for getting text suggestions from AI
router.route("/suggest/text").get(getTextSuggestion);

// Route for getting image suggestions based on a prompt
router.route("/suggest/image").get(getImageSuggestionPrompt);

export default router;
