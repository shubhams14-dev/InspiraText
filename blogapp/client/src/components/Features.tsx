import React from "react";
import dragNdrop from "../assets/videos/Features/dragNdrop.mp4";
import imgGen from "../assets/videos/Features/imgGen.mp4";

const Features: React.FC = () => {
  return (
    <div
      className="w-11/12 lg:w-5/6 mx-auto lg:mt-20 overflow-hidden"
      id="features"
    >
      <h1 className="text-4xl lg:text-6xl font-semibold text-center mb-4">
        Publish{" "}
        <span className="bg-gradient-to-r from-dark from-60% to-highlight bg-clip-text text-transparent">
          Effortlessly
        </span>
      </h1>
      <p className="text-center text-slate-500 text-lg mb-8">
        Write blogs effortlessly with AI-driven text suggestions and modern features.
      </p>

      {/* Drag and Drop Editor Section */}
      <section className="flex flex-col lg:flex-row w-full lg:my-10 items-center justify-between gap-10">
        <div className="lg:w-5/6 p-2 max-w-lg mx-auto">
          <h1 className="text-center lg:text-left font-semibold text-xl mb-4">
            Drag and Drop Editor
          </h1>
          <div className="flex flex-col gap-3 mb-3 min-h-40 text-sm lg:text-base">
            <div className="border p-4 rounded-lg bg-neutral-50">
              Simply Drag and Drop images to your blog.
            </div>
            <div className="border p-4 rounded-lg bg-neutral-50">
              Our modern design puts your convenience first, making drag-and-drop a standout feature.
            </div>
            <div className="border p-4 rounded-lg bg-neutral-50">
              A more interactive and modern experience while saving your time and effort.
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <video
            autoPlay
            muted
            loop
            className="rounded-lg shadow-lg shadow-highlight w-full"
          >
            <source src={dragNdrop} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Generative AI Section */}
      <section className="flex flex-col lg:flex-row-reverse w-full my-14 lg:my-28 items-center justify-between gap-10">
        <div className="lg:w-5/6 p-2 max-w-lg mx-auto">
          <h1 className="text-center lg:text-right font-semibold text-xl mb-4">
            Generative AI to Enhance Image and Text Creation
          </h1>
          <div className="flex flex-col gap-3 mb-3 min-h-40 text-sm lg:text-base">
            <div className="border p-4 rounded-lg bg-neutral-50">
              Enjoy an intuitive interface that simplifies the process of creating unique visuals effortlessly.
            </div>
            <div className="border p-4 rounded-lg bg-neutral-50">
              Generate images based on prompts with ease!
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <video
            autoPlay
            muted
            loop
            className="rounded-lg shadow-lg shadow-highlight w-full"
          >
            <source src={imgGen} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
};

export default Features;
