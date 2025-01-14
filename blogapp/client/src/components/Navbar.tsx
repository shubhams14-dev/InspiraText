import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import SearchBar from "./SearchBar";
import { useEffect, useRef, useState } from "react";
import { logout } from "../features/userSlice";
import confirm from "./ConfirmationComponent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<any>(null);
  const iconRef = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !iconRef.current?.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = await confirm(
      "Are you sure you want to logout? This will clear all saved sessions.",
      {
        title: "Logout",
        deleteButton: "Logout",
        cancelButton: "Cancel",
      }
    );
    if (confirmLogout === false) return;
    dispatch(logout());
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo and App Name */}
          <NavLink
            to={`${!loading && isAuthenticated ? "/feed" : "/"}`}
            className="flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-6 md:h-8"
            >
              <g data-name="75-Write">
                <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5z" />
                <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 1 0-10h11.38" />
              </g>
            </svg>
            <span className="self-center text-lg md:text-2xl font-semibold">
              Creativerse
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
              <li>
                <NavLink
                  to="/feed"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#features"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#pricing"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#contact"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Authenticated/Unauthenticated Options */}
          {!loading && !isAuthenticated ? (
            <div className="flex md:order-2 space-x-3 md:space-x-6">
              <NavLink
                to="/sign-in"
                className="text-white bg-dark focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                <span>Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <SearchBar />
              <NavLink
                to={"/write/new_blog"}
                className="bg-dark px-2 md:px-6 hover:bg-highlight transition-colors duration-150 text-white rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 md:w-5 aspect-square inline"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1" />
                  <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3" />
                </svg>
                <span className="hidden md:inline text-white font-medium ml-2">
                  Write
                </span>
              </NavLink>
              <button
                ref={iconRef}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className={`${isOpen ? "bg-highlight" : "bg-dark"} p-3 rounded-full`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 aspect-square"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.7"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 top-20 right-[5%] mt-2 bg-white border rounded-lg p-4 shadow-lg"
                >
                  <NavLink
                    to={"/profile"}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 inline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3"
                      />
                    </svg>
                    Profile
                  </NavLink>
                  <NavLink
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    to={"/settings"}
                    className={`flex items-center gap-1 cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-lg`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className={`cursor-pointer text-left hover:bg-gray-100 rounded-lg px-3 py-2`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
