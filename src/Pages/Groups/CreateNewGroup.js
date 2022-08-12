import axios from "axios";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import LeftSide from "../Home/LeftSide";
import RightSide from "../Home/RightSide";

const CreateNewGroup = () => {
  const [user] = useAuthState(auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data, e) => {
    const { groupName, groupDescription } = data;
    const group = {
      groupName: groupName,
      groupSlug:
        groupName.toLowerCase().replace(/\s/g, "-") +
        "-" +
        (Math.random() * 10000).toFixed(0) +
        "-" +
        (Math.random() * 10000).toFixed(0),
      groupMembers: [user.email],
      groupDescription: groupDescription,
      groupPosts: [],
      groupCoverPhoto: "https://i.ibb.co/bNc09qg/image.png",
      groupCreatorName: user.displayName,
      groupCreatorEmail: user.email,
    };
    await axios
      .post("https://connectzone.herokuapp.com/group", group)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Group created successfully");
          e.target.reset();
          navigate(`/group/${group.groupSlug}`);
        }
      });
  };
  return (
    <div>
      <div className="flex gap-4">
        <LeftSide />
        <div className="middle p-5 m-auto rounded-lg mt-5 max-w-3xl w-full h-screen">
          <h3 className="text-xl font-semibold">Create new group</h3>
          <hr />
          <form
            className="mt-5 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Group name"
              className="input input-bordered w-full rounded-full max-w-lg"
              {...register("groupName", {
                required: {
                  value: true,
                  message: "Group Name is Required",
                },
                maxLength: {
                  value: 40,
                  message: "Group Name be less than 40 characters",
                },
                minLength: {
                  value: 2,
                  message: "Group Name be greater than 2 characters",
                },
              })}
            />
            <label className="label">
              {errors?.groupName?.type === "required" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupName?.message}
                </span>
              )}
              {errors?.groupName?.type === "maxLength" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupName?.message}
                </span>
              )}
              {errors?.groupName?.type === "minLength" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupName?.message}
                </span>
              )}
            </label>
            <textarea
              class="textarea textarea-bordered w-full max-w-lg"
              placeholder="Group Description"
              {...register("groupDescription", {
                required: {
                  value: true,
                  message: "Group Description is Required",
                },
                maxLength: {
                  value: 200,
                  message: "Group Description be less than 200 characters",
                },
                minLength: {
                  value: 2,
                  message: "Group Description be greater than 2 characters",
                },
              })}
            ></textarea>
            <label className="label">
              {errors?.groupDescription?.type === "required" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupDescription?.message}
                </span>
              )}
              {errors?.groupDescription?.type === "maxLength" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupDescription?.message}
                </span>
              )}
              {errors?.groupDescription?.type === "minLength" && (
                <span className="label-text-alt text-red-400 text-base font-semibold">
                  {errors?.groupDescription?.message}
                </span>
              )}
            </label>
            <input
              type="submit"
              className="btn btn-primary text-white w-full max-w-lg"
              value="Create New Group"
            />
          </form>
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default CreateNewGroup;
