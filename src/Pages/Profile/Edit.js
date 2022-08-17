import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import Loading from "../Shared/Loading/Loading";

const Edit = () => {
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [user, loading] = useAuthState(auth);
  const [updateProfile, updating, error] = useUpdateProfile(auth);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [changes, setChanges] = useState({
    displayName: "",
  });

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

  useEffect(() => {
    setUserDataLoading(true);
    axios.get(`http://localhost:5000/user/${user.email}`).then((res) => {
      setUserData(res.data);
      setUserDataLoading(false);
    });
  }, [user, profileUpdated]);

  useEffect(() => {
    if (updating) {
      toast.success("Updating");
    }
    if (error) {
      toast.error("Error");
    }
  }, [updating, error]);
  if (userDataLoading || loading) {
    return <Loading />;
  }

  const uploadImage = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_this) => {
      let files = Array.from(input.files);
      const image = files[0];
      if (image) {
        const imageStorageKey = "25f8fd66fcd0b291d11ff45ad0f16374";
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        const formData = new FormData();
        formData.append("image", image);
        axios.post(url, formData).then((res) => {
          if (res.data.success) {
            const updatePhotoUrl = async () => {
              const photoUrl = res.data.data.url;
              await updateProfile({ photoURL: photoUrl });
              await axios
                .put(`http://localhost:5000/user/${user.email}`, {
                  img: photoUrl,
                })
                .then((res) => {
                  if (res.status === 200) {
                    toast.success("Photo updated successfully");
                    setProfileUpdated(true);
                    axios.post("http://localhost:5000/post", {
                      userName: user.displayName,
                      userImage: photoUrl,
                      userEmail: user.email,
                      postCaption: `${user.displayName} updated his profile picture`,
                      postImages: [photoUrl],
                      reason: "profilePicture",
                      postLikes: [],
                      postComments: [
                        {
                          commentUserName: "",
                          commentUserImage: "",
                          commentUserEmail: "",
                          commentText: "",
                        },
                      ],
                      time: todayDate,
                    });
                    axios.put(
                      `http://localhost:5000/updatePostUserImage/${user.email}`,
                      {
                        userImage: photoUrl,
                      }
                    );
                  }
                });
            };
            updatePhotoUrl();
          }
        });
      }
    };
    input.click();
  };

  const updateProfileInfo = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    await updateProfile({ displayName: name });
    await axios
      .put(`http://localhost:5000/user/${user.email}`, {
        displayName: name,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Profile updated successfully");
          setProfileUpdated(true);
          axios.put(`http://localhost:5000/updatePostUserName/${user.email}`, {
            userName: name,
          });
        }
      });
  };

  return (
    <div className="bg-white">
      <div className="edit-profile  px-40 py-5">
        <div className="edit-profile-body mt-10">
          <div className="edit-profile-body-info bg-[#F0F2F5] p-10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
            <hr />
          </div>
          <div className="edit-profile-body-form mt-5 flex space-x-12 bg-[#F0F2F5] p-10 rounded-lg justify-center items-center">
            <div className="flex flex-col items-center">
              <img
                className="rounded-full w-32 h-32 object-cover border-gray-400 border-4 p-1 mb-1"
                src={userData.img}
                alt=""
              />
              <button
                className="btn btn-primary px-10 rounded-full text-white"
                onClick={uploadImage}
              >
                Upload Image
              </button>
            </div>
            <form className="w-full max-w-lg" onSubmit={updateProfileInfo}>
              <input
                type="text"
                placeholder="Name"
                class="input input-bordered w-full mb-2"
                name="name"
                defaultValue={userData.displayName}
                onChange={(e) =>
                  setChanges({ ...changes, displayName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Email"
                class="input input-bordered w-full mb-2"
                defaultValue={userData.email}
                disabled
              />
              <input
                type="submit"
                className="btn btn-accent text-white w-full"
                value="Save Changes"
                disabled={changes.displayName === "" || changes.displayName === userData.displayName ? true : false}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
