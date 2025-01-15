import axios from "axios";
import toast from "react-hot-toast";
import {
  LoginType,
  SignUpType,
  BlogShortType,
  UserType,
  ForgotPasswordType,
  BlogCreateType,
} from "../definitions";

/*
 ********************** Configuring Axios **********************
 */
const URL = "/api/v1";
const API = axios.create({ baseURL: URL, withCredentials: true });

const publicRoutes = ["auth", "public"];

API.interceptors.request.use(function (config) {
  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route)
  );

  if (!isPublicRoute) {
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
      const [key, _value] = cookie.split("=");
      if (key.trim() === "userId") return true;
      return false;
    });

    if (!isLoggedIn)
      return Promise.reject(new axios.Cancel("Not Logged In"));
  }
  return config;
});

API.interceptors.response.use(
  function (response) {
    const isAIImage = response.headers["x-ai-generated-image"];
    if (isAIImage) return response;

    if (!response.data.success) {
      toast.error(response.data.msg, { id: response.data.msg });
      return Promise.reject(response.data);
    }

    return response.data;
  },
  function (error) {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) console.log(error);

    if (error.response) {
      toast.error(error.response.data?.msg, { id: error.response.data?.msg });
    } else {
      if (error.message === "Not Logged In") {
        toast.error("Please Login to use this feature.", {
          id: "Not Logged In",
        });
      } else {
        toast.error("Network Error: Please try again later.", {
          id: "Network Error",
        });
      }
    }

    return Promise.reject(error);
  }
);

interface VerifyOtpParams {
  userId: UserType["userId"];
  otp: string;
}

/*
 ********************** Sign In and Sign Up ********************
 */
export const signIn = (login: LoginType) => API.post("/auth/sign-in", login);
export const signUp = (signup: SignUpType) =>
  API.post("/auth/sign-up", signup);
export const signInGoogle = (tokenId: string) =>
  API.post("/auth/sign-in/google", { tokenId });
export const forgotPasswordSendOtpApi = (email: string) =>
  API.post("/auth/forgot-password/send-otp", { email });
export const forgotPasswordVerifyOtpApi = (
  forgotPasswordValues: ForgotPasswordType
) => API.post("/auth/forgot-password/verify-otp", forgotPasswordValues);
export const verifyOtp = (verifyOtpParams: VerifyOtpParams) =>
  API.post("/auth/verify", verifyOtpParams);
export const signInToken = () => API.get("/user/me");
export const signOut = () => API.post("/auth/sign-out");

/*
 ********************** User Requests **********************
 */
export const getAssets = () => API.get("/user/assets");
export const deleteAsset = (assets: string) =>
  API.delete("/user/assets", { data: { assets } });
export const uploadAssets = (assetFiles: File[]) => {
  const formData = new FormData();
  assetFiles.forEach((file) => formData.append("assetFiles", file));
  return API.post("/user/assets", formData);
};
export const updateProfile = (userData: UserType) => {
  const { name, bio, myInterests } = userData;
  return API.patch("/user/update-profile", {
    name,
    bio,
    myInterests,
  });
};

/* Additional Requests */
export const getUserProfile = (
  id: UserType["userId"],
  page: number = 1,
  limit: number = 10
) =>
  API.get(`/public/profile/${id}`, {
    params: {
      page,
      limit,
    },
  });
export const updateImage = (profileImage: File) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);
  return API.post("/user/image", formData);
};
export const deleteProfileImage = () => API.delete("/user/image");
export const getUserBlogs = (page: number = 1, limit: number = 10) =>
  API.get("/user/blog", {
    params: {
      page,
      limit,
    },
  });
export const getUserBlogById = (id: BlogShortType["_id"]) =>
  API.get(`/user/blog/${id}`);
export const createBlog = (blog: BlogCreateType) =>
  API.post("/user/blog", {
    title: blog.title,
    description: blog.description,
    content: JSON.stringify(blog.content),
    img: blog.img,
    tags: blog.tags,
  });
export const updateBlog = (blog: BlogCreateType) =>
  API.patch(`/user/blog/${blog._id}`, {
    title: blog.title,
    description: blog.description,
    content: JSON.stringify(blog.content),
    img: blog.img,
    tags: blog.tags,
  });
export const deleteBlog = (id: BlogShortType["_id"]) =>
  API.delete(`/user/blog/${id}`);

/* Additional API Requests for Blogs and Search */
export const getBlogs = (
  category: string,
  pageNo: number = 1,
  limit: number = 10
) =>
  API.get("/public/blog/category", {
    params: {
      tags: category.toLowerCase(),
      page: pageNo,
      limit: limit,
    },
  });

export const getRecommendedBlogs = (
  userId: BlogShortType["_id"],
  pageNo: number = 1,
  limit: number = 10
) =>
  API.get("/public/blog/recommended", {
    params: {
      userId: userId,
      page: pageNo,
      limit: limit,
    },
  });

export const getTrendingBlog = () => API.get("/public/blog/trending");

/* AI Requests */
export const getAICompletion = (text: string) =>
  API.get("/public/ai/suggest/text", { params: { text } });
export const getAImage = (prompt: string) =>
  API.get("/public/ai/suggest/image", {
    params: { prompt },
    responseType: "blob",
  });

export const followUnfollowUser = (userId: UserType["userId"]) =>
  API.post("/user/follow-unfollow", { followId: userId });
export const isFollowing = (userId: UserType["userId"]) =>
  API.post("/user/is-following", { followId: userId });


/**
 * Search API for blogs or users
 * @param query - The search query
 * @param type - The type of search ("blog" or "user")
 * @param page - The page number for pagination
 * @param limit - The number of results per page
 */
export const search = (
  query: string,
  type: string,
  page: number = 1,
  limit: number = 10
) => {
  return API.get(`/public/search`, {
    params: {
      query,
      type,
      page,
      limit,
    },
  });
};
