import * as React from "react";
// import img from "../assets/img/Auth/signup.webp";
const img = "https://via.placeholder.com/400x300";

import { useAppDispatch, useAppSelector } from "../hooks";
import { login } from "../features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { LoginType } from "../definitions";
import ContinueWithGoogleButton from "../components/ContinueWithGoogleButton";

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.user);

  const [loginValues, setLoginValues] = React.useState<LoginType>({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login(loginValues));
  };

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/feed");
    }
  }, [loading, isAuthenticated]);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex items-center justify-center">
        <img
          src={img}
          alt="Welcome Back"
          className="hidden lg:block w-full object-cover h-full"
        />
      </div>

      {/* Right Section */}
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6 scale-105">
          <Link to="/" className="text-gray-500 text-lg">
            <span className="mr-1">&#8592;</span>
          </Link>
          <h1 className="text-3xl font-semibold mb-6 text-black">Welcome Back!</h1>
          <h2 className="text-sm font-semibold mb-6 text-gray-500">
            We missed you at Creativerse
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="gap-3 mt-4">
              <label
                htmlFor="email"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={loginValues.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                className="mt-1 p-2.5 px-4 w-full border rounded"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginValues.password}
                onChange={handleChange}
                placeholder="*********"
                className="mt-1 p-2.5 px-4 w-full border rounded"
              />
            </div>
            <div>
              <div className="my-4 ml-2 text-sm text-gray-600">
                <Link
                  to="/forgot-password"
                  className="hover:underline cursor-pointer"
                >
                  <span className="text-black hover:underline">Forgot password?</span>
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-dark text-white p-2.5 px-4 rounded"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>OR</p>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <ContinueWithGoogleButton />
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <Link to="/sign-up" className="hover:underline cursor-pointer">
              Don't have an account?
              <span className="text-black hover:underline"> Sign Up</span>
            </Link>
          </div>
          {/* {loading && <Loader />} */}
        </div>
      </div>
    </div>
  );
}
