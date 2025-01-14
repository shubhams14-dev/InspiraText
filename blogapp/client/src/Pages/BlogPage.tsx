import React, { useEffect, useRef, useState } from "react";
import { commentBlog, getBlog, likeBlog } from "../api/index";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { BlogFullType } from "../definitions";
import { useAppSelector } from "../hooks";
import { format } from "date-fns";
import { IoBookOutline } from "react-icons/io5";
import { useEditorContext } from "../context/EditorContext";
import { NavLink } from "react-router-dom";
import AuthorTag from "../components/AuthorTag";
import { PiDotOutlineFill } from "react-icons/pi";
import { formatDistanceToNow } from "date-fns";

type BlogPageProps = {
  isEmbed?: boolean;
};

const BlogPage: React.FC<BlogPageProps> = ({ isEmbed }) => {
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<BlogFullType>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const { initializeEditor, editor } = useEditorContext();
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<any>(null);

  const { loading, isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (blog?.content && editorRef.current === null) {
      initializeEditor(true, JSON.parse(blog.content));
      editorRef.current = true;
    }
  }, [blog?.content, editor, initializeEditor]);

  const formatDate = (date: string) => format(new Date(date), "dd MMMM yyyy");

  const postComment = async () => {
    if (!isAuthenticated) return toast.error("Please login to post a comment.");
    if (comment === "") return toast.error("Please write a comment.");
    if (!id) return toast.error("No such blog.");
    if (!user) return toast.error("Please login to post a comment.");

    commentBlog(id, comment)
      .then((res) => {
        const newComment: BlogFullType["comments"][0] = {
          _id: res.data.comment._id,
          message: res.data.comment.message,
          createdAt: res.data.comment.createdAt,
          author: {
            _id: user.userId,
            name: user.name,
            profileImage: user.profileImage,
          },
        };
        setBlog((prevBlog) => prevBlog ? { ...prevBlog, comments: [newComment, ...prevBlog.comments] } : prevBlog);
        setComment("");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError(true);
        return toast.error("No such blog.");
      }
      try {
        const { data } = await getBlog(id);
        setBlog(data.blog);
        setIsLiked(data.isLiked);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id, isAuthenticated]);

  const handleLikeButton = () => {
    if (!isAuthenticated) return toast.error("Please login to like the blog.");
    if (!id) return toast.error("No such blog.");
    setIsLiked((prev) => !prev);

    likeBlog(id)
      .then(() => {
        setBlog((prev) => prev ? { ...prev, likesCount: prev.likesCount + (isLiked ? -1 : 1) } : prev);
      })
      .catch((error) => console.error(error));
  };

  if (isLoading) return <Loader />;
  if (isError || !blog) return <div>Error loading blog.</div>;

  return (
    <div className={`mx-auto ${isEmbed ? "" : "mt-4"} pb-5 lg:pt-0`}>
      <div className="flex flex-col gap-4 max-w-6xl mx-auto shadow-md p-4 rounded-lg">
        <figure>
          <img
            src={blog?.img}
            alt={blog?.title}
            className="object-cover w-full aspect-[2] rounded"
          />
        </figure>
        <h2 className="text-3xl md:text-5xl w-full font-bold text-center">{blog?.title}</h2>
        <div>
          <p className="font-[400] text-center text-gray-600 text-lg">{blog?.description}</p>
          <div className="flex gap-3 items-center text-lg justify-center mt-3">
            <div className="flex items-center">
              <div className="heart-bg">
                <div
                  className={`heart-icon ${isLiked ? "liked" : ""}`}
                  onClick={handleLikeButton}
                ></div>
              </div>
              <span>{blog.likesCount} Likes</span>
            </div>
            {blog.author && <AuthorTag author={blog.author} />}
          </div>
          <div className="flex items-center gap-1 mt-3">
            <IoBookOutline className="mt-0.5" />
            <span className="text-center">
              {Math.ceil(blog.content.split(" ").length / 200)} min read
            </span>
          </div>
        </div>
        <div id="editorjs" className="text-gray-700 mx-auto"></div>
        <div className="py-10 w-5/6 mx-auto">
          <h3 className="text-2xl font-semibold mb-5">Comments</h3>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              postComment();
            }}
          >
            <input
              type="text"
              placeholder="Write a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              disabled={comment === ""}
              className="bg-highlight text-white px-4 py-2 rounded"
            >
              Post
            </button>
          </form>
          {blog?.comments?.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="space-y-7">
              {blog?.comments?.map((comment, index) => (
                <li key={index} className="mb-4 flex items-start gap-4">
                  <NavLink to={`/user/${comment.author._id}`}>
                    <img
                      className="object-cover w-12 rounded-full"
                      src={comment?.author?.profileImage}
                      alt={"img"}
                    />
                  </NavLink>
                  <div>
                    <NavLink to={`/user/${comment.author._id}`}>
                      <p className="text-lg font-bold">{comment.author.name}</p>
                    </NavLink>
                    <p className="text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <p>{comment?.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
