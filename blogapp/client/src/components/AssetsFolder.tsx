import React from "react";
import { useDropzone } from "react-dropzone";
import { getAssets, uploadAssets, deleteAsset } from "../api";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "./Loader";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import confirm from "./ConfirmationComponent";

interface AssetsFolderProps {
  setIsAssetsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageUpload?: (imageUrl: string, prompt: string) => void;
}

const AssetsFolder: React.FC<AssetsFolderProps> = ({
  setIsAssetsOpen,
  handleImageUpload,
}) => {
  const [assets, setAssets] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    getAssets()
      .then((res) => setAssets(res.data.assets))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-4 h-5/6 w-full space-y-4 rounded-lg shadow-lg">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Your Saved Assets</h1>
        {setIsAssetsOpen && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsAssetsOpen(false);
            }}
            className="bg-red-500 z-50 text-white p-0.5 h-fit flex items-center justify-center rounded-full"
          >
            <IoClose />
          </button>
        )}
      </div>
      <Dropzone setAssets={setAssets} />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap gap-4 items-center">
          {assets.map((asset) => (
            <Assets
              asset={asset}
              setAssets={setAssets}
              key={asset}
              handleImageUpload={handleImageUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dropzone = ({
  setAssets,
}: {
  setAssets: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [uploading, setUploading] = React.useState(false);

  const onDropAccepted = React.useCallback(
    async (acceptedFiles: File[]) => {
      toast.loading("Uploading...", { id: "uploading" });
      setUploading(true);

      uploadAssets(acceptedFiles)
        .then((res) => setAssets((prev) => [...prev, ...res.data]))
        .catch((err) => console.log(err))
        .finally(() => {
          toast.dismiss("uploading");
          setUploading(false);
        });
    },
    [setAssets]
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    disabled: uploading,
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024, // 4MB
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    onDropRejected: (files) => {
      files.forEach((file) => {
        toast.error(
          `${file.file.name}: ${file.errors
            .map((err) => err.message)
            .join(", ")}`
        );
      });
    },
    onDropAccepted: onDropAccepted,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-dashed border-2 flex relative flex-col items-center justify-center`}
    >
      <input {...getInputProps()} className="absolute left-0 top-0 w-full h-full opacity-0" />
      <div className="flex items-center w-full justify-center gap-2">
        <LuImagePlus className="text-5xl text-gray-500" />
        <div>
          <p>Drag 'n' drop some files here, or click to select files</p>
          <em>(Only *.jpeg, *.jpg, *.png, *.webp images up to 4MB)</em>
        </div>
      </div>
    </div>
  );
};

const Assets = ({
  asset,
  setAssets,
  handleImageUpload,
}: {
  asset: string;
  setAssets: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageUpload?: (imageUrl: string, prompt: string) => void;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteButton = async (assetUrl: string) => {
    const confirmDeletion = await confirm(
      "Are you sure you want to delete this asset?",
      {
        title: "Delete Asset",
        deleteButton: "Delete",
        cancelButton: "Cancel",
      }
    );

    if (confirmDeletion === false) return;

    setLoading(true);

    deleteAsset(assetUrl)
      .then(() => {
        setAssets((prev) => prev.filter((item) => item !== assetUrl));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const name = asset
    .split("/")
    .slice(-1)
    .join("/")
    .split("_")
    .slice(0, -1)
    .join("_")
    .replace("%20", " ");

  return (
    <div className="flex items-center flex-col relative font-light">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 z-10">
          <Loader />
        </div>
      )}
      <img
        src={asset}
        alt={name}
        className="h-24 min-w-24 object-cover rounded-lg hover:ring ring-highlight cursor-pointer"
        onClick={
          handleImageUpload ? () => handleImageUpload(asset, name) : undefined
        }
      />
      <span className="w-full overflow-hidden text-center">{name.slice(0, 15)}</span>
      <button
        className="p-0.5 aspect-square flex right-1 top-1 bg-white absolute shadow-sm"
        onClick={() => handleDeleteButton(asset)}
        disabled={loading}
      >
        <DeleteIcon className="!text-sm" />
      </button>
    </div>
  );
};

export default AssetsFolder;
