import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    useCreateUserWithEmailAndPassword,
    useUpdateProfile
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../firebase.init";
import Loading from "../Pages/Shared/Loading/Loading";

const Register = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [existedUser, setExistedUser] = useState(false);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (error || updateError) {
      const newErrorMessage =
        error?.message
          .split("Firebase: Error (auth/")
          .join("")
          .split(").")
          .join("")
          .split("-")
          .join(" ") ||
        updateError?.message
          .split("Firebase: Error (auth/")
          .join("")
          .split(").")
          .join("")
          .split("-")
          .join(" ");
      toast.error(newErrorMessage.toUpperCase());
    }
  }, [error, updateError]);

  if (loading) {
    return <Loading />;
  }

  let from = location.state?.from?.pathname || "/";

  if (user) {
    navigate(from, { replace: true });
  }

  const onSubmit = async (data) => {
    const displayName = data.name;
    const user = {
      displayName: displayName,
      slug:
        displayName.toLowerCase().replace(/\s/g, "-") +
        "-" +
        (Math.random() * 100).toFixed(0),
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      friends: [data.email],
      img: "https://i.ibb.co/7SPmy5y/image.png",
    };
    await axios
      .get("https://connectzone.herokuapp.com/users")
      .then((res) => {
        res.data.forEach((user) => {
          if (user.email === data.email) {
            setExistedUser(true);
          }
        });
      });
    if (!existedUser) {
      await createUserWithEmailAndPassword(data.email, data.password);
      await updateProfile({ displayName });
      await axios
        .post("https://connectzone.herokuapp.com/user", user)
        .then((res) => {
          if (res.status === 200) {
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("User already existed");
    }
  };

  return (
    <div className="register">
      <div className="flex max-h-screen justify-around items-center h-screen lg:px-60 lg:flex-row flex-col">
        <div>
          <h2 className="text-blue-600 text-5xl font-bold">Connect zone</h2>
          <p className="font-semibold">Let's connect with business world</p>
        </div>
        <div className="backdrop-blur-3xl rounded-xl bg-[#ffffff21] shadow-xl relative w-full max-w-md">
          <img
            className="absolute -top-10 mx-auto left-0 right-0 w-20 bg-[#00264D] p-4 rounded-full"
            src="https://i.ibb.co/Rg4TL4y/user.png"
            alt=""
          />
          <div className="card-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto w-full mt-8"
            >

                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Name"
                    className="input input-bordered w-full bg-[#0B0F2C] text-white"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Name is Required",
                      },
                      maxLength: {
                        value: 20,
                        message: "Name must be less than 20 characters",
                      },
                      minLength: {
                        value: 3,
                        message: "Name must be greater than 3 characters",
                      },
                    })}
                  />
                  <label className="label">
                    {errors?.lastName?.type === "required" && (
                      <span className="label-text-alt text-red-400 text-base font-semibold">
                        {errors?.lastName?.message}
                      </span>
                    )}
                    {errors?.lastName?.type === "maxLength" && (
                      <span className="label-text-alt text-red-400 text-base font-semibold">
                        {errors?.lastName?.message}
                      </span>
                    )}
                    {errors?.lastName?.type === "minLength" && (
                      <span className="label-text-alt text-red-400 text-base font-semibold">
                        {errors?.lastName?.message}
                      </span>
                    )}
                  </label>
                </div>

              <div className="form-control mr-1">
                <input
                  type="text"
                  placeholder="Email"
                  className="input input-bordered w-full bg-[#0B0F2C] text-white"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is Required",
                    },
                    pattern: {
                      value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                      message: "Provide a valid Email",
                    },
                  })}
                />
                <label className="label">
                  {errors?.email?.type === "required" && (
                    <span className="label-text-alt text-red-400 text-base font-semibold">
                      {errors?.email?.message}
                    </span>
                  )}
                  {errors?.email?.type === "pattern" && (
                    <span className="label-text-alt text-red-400 text-base font-semibold">
                      {errors?.email?.message}
                    </span>
                  )}
                </label>
              </div>

              <div className="form-control">
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full bg-[#0B0F2C] text-white"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is Required",
                    },
                    minLength: {
                      value: 6,
                      message: "Must be 6 characters or longer",
                    },
                  })}
                />
                <label className="label">
                  {errors?.password?.type === "required" && (
                    <span className="label-text-alt text-red-400 text-base font-semibold">
                      {errors?.password?.message}
                    </span>
                  )}
                  {errors?.password?.type === "minLength" && (
                    <span className="label-text-alt text-red-400 text-base font-semibold">
                      {errors?.password?.message}
                    </span>
                  )}
                </label>
              </div>

              <div className="form-control">
                <input
                  type="date"
                  placeholder="Date"
                  className="input input-bordered w-full bg-[#0B0F2C] text-white"
                  {...register("dateOfBirth", {
                    required: {
                      value: true,
                      message: "Date of birth is Required",
                    },
                  })}
                />
                <label className="label">
                  {errors?.dateOfBirth?.type === "required" && (
                    <span className="label-text-alt text-red-400 text-base font-semibold">
                      {errors?.dateOfBirth?.message}
                    </span>
                  )}
                </label>
              </div>

              <Link
                to="/login"
                className="text-[#00264D] text-center text-sm link-hover ml-2"
              >
                <FaArrowLeft className="inline" /> Back to login
              </Link>

              <input
                className="bg-[#00264D] rounded-lg py-3 cursor-pointer hover:bg-[#01356a] transition-all duration-300 w-full text-white mt-3"
                type="submit"
                value="Register"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
