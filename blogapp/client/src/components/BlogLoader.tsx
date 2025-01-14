import React from "react";
import ImagePlaceholder from "../assets/img/Feed/ImagePlaceholder";

const BlogLoader = () => {
  return (
    <div
      role="status"
      className="pr-5 my-6 mr-8 animate-pulse md:space-y-0 rtl:space-y-reverse"
    >
      {/* Image Placeholder */}
      <div className="flex items-center justify-center w-full h-52 bg-gray-200 rounded-lg">
        <ImagePlaceholder />
      </div>

      {/* Text Placeholders */}
      <div className="w-full mt-4 space-y-2">
        <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full max-w-[480px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full w-4/5 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full max-w-[440px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full max-w-[460px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BlogLoader;
