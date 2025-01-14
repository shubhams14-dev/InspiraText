import { Link, NavLink, useSearchParams } from "react-router-dom";
import { BlogCardType } from "../definitions";
import AuthorTag from "./AuthorTag";
import { format } from "date-fns";

interface BlogCardProps {
  blog: BlogCardType;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category")?.toLowerCase();

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  return (
    <div className="container p-5 bg-white w-full border my-4 rounded-lg shadow-lg">
      <div className="lg:flex flex-row-reverse justify-between">
        <img
          className="object-cover w-full mx-auto lg:mx-0 lg:w-52 h-52 rounded-lg"
          src={blog.img}
          alt={blog.title}
          loading="lazy"
        />
        <div className="mt-6 lg:mt-0 lg:mx-6">
          <div className="flex items-end gap-3">
            {blog.author && <AuthorTag author={blog.author} />}
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mb-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25"
                />
              </svg>
              {blog.createdAt && (
                <p className="text-center text-gray-600 text-sm">
                  {formatDate(blog.createdAt)}
                </p>
              )}
            </div>
          </div>
          <Link
            to={`/blog/${blog._id}`}
            className="block mt-3 text-2xl font-semibold text-gray-800 hover:underline"
          >
            {blog.title}
          </Link>
          <p className="mt-2 text-gray-500">{blog.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 aspect-square"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935"
                />
              </svg>
              {blog?.likesCount || 0}
            </div>
            <div className="flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 aspect-square"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z"
                />
              </svg>
              {blog?.commentsCount || 0}
            </div>
            <div className="flex gap-1 items-center">
              {blog?.views || 0} reads
            </div>
          </div>
          {blog.tags && (
            <div className="flex gap-1 items-center divide-x-2 divide-gray-300 mt-3">
              {blog.tags.map((tag) => (
                <NavLink
                  key={tag}
                  to={`/feed?category=${tag}`}
                  className={`text-xs px-1 capitalize hover:underline ${
                    tag.toLowerCase() === category ? "font-semibold" : ""
                  }`}
                >
                  {tag}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
