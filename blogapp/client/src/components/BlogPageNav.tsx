import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";

const BlogPageNav = () => {
  return (
    <div className="border fixed top-0 bg-white z-20 w-full px-3 py-2 shadow-md flex items-center justify-between">
      {/* Logo and Navigation */}
      <NavLink to="/" className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-8"
        >
          <g data-name="75-Write">
            <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5Z" />
            <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 1 0-10h11.38" />
          </g>
        </svg>
        <span className="self-center text-2xl font-semibold whitespace-nowrap">
          Creativerse
        </span>
      </NavLink>

      {/* Navbar Links */}
      <div
        className="items-center justify-between hidden w-full md:flex"
        id="navbar-sticky"
      >
        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 md:border-0">
          <li>
            <NavLink
              to="/blogs/all"
              className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
            >
              Feed
            </NavLink>
          </li>
          <li>
            <a
              href="#features"
              className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
            >
              My Blogs
            </a>
          </li>
          <li>
            <a
              href="#pricing"
              className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Search Bar, Write Button, and Profile Icon */}
      <div className="flex items-center gap-4">
        <SearchBar />
        <NavLink
          to={"/write/new_blog"}
          className="bg-dark px-6 py-2 hover:bg-highlight transition-colors rounded-lg flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5 inline"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.25 1.25 3.712 3.712 1.25-1.25a2.625 2.625 0 0 0 0-3.712Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-9L14.25 5.25H5.25Z" />
          </svg>
          <span className="text-white font-medium">Write</span>
        </NavLink>
        <NavLink
          to="../profile"
          className="p-3 rounded-full bg-dark flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.75 18a7.5 7.5 0 1 1 16.5 0v1.5a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75V18Z"
              clipRule="evenodd"
            />
          </svg>
        </NavLink>
      </div>
    </div>
  );
};

export default BlogPageNav;
