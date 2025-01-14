import React from "react";
import { getAICompletion, getAImage, uploadAssets } from "../api";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoClose } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { TbFileTextAi } from "react-icons/tb";
import { LuImagePlus } from "react-icons/lu";
import { FaPlay } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { BsFillEraserFill } from "react-icons/bs";

interface AICompletionProps {
  setIsAICompletionOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageUpload: (imageUrl: string, prompt: string) => void;
  handleTextUploadToEditor: (text: string) => void;
}

type ImageDataType = {
  id: string;
  prompt: string;
  imageBlob: Blob | null;
  imageUrl: string;
  isSaved: boolean;
};

const AICompletion: React.FC<AICompletionProps> = ({
  setIsAICompletionOpen,
  handleImageUpload,
  handleTextUploadToEditor,
}) => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [textSuggestions, setTextSuggestions] = React.useState<string[]>([]);
  const [imageSuggestions, setImageSuggestions] = React.useState<ImageDataType[]>([]);

  React.useEffect(() => {
    return () => {
      imageSuggestions.forEach((image) => URL.revokeObjectURL(image.imageUrl));
    };
  }, [imageSuggestions]);

  const handleTextSuggestion = async (textPrompt?: string) => {
    setLoading(true);
    setPage(0);
    toast.loading("Generating Suggestion", { id: "loading" });

    try {
      const response = await getAICompletion(textPrompt || prompt);
      const text = response.data;
      setTextSuggestions((prev) => [text, ...prev]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss("loading");
    }
  };

  const isPromptAlreadySuggested = (prompt: string) => {
    return imageSuggestions.some((pair) => pair.prompt === prompt);
  };

  const handleImageSuggestion = async () => {
    if (isPromptAlreadySuggested(prompt)) {
      return toast.success("Prompt already suggested, please try a new one.");
    }
    setLoading(true);
    setPage(1);
    toast.loading("Generating Image", { id: "loading" });

    try {
      const response = await getAImage(prompt);
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageSuggestions((prev) => [
        {
          id: Date.now().toString(),
          prompt,
          imageBlob,
          imageUrl,
          isSaved: false,
        },
        ...prev,
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss("loading");
    }
  };

  const saveToAssets = (image: ImageDataType): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!image.imageBlob || image.isSaved) {
        return reject(new Error("Image already saved"));
      }

      const file = new File([image.imageBlob], image.prompt.slice(0, 10) + ".jpeg", {
        type: "image/jpeg",
      });
      toast.loading("Saving to Assets Folder ...", { id: "uploading" });

      uploadAssets([file])
        .then((res) => {
          const imageUrl = res.data[0];
          setImageSuggestions((prev) =>
            prev.map((img) => {
              if (img.id === image.id) {
                URL.revokeObjectURL(img.imageUrl);
                img.imageUrl = imageUrl;
                img.imageBlob = null;
                img.isSaved = true;
              }
              return img;
            })
          );
          toast.success("Saved", { id: "uploading" });
          resolve();
        })
        .catch((err) => {
          console.log(err);
          toast.dismiss("uploading");
          reject(err);
        });
    });
  };

  const handleImageDiscard = (index: number) => {
    const newImageSuggestions = imageSuggestions.filter((_, i) => {
      if (i === index) URL.revokeObjectURL(imageSuggestions[i].imageUrl);
      return i !== index;
    });
    setImageSuggestions(newImageSuggestions);
  };

  const handleAddToBlog = async (image: ImageDataType) => {
    try {
      if (!image.isSaved) {
        await saveToAssets(image);
      }
      handleImageUpload(image.imageUrl, image.prompt);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 h-[90%] w-[24%] space-y-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Generate with AI</h1>
        {setIsAICompletionOpen && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsAICompletionOpen(false);
            }}
            className="bg-red-500 z-50 text-white p-0.5 text-lg"
          >
            <IoClose />
          </button>
        )}
      </div>
      {/* Remaining JSX */}
    </div>
  );
};

export default AICompletion;
