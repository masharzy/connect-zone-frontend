import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import auth from "../../firebase.init";
import Comments from "../Home/Comments";
// import Comments from "./Comments";

const GroupPost = ({ post }) => {
  const {
    _id,
    userName,
    userEmail,
    userImage,
    time,
    postCaption,
    postImages,
    reason
  } = post;
  const { groupSlug } = useParams();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [isCommented, setIsCommented] = useState(false);
  const [open, setOpen] = useState(false);
  const { email } = useParams();
  const [commenting, setCommenting] = useState(false);
  const [likeActive, setLikeActive] = useState(true);
  const [liking, setLiking] = useState(false);
  const [postData, setPostData] = useState({});
  const [alreadyLiked, setAlreadyLiked] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://connectzone.herokuapp.com/user/${
          user ? user.email : email
        }`
      )
      .then((res) => setUserData(res.data));
  }, [user, email]);

  useEffect(() => {
    axios
      .get(`https://connectzone.herokuapp.com/group/${groupSlug}/post/${_id}`)
      .then((res) => setPostData(res.data));
  }, [_id, groupSlug, likeActive]);

  useEffect(() => {
    axios
      .get(`https://connectzone.herokuapp.com/group/${groupSlug}/post/${_id}/checkLike/${user?.email}`)
      .then((res) => {
        if (res.data === true) {
          setAlreadyLiked(true);
        } else {
          setAlreadyLiked(false);
        }
      });
  }, [_id, groupSlug, user]);

  const { postLikes: likes } = postData;
  const { img } = userData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    const comment = {
      postId: _id,
      commentUserName: user.displayName,
      commentUserImage: user.photoURL ? user.photoURL : img,
      commentUserEmail: user.email,
      commentText: data.commentText,
    };
    setCommenting(true);
    await axios
      .post(`https://connectzone.herokuapp.com/comment`, comment)
      .then((res) => {
        if (res.status === 200) {
          e.target.reset();
          setIsCommented(!isCommented);
          setCommenting(false);
        }
      });
  };

  const updateLike = async (id) => {
    if (alreadyLiked) {
      setLiking(true);
      await axios
        .delete(`https://connectzone.herokuapp.com/group/${groupSlug}/post/${id}/deleteLike`)
        .then((res) => {
          if (res.status === 200) {
            setLiking(false);
            setAlreadyLiked(false);
            setLikeActive(!likeActive);
          }
        })
    } else {
      setLiking(true);
      await axios
        .put(`https://connectzone.herokuapp.com/group/${groupSlug}/post/${id}`, {
          email: user.email
        })
        .then((res) => {
          if (res.status === 200) {
            setLiking(false);
            setAlreadyLiked(true);
            setLikeActive(!likeActive);
          }
        });
      }
  };


  return (
    <div className="post card max-w-3xl w-full bg-white shadow-xl mt-5 mx-auto">
      <div className="card-body">
        <div className="post-header flex items-center">
          <Link to={`/user/${userEmail}`}>
            <img
              className="w-10 h-10 object-cover rounded-full hover:border-gray-400 hover:border-2"
              src={userImage}
              alt=""
            />
          </Link>
          <div className="post-header-info flex flex-col ml-2">
            <Link
              to={`/user/${userEmail}`}
              className="font-semibold link-hover"
            >
              {userName}
            </Link>
            <span className="text-xs link-hover cursor-pointer text-gray-400">
              {time}
            </span>
          </div>
        </div>

        <div className="post-content py-1">
          <p className="mb-2 ml-2">{postCaption}</p>
          <div className="grid grid-cols-2 justify-center">
            {postImages?.map((image, index) => {
              return (
                <img
                  key={index}
                  className={
                    reason === "profilePicture"
                      ? "w-[60%] object-cover mx-auto rounded-full col-span-2"
                      : "rounded-lg w-[95%] m-2 object-cover"
                  }
                  src={image}
                  alt=""
                />
              );
            })}
          </div>
        </div>
        <hr />
        <div className="flex justify-around">
          <button
            className={`${
              alreadyLiked
                ? "hover:bg-gray-300 rounded-lg w-full transition-all duration-200 py-1 font-semibold text-blue-600"
                : "hover:bg-gray-300 rounded-lg w-full transition-all duration-200 py-1 font-semibold"
            }`}
            onClick={() => updateLike(_id)}
          >
            <FaThumbsUp className="inline" />
            <span className="ml-1">{liking ? "Updating" : "Like"}</span>
            <span className="ml-1">{likes?.length}</span>
          </button>

          <button
            className="hover:bg-gray-300 rounded-lg w-full transition-all duration-200 py-1 font-semibold"
            onClick={() => setOpen(!open)}
          >
            <FaCommentAlt className="inline" />
            <span className="ml-1">Comment</span>
          </button>
        </div>
        <hr />

        {user ? (
          <div className={open ? "comment-section" : "hidden"}>
            <form className="comment flex" onSubmit={handleSubmit(onSubmit)}>
              {commenting && (
                <div className="modal-overlay absolute right-0 left-0 top-0 bottom-0 z-40">
                  <div className="bg-[#3333334c] h-full flex justify-center items-center text-white">
                    <div class="flex items-center justify-center space-x-2 animate-bounce">
                      <div class="w-8 h-8 bg-white rounded-full"></div>
                      <div class="w-8 h-8 bg-white rounded-full"></div>
                      <div class="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
              <img
                className="w-12 bg-[#0B0F2C] p-2 rounded-full"
                src={user.photoURL ? user.photoURL : img}
                alt=""
              />
              <input
                type="text"
                placeholder="Write a comment..."
                className="input w-full ml-2 bg-gray-200 rounded-full"
                style={errors.commentText && { borderColor: "red" }}
                {...register("commentText", {
                  required: true,
                })}
              />
            </form>
            {/* All comments */}
            <Comments isCommented={isCommented} _id={_id} />
          </div>
        ) : (
          <p>Please login to comment</p>
        )}
      </div>
    </div>
  );
};

export default GroupPost;
