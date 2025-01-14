import React, { useEffect, useState } from "react";
import { getUserBlogs, deleteBlog } from "../api";
import { BlogShortType } from "../definitions";
import Pagination from "@mui/material/Pagination";
import Loader from "./Loader";
import { BsTrash } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import confirm from "./ConfirmationComponent";

const MyBlogs = () => {
  const [page, setPage] = useState<number>(1);
  const [blogs, setBlogs] = useState<BlogShortType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const limit = 6;

  const handleDeleteBlog = async (blog: BlogShortType) => {
    const id = blog._id;
    const confirmDeletion = await confirm(
      "Are you sure you want to delete this blog?\nThis action is irreversible.",
      {
        title: `Delete Blog - ${blog.title}`,
        deleteButton: "Delete",
        cancelButton: "Cancel",
      }
    );
    if (confirmDeletion === false) return;

    setDeleteLoading(true);
    deleteBlog(id)
      .then((_res) => {
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        setTotalCount((prev) => prev - 1);
        toast.success("Blog deleted");
      })
      .catch((err) => console.log(err))
      .finally(() => setDeleteLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getUserBlogs(page, limit)
      .then((res) => {
        setBlogs(res.data.blogs);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="w-11/12 mx-auto flex flex-col justify-between">
      {blogs.length === 0 && !loading && (
        <h1 className="text-3xl font-medium">No blogs found</h1>
      )}
      {loading && <Loader />}
      {!!blogs.length && (
        <ul className="list-none grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              className="max-w-sm mx-auto flex flex-col gap-2 py-4"
              key={blog._id}
            >
              <Link
                to={`/blog/${blog._id}`}
                className="flex flex-col gap-2 py-2"
              >
                <h1 className="text-2xl font-bold text-gray-600">{blog.title}</h1>
                <p className="text-gray-600">{blog.description}</p>
                <img
                  src={
                    blog.img ||
                    "https://i0.wp.com/www.bishoprook.com/wp-content/uploads/2020/04/default-image.jpg"
                  }
                  alt="Blog Cover"
                  className="aspect-video rounded-md object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="flex gap-2 items-center flex-wrap">
                {blog.tags.map((tag) => (
                  <NavLink
                    key={tag}
                    to={`/feed?category=${tag}`}
                    className="text-gray-600 bg-gray-200 px-2 py-1 rounded-md text-xs"
                  >
                    {tag}
                  </NavLink>
                ))}
              </div>
              <div className="flex gap-4">
                <NavLink
                  to={`/write/${blog._id}`}
                  type="button"
                  className="text-dark hover:text-white border border-dark px-3 py-1 rounded-lg transition hover:bg-dark"
                >
                  <CiEdit className="text-base" />
                  Edit
                </NavLink>
                <button
                  title="Delete blog"
                  onClick={() => handleDeleteBlog(blog)}
                  disabled={deleteLoading}
                  type="button"
                  className="flex items-center gap-1 text-red-500 px-3 py-1 rounded-lg border border-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  <BsTrash className="text-base" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}
      {/* Pagination */}
      <footer>
        <Pagination
          className="!my-6 !ml-auto !w-fit !mr-6"
          count={Math.ceil(totalCount / limit)}
          color="secondary"
          shape="rounded"
          onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
            setPage(value)
          }
        />
      </footer>
    </div>
  );
};

export default MyBlogs;
