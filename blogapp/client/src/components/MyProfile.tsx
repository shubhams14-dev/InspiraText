import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { UserType } from "../definitions";
import Loader from "./Loader";
import { updateProfile, updateImage, deleteProfileImage } from "../api";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbPhotoPlus } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateUser } from "../features/userSlice";

const defUser: UserType = {
  userId: "",
  createdAt: "",
  updatedAt: "",
  blogs: [],
  followingCount: 0,
  followersCount: 0,
  myInterests: [],
  name: "",
  email: "",
  bio: "",
  profileImage: "",
};

const MyProfile = () => {
  const [edit, setEdit] = useState(false);
  const [addInterest, setAddInterest] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [editedUser, setEditedUser] = useState<UserType>(defUser);
  const [loadingProfileImage, setLoadingProfileImage] = useState(false);
  const dispatch = useAppDispatch();
  const { user: originalUser, loading } = useAppSelector((state) => state.user);

  const handleEdit = () => {
    if (originalUser) {
      setEdit(true);
      setEditedUser(originalUser);
    }
  };

  const handleCancel = () => {
    setAddInterest(false);
    setNewInterest("");
    setEdit(false);
  };

  const handleUpdate = async () => {
    updateProfile(editedUser)
      .then((_response) => {
        toast.success("Profile updated successfully");
        dispatch(updateUser(editedUser));
      })
      .catch((error) => console.log(error))
      .finally(() => handleCancel());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      myInterests: prevUser.myInterests.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() !== "") {
      setEditedUser((prevUser) => ({
        ...prevUser,
        myInterests: [...prevUser.myInterests, newInterest],
      }));
      setNewInterest("");
      setAddInterest(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (!originalUser) return;
      toast.loading("Uploading new profile photo", { id: "uploading-profile-image" });
      setLoadingProfileImage(true);
      updateImage(e.target.files[0])
        .then((response) => {
          dispatch(
            updateUser({
              ...originalUser,
              profileImage: response.data.profileImage,
            })
          );
          setEditedUser((prevUser) => ({
            ...prevUser,
            profileImage: response.data.profileImage,
          }));
        })
        .catch((error) => console.log(error))
        .finally(() => {
          toast.success("Profile image updated successfully", { id: "uploading-profile-image" });
          setLoadingProfileImage(false);
        });
    }
  };

  const handleProfileImageDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!originalUser) return;
    setLoadingProfileImage(true);
    deleteProfileImage()
      .then((response) => {
        dispatch(
          updateUser({
            ...originalUser,
            profileImage: response.data.defaultProfileImage,
          })
        );
        setEditedUser((prevUser) => ({
          ...prevUser,
          profileImage: "",
        }));
        toast.success("Profile image deleted successfully");
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingProfileImage(false));
  };

  const user = edit ? editedUser : originalUser;

  if (loading) return <Loader />;
  if (user === null)
    return (
      <div className="text-red-500 font-bold text-center">
        You are not authorized to view this page.
      </div>
    );

  return (
    <div className="flex flex-col font-inter w-full sm:mx-6">
      <nav className="pb-5 px-5 rounded-xl flex flex-col justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-medium">My Profile</h1>
          <span className="text-sm text-slate-500">Manage your profile settings</span>
        </div>
        {!edit ? (
          <button
            onClick={handleEdit}
            type="button"
            className="w-fit text-dark hover:text-white border border-dark px-3 py-2 rounded-lg"
          >
            <CiEdit className="text-base" />
            Edit profile
          </button>
        ) : (
          <div className="flex mx-auto sm:mr-0 mt-3 sm:mt-0">
            <button
              onClick={handleUpdate}
              type="button"
              className="text-dark hover:text-white border border-dark px-3 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="text-dark hover:text-white border border-dark px-3 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </nav>
      <hr />
      <main className="flex flex-col md:flex-row">
        <section className="p-5 md:mx-auto">
          <form action="" className="flex flex-col">
            <label className="text-lg my-2 font-medium text-center">Your profile photo</label>
            <div className="flex flex-col md:flex-row">
              <div className="relative flex w-full md:w-fit">
                {loadingProfileImage && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white z-10 flex items-center justify-center">
                    <Loader />
                  </div>
                )}
                <img
                  className="h-40 w-40 rounded-full border mx-auto"
                  src={user.profileImage}
                  alt={user.name}
                />
              </div>
              {edit && (
                <span className="flex justify-center items-center gap-2">
                  <label
                    htmlFor="file-upload"
                    className="w-fit flex gap-1 text-sm border rounded-lg px-3 py-1 cursor-pointer"
                  >
                    <TbPhotoPlus className="my-auto text-base" />
                    Upload new photo
                  </label>
                  <input
                    id="file-upload"
                    className="hidden"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    onChange={handleProfileChange}
                    name="profileImage"
                  />
                  <button
                    className="flex gap-1 border w-fit p-2 rounded-lg"
                    disabled={loadingProfileImage || user.profileImage === ""}
                    onClick={handleProfileImageDelete}
                  >
                    <MdDeleteOutline className="my-auto text-base" />
                    Delete
                  </button>
                </span>
              )}
            </div>
            <div className="flex gap-5 my-4 text-sm w-fit mx-auto">
              <span>
                <span className="rounded-xl p-1 text-slate-700">
                  {user?.followersCount}
                </span>
                <span className="text-slate-500">Followers</span>
              </span>
              <span>
                <span className="rounded-xl p-1 text-slate-700">
                  {user?.followingCount}
                </span>
                <span className="text-slate-500">Following</span>
              </span>
            </div>
            <label className="mt-2 text-slate-600 font-light">Full Name</label>
            <input
              type="text"
              placeholder="Vedant Nagar"
              disabled={!edit}
              name="name"
              value={user.name}
              minLength={3}
              maxLength={50}
              onChange={handleChange}
              className={`rounded-lg p-2 border ${edit ? "text-black" : "text-gray-500"}`}
            />
            <label className="mt-2 text-slate-600 font-light">Email Address</label>
            <input
              type="text"
              placeholder="pathaa@gmail.com"
              disabled={true}
              value={user.email}
              className="rounded-lg p-2 border"
            />
            <label className="mt-6 text-slate-600">Profile bio</label>
            <textarea
              rows={4}
              cols={50}
              maxLength={150}
              disabled={!edit}
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className={`rounded-lg p-2 border ${edit ? "text-black" : "text-gray-500"}`}
            ></textarea>
          </form>
        </section>
        <section className="sm:w-full xs:w-3/4 lg:w-1/2 py-5 mx-auto">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <h3 className="text-lg font-medium mb-3">My Interests</h3>
            <div className="flex sm:flex-col flex-wrap gap-3">
              <div className="flex flex-wrap gap-2">
                {!edit && user.myInterests.length === 0 && (
                  <span className="text-gray-500">No interests added yet.</span>
                )}
                {user.myInterests.map((item, index) => {
                  return (
                    <span
                      className="flex rounded-xl border w-fit p-2 gap-1 items-center"
                      key={index}
                    >
                      <span>{item}</span>
                      <button
                        className={`${!edit && "hidden"} `}
                        onClick={() => handleRemoveInterest(index)}
                      >
                        <ClearIcon fontSize="small" />
                      </button>
                    </span>
                  );
                })}
                <button
                  className={`${!edit && "hidden"} border p-2 rounded-lg`}
                  onClick={() => setAddInterest(true)}
                >
                  <AddIcon /> Add
                </button>
              </div>
              {addInterest && (
                <div className="flex flex-col gap-2 xs:flex-row">
                  <input
                    type="text"
                    placeholder="Type to add interest"
                    disabled={!edit}
                    value={newInterest}
                    maxLength={20}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="rounded-lg p-2 border"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                  />
                  <button
                    className="flex justify-center gap-0.5 border p-2 rounded-lg"
                    onClick={handleAddInterest}
                  >
                    <IoIosAddCircleOutline className="my-auto" />
                    Add
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
