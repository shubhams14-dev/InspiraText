import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";

const getTextSuggestion = async (req: Request, res: Response) => {
    const text = req.query.text;
    if (!text) throw new BadRequestError("Please provide a 'text' for suggestion.");

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: { max_new_tokens: 25 },
                }),
                redirect: "follow",
            }
        );

        if (response.statusText !== "OK") {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const generated_text = data[0]?.generated_text;

        res.status(StatusCodes.OK).json({
            data: generated_text,
            success: true,
            msg: "Data Fetched Successfully",
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                msg: "Failed to fetch text suggestion",
                error: error.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                msg: "An unknown error occurred while fetching text suggestion",
            });
        }
    }
};

const getImageSuggestionPrompt = async (req: Request, res: Response) => {
    const prompt = req.query.prompt;
    if (!prompt) throw new BadRequestError("Please provide a 'prompt' for image suggestion.");

    try {
        const response = await axios({
            url: "https://api-inference.huggingface.co/models/stable-diffusion-v1",
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            data: JSON.stringify({ inputs: prompt }),
            responseType: "stream",
        });

        if (response.statusText !== "OK") {
            throw new Error(`API Error: ${response.statusText}`);
        }

        res.set(response.headers);
        res.set("x-ai-generated-image", "true");
        res.header("Access-Control-Expose-Headers", "x-ai-generated-image");

        response.data.pipe(res);
    } catch (error) {
        if (error instanceof Error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                msg: "Failed to fetch image suggestion",
                error: error.message,
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                msg: "An unknown error occurred while fetching image suggestion",
            });
        }
    }
};

export { getTextSuggestion, getImageSuggestionPrompt };
