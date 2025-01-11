import User from "../models/user";
import Blogs from "../models/blog";
import { Request, Response } from "express";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import natural from "natural";
import WordNet from "node-wordnet";

const wordnet = new WordNet();
const blogTokenizer = new natural.WordTokenizer();

const getSynonyms = (word: string) => {
    return new Promise<string[]>((resolve, reject) => {
        wordnet.lookup(word, (err: Error | null, definitions: any[]) => {
            if (err) reject(err);
            else {
                const synonyms = definitions.reduce((acc, definition) => {
                    return definition.synonyms ? acc.concat(definition.synonyms) : acc;
                }, []);
                resolve(synonyms);
            }
        });
    });
};

const search = async (req: Request, res: Response) => {
    const { type, query } = req.query;

    if (!query) throw new BadRequestError("Query is required");

    switch (type) {
        case "user":
            const userTotalCount = await User.countDocuments({ name: { $regex: query, $options: "i" } });
            const users = await User.find({ name: { $regex: query, $options: "i" } })
                .select("name email profileImage")
                .skip(req.pagination.skip)
                .limit(req.pagination.limit)
                .sort({ createdAt: -1 });

            return res.status(StatusCodes.OK).json({
                data: { users, totalCount: userTotalCount, page: req.pagination.page, limit: req.pagination.limit },
                success: true,
                msg: "Users Fetched Successfully",
            });

        case "blog":
            const blogQueryTokens = blogTokenizer.tokenize(query.toString().toLowerCase()) || []; // Default to an empty array
            if (blogQueryTokens.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    msg: "No valid tokens found for query.",
                });
            }

            const synonyms = await Promise.all(blogQueryTokens.map((token) => getSynonyms(token)));

            const queryObject = {
                $or: [
                    { title: { $regex: query.toString(), $options: "i" } },
                    { tags: { $in: synonyms.flat() } },
                ],
            };

            const blogTotalCount = await Blogs.countDocuments(queryObject);
            const blogs = await Blogs.find(queryObject)
                .select("title description img author tags views likesCount commentsCount")
                .populate({ path: "author", select: "name profileImage" })
                .skip(req.pagination.skip)
                .limit(req.pagination.limit);

            return res.status(StatusCodes.OK).json({
                data: { blogs, totalCount: blogTotalCount, page: req.pagination.page, limit: req.pagination.limit },
                success: true,
                msg: "Blogs Fetched Successfully",
            });

        default:
            throw new BadRequestError("Invalid type, accepted types are 'user' and 'blog'");
    }
};


export { search };
