import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { IoPeople } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

type Props = {};

const Hero: React.FC<Props> = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  return (
    <section className="bg-white">
      <div className="pt-6 px-4 mx-auto max-w-screen-xl text-center">
        {/* Promotional Link */}
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-3 text-sm font-medium text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <span>Unleash Your Imagination</span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Unlock Your Creativity with Creativerse Blogs
        </h1>

        {/* Description */}
        <p className="mb-4 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
          Explore a world where AI enhances your creativity! Creativerse Blogs
          empowers you to write blogs effortlessly by providing AI-powered text
          suggestions and unique images.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex mb-4 lg:mb-7 flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {/* Try Our Editor Button */}
          <Link
            to="/write/new_blog"
            className="inline-flex justify-center items-center px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            <CiEdit className="inline mr-2 text-xl" />
            Try Our Editor
          </Link>

          {/* Join the Community Button (if not authenticated) */}
          {!isAuthenticated && (
            <Link
              to="/sign-up"
              className="inline-flex justify-center items-center px-5 py-3 text-base font-medium text-center text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
            >
              <IoPeople className="inline mr-2 text-xl" />
              Join the Community
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
