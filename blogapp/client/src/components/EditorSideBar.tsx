import React from "react";
import { BlogCreateType } from "../definitions";
import AssetsFolder from "./AssetsFolder";
import MultiSelect from "./MultiSelect";
import AICompletion from "./AICompletion";
import Loader from "./Loader";
import { useEditorContext } from "../context/EditorContext";
import { getAImage, uploadAssets } from "../api";
import { GrPowerReset } from "react-icons/gr";
import toast from "react-hot-toast";

interface BlogEditorProps {
  blogId: BlogCreateType["_id"] | undefined;
  blog: BlogCreateType | null;
  setBlog: React.Dispatch<React.SetStateAction<BlogCreateType | null>>;
  disabledPublish: boolean;
  handlePublish: (event: React.SyntheticEvent) => void;
  resetBlog: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  blogId,
  blog,
  setBlog,
  disabledPublish,
  handlePublish,
  resetBlog,
}) => {
  const [isAssetsOpen, setIsAssetsOpen] = React.useState(false);
  const [isAICompletionOpen, setIsAICompletionOpen] = React.useState(false);
  const { editor } = useEditorContext();

  const handleTextUploadToEditor = (text: string) => {
    if (!editor) {
      console.error("EditorJS instance is not available.");
      return;
    }
    const paragraphData = { text };
    editor.blocks.insert(
      "paragraph",
      paragraphData,
      {},
      editor.blocks.getBlocksCount(),
      true
    );
  };

  const handleImageUploadToEditor = (imageUrl: string, prompt: string) => {
    if (!editor) {
      console.error("EditorJS instance is not available.");
      return;
    }
    const imageData = {
      file: { url: imageUrl },
      caption: prompt,
      withBorder: false,
      stretched: false,
      withBackground: false,
    };
    editor.blocks.insert(
      "image",
      imageData,
      {},
      editor.blocks.getBlocksCount(),
      true
    );
  };

  const handleGenerateWithAI = () => {
    if (!blog || blog.title === "") {
      toast.error("Please enter a title to generate with AI.");
      return;
    }
    toast.loading("Generating your cover image", { id: "generate-with-ai" });
    getAImage(blog.title)
      .then((response) => {
        const imageBlob = response.data;
        const file = new File([imageBlob], blog.title, { type: "image/jpeg" });
        return uploadAssets([file]);
      })
      .then((res) => {
        const imageUrl = res.data[0];
        setBlog({ ...blog, img: imageUrl });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        toast.success("Cover image is ready", { id: "generate-with-ai" });
      });
  };

  if (!blog) return <Loader />;

  return (
    <div className="hidden lg:flex flex-col px-3 pt-4 md:w-1/5 bg-white">
      <figure className="aspect-video overflow-hidden rounded-md relative">
        <button
          className="top-1 left-1 absolute bg-gradient-to-tl from-dark to-highlight text-white px-3 py-1 rounded-md"
          onClick={handleGenerateWithAI}
        >
          Generate with AI
        </button>
        <img
          src={blog.img}
          className="w-full aspect-video object-cover"
          alt="Generate with AI"
        />
        <figcaption className="absolute bg-white text-dark py-1 px-2 bottom-0 left-0">
          Cover
        </figcaption>
      </figure>
      <div className="flex items-center">
        <input
          type="text"
          id="image-url"
          placeholder="Paste Image URL here..."
          value={blog.img}
          onChange={(e) => setBlog({ ...blog, img: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring"
        />
      </div>
      <input
        type="text"
        placeholder="Article Title"
        value={blog.title}
        maxLength={100}
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        className="p-3 border rounded-lg focus:outline-none focus:ring"
      />
      <textarea
        value={blog.description}
        onChange={(e) => setBlog({ ...blog, description: e.target.value })}
        placeholder="Short Description of the Article..."
        rows={4}
        maxLength={250}
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring"
      />
      <MultiSelect
        value={blog.tags}
        onChange={(selectedOptions: string[]) =>
          setBlog({ ...blog, tags: selectedOptions as any })
        }
        placeholder="Select categories"
      />
      <div className="border border-highlight flex items-center justify-between cursor-pointer">
        <span
          className="text-sm text-highlight w-full h-full px-3 py-2"
          onClick={() => setIsAssetsOpen(true)}
        >
          Assets and Images
        </span>
        {isAssetsOpen && (
          <div className="fixed inset-0 z-40 top-5 p-5 backdrop-blur-md bg-opacity-50">
            <AssetsFolder
              setIsAssetsOpen={setIsAssetsOpen}
              handleImageUpload={handleImageUploadToEditor}
            />
          </div>
        )}
      </div>
      <div className="bg-gradient-to-tl from-dark to-highlight flex justify-between">
        <button
          className="text-sm text-white h-full px-3 w-full"
          onClick={() => setIsAICompletionOpen(true)}
        >
          Generate with AI
        </button>
        {isAICompletionOpen && (
          <div className="fixed inset-0 z-40 top-5 mx-auto p-5 backdrop-blur-md bg-opacity-50">
            <AICompletion
              setIsAICompletionOpen={setIsAICompletionOpen}
              handleImageUpload={handleImageUploadToEditor}
              handleTextUploadToEditor={handleTextUploadToEditor}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row-reverse justify-between gap-2">
        <button
          type="submit"
          onClick={handlePublish}
          disabled={disabledPublish}
          className={`duration-150 w-full border border-dark px-4 py-2 text-sm rounded-lg ${
            disabledPublish ? "opacity-50 cursor-progress" : "hover:bg-highlight"
          }`}
        >
          {blogId === "new_blog" ? "Publish" : "Update"}
        </button>
        <button
          onClick={resetBlog}
          className="flex gap-1 items-center justify-center w-full border border-gray-300 px-4 py-2 text-sm rounded-lg hover:bg-gray-100"
        >
          <GrPowerReset className="my-auto" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
