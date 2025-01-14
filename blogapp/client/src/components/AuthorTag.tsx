import { NavLink } from "react-router-dom";
import { Author } from "../definitions";

const AuthorTag = ({ author }: { author: Author }) => {
  return (
    <NavLink className="flex items-end" to={`/user/${author._id}`}>
      <img
        className="object-cover object-center w-6 aspect-square rounded-full"
        src={author.profileImage}
        alt={`${author.name}'s profile`}
      />
      <div className="ml-2">
        <h1 className="text-base text-gray-700 hover:underline">
          {author.name}
        </h1>
      </div>
    </NavLink>
  );
};

export default AuthorTag;
