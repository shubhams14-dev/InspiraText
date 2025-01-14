import Blogs from "../components/Blogs";
import Categories from "../components/Categories";
import { useEffect, useState } from "react";
import { TrendingType } from "../definitions";
import { getTrendingBlog } from "../api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import TrendingSvg from "../assets/img/Feed/TrendingSvg";
import AuthorTag from "../components/AuthorTag";

const AllBlogs = () => {
  const [trending, setTrending] = useState<TrendingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getTrendingBlog()
      .then((res) => setTrending(res.data.blogs))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex gap-3 xl:mx-auto xl:w-5/6 mx-3">
        <div className="w-11/12 mx-auto md:w-3/5 lg:w-3/4">
          <Categories />
          <Blogs />
        </div>
        {trending && (
          <div className="hidden md:block lg:w-1/4 p-4 border rounded-lg">
            <h2 className="text-lg font-medium mb-5 flex items-center">
              Trending <TrendingSvg />
            </h2>
            {loading ? (
              <Loader />
            ) : (
              trending.map((blog) => (
                <div
                  className="flex flex-col gap-1 mb-2 py-2 pb-3 border-b"
                  key={blog._id}
                >
                  <Link to={`/blog/${blog._id}`}>
                    <p className="font-medium text-gray-700 hover:underline">
                      {blog.title}
                    </p>
                  </Link>
                  <div className="text-sm flex items-center gap-2 text-gray-500">
                    <span>
                      <AuthorTag author={blog.author} />
                    </span>
                    <span>{blog.totalScore} Interactions</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
