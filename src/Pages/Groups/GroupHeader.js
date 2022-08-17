import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCheckCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";

const GroupHeader = ({ groupSlug }) => {
  const [groupInfo, setGroupInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [alreadyInThisGroup, setAlreadyInThisGroup] = useState(false);
  const [user, userLoading] = useAuthState(auth);
  const [somethingChanged, setSomethingChanged] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/groupBySlug/${groupSlug}`
      )
      .then((res) => {
        setGroupInfo(res.data);
        setLoading(false);
      });
  }, [groupSlug, somethingChanged]);

  useEffect(() => {
    if (groupInfo?.groupMembers) {
      for (let i = 0; i < groupInfo?.groupMembers.length; i++) {
        if (groupInfo?.groupMembers[i] === user?.email) {
          return setAlreadyInThisGroup(true);
        }
      }
    }
  }, [groupInfo, user, somethingChanged]);

  if (loading || userLoading) {
    return (
      <div className="bg-white">
        <div className="group lg:px-60">
          <div className="group-header bg-[#F0F2F5] pb-3 rounded-lg">
            <div className="group-cover">
              <Skeleton />
            </div>
            <div className="group-info px-10 my-5">
              <div className="flex justify-between items-center">
                <div className="left-side">
                  <div className="group-name">
                    <h2 className="text-3xl font-bold">
                      <Skeleton />
                    </h2>
                  </div>
                  <div className="group-members">
                    <h5>
                      <Skeleton />
                    </h5>
                  </div>
                </div>
                <div className="right-side">
                  <Skeleton />
                </div>
              </div>
              <hr className="border-2 mt-2" />
              <ul className="menu menu-horizontal mt-5">
                <Skeleton />
                <Skeleton />
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { groupName, groupMembers, groupCoverPhoto, groupCreatorEmail } =
    groupInfo;

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
              await axios
                .put(`http://localhost:5000/group/${groupSlug}/coverPhoto`, {
                  groupCoverPhoto: photoUrl,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setSomethingChanged(!somethingChanged);
                    toast.success("Cover photo updated!");
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

  return (
    <div className="bg-white">
      <div className="group lg:px-60">
        <div className="group-header bg-[#F0F2F5] pb-3 rounded-lg">
          <div className="group-cover relative">
            <img
              src={groupCoverPhoto}
              className="w-full rounded-lg h-[450px] object-cover"
              alt="group cover"
            />
            {groupCreatorEmail === user.email ? (
              <button onClick={uploadImage} className="btn btn-primary px-5 rounded-full text-white absolute bottom-5 left-5">
                Upload Cover Image
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="group-info px-10 my-5">
            <div className="flex justify-between items-center">
              <div className="left-side">
                <div className="group-name">
                  <h2 className="text-3xl font-bold">{groupName}</h2>
                </div>
                <div className="group-members">
                  <h5>
                    {groupMembers?.length}{" "}
                    {groupMembers?.length === 1 ? "member" : "members"}
                  </h5>
                </div>
              </div>
              <div className="right-side">
                {alreadyInThisGroup ? (
                  <button className="btn btn-primary text-white px-12 rounded-full">
                    <FaCheckCircle className="mr-2" />
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (user) {
                        axios
                          .put(
                            `http://localhost:5000/group/${groupSlug}/pushMember`,
                            {
                              email: user.email,
                            }
                          )
                          .then((res) => {
                            if (res.status === 200) {
                              setAlreadyInThisGroup(true);
                              setSomethingChanged(true);
                            }
                          });
                      }
                    }}
                    className="btn btn-primary text-white px-12 rounded-full"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
            <hr className="border-2 mt-2" />
            <ul className="menu menu-horizontal mt-5">
              <Link className="btn btn-ghost" to={`/group/${groupSlug}/about`}>
                About
              </Link>
              <Link className="btn btn-ghost" to={`/group/${groupSlug}`}>
                Posts
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
