import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  followUnfollowUser,
  // getUserBlogs,
  getUserBlogs,
  getUserProfile,
  isFollowing,
} from "../api";
import { Profile, ProfileBlogs } from "../definitions";
import { format } from "date-fns";
import Loader from "../components/Loader";
import { useAppSelector } from "../hooks";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";

const PublicProfile = () => {
  const userId = useParams().id;
  const [user, setUser] = useState<Profile | null>(null);
  const [blogs, setBlogs] = useState<ProfileBlogs[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const limit = 6;

  const { isAuthenticated, loading: loginInUserLoading } = useAppSelector(
    (state) => state.user,
  );

  const handleFollowUnfollow = async () => {
    if (!userId) return;
    if (!isAuthenticated)
      return toast.error(`Please login to follow ${user?.name}`, {
        id: "follow",
      });

    await followUnfollowUser(userId);
    setIsFollow(!isFollow);
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        followingCount: isFollow
          ? prev.followingCount - 1
          : prev.followingCount + 1,
      };
    });
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserProfile(userId, page, limit)
      .then((response) => {
        setUser(response.data.user);
        setTotalCount(response.data.totalCount);
      })
      .catch((error) => console.log("Error fetching user profile", error))
      .finally(() => setLoading(false));
  }, [userId, page]);

  useEffect(() => {
    if (!userId) return;
    getUserBlogs(page, limit)
      .then((response) => {
        // Filter blogs by userId if necessary
        const filteredBlogs = response.data.blogs.filter(
          (blog:any) => blog.author._id === userId
        );
        setBlogs(filteredBlogs);
      })
      .catch((error) => console.log("Error fetching user blogs", error));
  }, [page, userId]);
  

  useEffect(() => {
    if (loading || !userId) return;
    const ifFollowing = async () => {
      const res = await isFollowing(userId);
      setIsFollow(res.data.isFollowing);
    };
    if (isAuthenticated) ifFollowing();
  }, [userId, isAuthenticated, loading]);

  if (loading) return <Loader />;

  return (
    <main className="w-[90%] lg:w-4/5 mx-auto border-[1.5px] mt-6 p-4">
      <section>
        <div className="p-4 flex flex-col md:flex-row items-center">
          <div className="relative flex mr-5">
            <div className="flex flex-1">
              <div>
                <div className="md rounded-full relative avatar">
                  <img
                    className="rounded-full"
                    src={user?.profileImage}
                    alt={user?.name}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1 justify-center w-full mt-3">
            <h2 className="text-xl leading-6 font-bold text-gray-800">
              {user?.name}
            </h2>
            <div className="mt-3 text-gray-600 flex">
              <span className="flex mr-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <g>
                    <path d="M19.708 2H4.292C3.028 2 2 3.028 2 4"></path>
                  </g>
                </svg>
                <span className="leading-5 ml-1">
                  Joined {user?.createdAt && formatDate(user.createdAt)}
                </span>
              </span>
            </div>
            <div className="pt-3 flex justify-start items-start">
              <div className="text-center pr-3">
                <span className="font-bold text-gray-600">
                  {user?.followingCount}
                </span>
                <span className="text-gray-600"> Following</span>
              </div>
              <div className="text-center px-3">
                <span className="font-bold text-gray-600">
                  {user?.followersCount}
                </span>
                <span className="text-gray-600"> Followers</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                className={`bg-dark text-white px-4 py-1 rounded ${
                  isFollow ? "bg-red-500" : "bg-blue-500"
                }`}
                onClick={handleFollowUnfollow}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        </div>
        <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs?.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog._id}`}
              className="max-w-sm mx-auto flex flex-col gap-2 border p-4 rounded-md"
            >
              <span className="flex gap-1 items-center text-gray-500">
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <g>
                    <path d="M19.708 2H4.292C3.028 2 2 3.028 2 4"></path>
                  </g>
                </svg>
                {formatDate(blog?.createdAt as string)}
              </span>
              <h1 className="text-2xl font-bold text-gray-800">{blog.title}</h1>
              <p className="width-auto text-gray-600">{blog.description}</p>
              <img
                src={blog.img}
                alt={blog.title}
                className="aspect-video rounded-md object-cover"
                loading="lazy"
              />
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center text-gray-600">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <g>
                      <path d="M14.046 2.242l-4.148-.01"></path>
                    </g>
                  </svg>
                  {blog?.commentsCount}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <g>
                      <path d="M12 21.638h-.014"></path>
                    </g>
                  </svg>
                  {blog?.likesCount}
                </div>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {blog.tags.map((tag) => (
                  <span
                    className="text-gray-600 bg-gray-200 px-2 py-1 rounded-md"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </ul>
        <Pagination
          className="!my-6 !ml-auto !w-fit !mr-6"
          count={Math.ceil(totalCount / limit)}
          color="secondary"
          shape="rounded"
          page={page}
          onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value);
          }}
        />
      </section>
    </main>
  );
};

export default PublicProfile;
