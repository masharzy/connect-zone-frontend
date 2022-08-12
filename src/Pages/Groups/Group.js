import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import auth from "../../firebase.init";
import Posts from "../Home/Posts";
import Loading from "../Shared/Loading/Loading";
import GroupHeader from "./GroupHeader";

const Group = () => {
  const { groupSlug } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [isPosted, setIsPosted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [alreadyInThisGroup, setAlreadyInThisGroup] = useState(false);
  const [somethingChanged, setSomethingChanged] = useState(false);

  const { register, handleSubmit } = useForm();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date();
  let month = months[d.getMonth()];
  let date = d.getDate();
  const todayDate = `${month} ${date}`;

  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 30; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  const onSubmit = async (data, e) => {
    await axios
      .post(`https://connectzone.herokuapp.com/group/${groupSlug}`, {
        _id: text,
        userName: user.displayName,
        userImage: userData.img,
        userEmail: user.email,
        postCaption: data.postCaption,
        postImages: uploadedImage,
        postLikes: 0,
        time: todayDate,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsPosted(!isPosted);
          e.target.reset();
          setUploadedImage([]);
        }
      });
  };

  useEffect(() => {
    axios
      .get(
        `https://connectzone.herokuapp.com/groupBySlug/${groupSlug}`
      )
      .then((res) => {
        setGroupInfo(res.data);
      });
  }, [groupSlug, somethingChanged]);

  useEffect(() => {
    if (groupInfo?.groupMembers) {
      for (let i = 0; i < groupInfo?.groupMembers.length; i++) {
        if (groupInfo?.groupMembers[i] === user?.email) {
          setAlreadyInThisGroup(true);
          setSomethingChanged(true);
        }
      }
    }
  }, [groupInfo, user, somethingChanged]);

  useEffect(() => {
    if (user) {
      setUserDataLoading(true);
      axios
        .get(`https://connectzone.herokuapp.com/user/${user?.email}`)
        .then((res) => {
          setUserData(res.data);
          setUserDataLoading(false);
        });
    }
  }, [groupSlug, user, somethingChanged]);

  if (loading || userDataLoading) {
    return <Loading />;
  }

  const openFileDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_this) => {
      let files = Array.from(input.files);
      files.forEach((file) => {
        const imageStorageKey = "25f8fd66fcd0b291d11ff45ad0f16374";
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        const formData = new FormData();
        formData.append("image", file);
        axios.post(url, formData).then((res) => {
          if (res.data.success) {
            const imageUrl = res.data.data.url;
            console.log(imageUrl);
            setUploadedImage([...uploadedImage, imageUrl]);
          }
        });
      });
    };
    input.click();
  };

  return (
    <div className="bg-white">
      <GroupHeader groupSlug={groupSlug} />

      {alreadyInThisGroup ? (
        <div className="lg:px-60">
          {/* Post form */}
          <div className="post-form bg-white flex justify-center rounded-xl p-10 shadow-sm sticky">
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={userData?.img}
              alt=""
            />
            <label
              for="my-modal"
              className="cursor-pointer pl-5 relative bg-gray-200 rounded-full w-full ml-4 modal-button"
            >
              <span className="absolute top-1/4">
                What are you thinking, {user.displayName.split(" ")[0]}?
              </span>
            </label>
          </div>

          {/* <Posts/> */}
          <Posts
            isPosted={isPosted}
            url={`https://connectzone.herokuapp.com/group/${groupSlug}/posts`}
          />
        </div>
      ) : (
        <p className="text-center mt-5 font-bold text-lg">
          Please Join to view posts
        </p>
      )}

      {/* Modal */}
      <div className="post-modal">
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              for="my-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <h3 className="font-bold text-lg text-center mb-2">Create post</h3>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea w-full placeholder:text-2xl text-lg"
                style={{ outline: "0" }}
                placeholder={`What are you thinking, ${
                  user.displayName.split(" ")[0]
                }?`}
                rows="8"
                name="postCaption"
                {...register("postCaption")}
              ></textarea>
              <div className="flex justify-center space-x-3">
                {uploadedImage.length > 0 ? (
                  uploadedImage.map((image, index) => {
                    return (
                      <div>
                        <img
                          className="w-10 h-10 object-cover rounded-full"
                          src={image}
                          alt=""
                          key={index}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="addExtra border rounded-lg flex justify-between items-center py-4 px-3 w-full">
                    <p>Add to your post</p>
                    <img
                      onClick={openFileDialog}
                      className="w-8 cursor-pointer"
                      src="https://i.ibb.co/N3GgfHY/image.png"
                      alt=""
                    />
                  </div>
                )}
                {uploadedImage.length > 0 ? (
                  <div>
                    <img
                      onClick={openFileDialog}
                      className="w-8 cursor-pointer"
                      src="https://i.ibb.co/N3GgfHY/image.png"
                      alt=""
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <input
                type="submit"
                className="btn btn-primary w-full text-white mt-1"
                value="Post"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
