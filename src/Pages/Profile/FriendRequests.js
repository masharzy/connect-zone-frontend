import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import Loading from "../Shared/Loading/Loading";
import ProfileHeader from "./ProfileHeader";

const FriendRequests = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [user, loading] = useAuthState(auth);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    setUserDataLoading(true);
    axios.get(`https://connectzone.herokuapp.com/user/${email}`).then((res) => {
      setUserData(res.data);
      setUserDataLoading(false);
    });
  }, [email, user]);

  useEffect(() => {
    if (user?.email === email) {
      axios
        .get(`https://connectzone.herokuapp.com/friendRequests/${user?.email}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setFriendRequests(res.data);
          }
        });
    }
  }, [email, user]);

  if (userDataLoading || loading) {
    return <Loading />;
  }
  return (
    <div className="bg-white">
      <div className="requests profile px-40 py-5">
        <ProfileHeader />
        <div className="profile-body mt-10">
          <div className="profile-body-info bg-[#F0F2F5] p-10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {userData.displayName.split(" ")[0]}'s Friend Requests
            </h3>
            <hr />
          </div>
          <div className="requests">
            {friendRequests.length > 0 ? (
              friendRequests.map((friendRequest) => {
                return (
                  <div
                    className="friendRequest post card max-w-3xl w-full bg-[#F0F2F5] p-10 shadow-xl mt-5 mx-auto"
                    key={friendRequest._id}
                  >
                    <div className="flex justify-between">
                      <div className="flex">
                        <img
                          className="w-10 object-cover"
                          src={friendRequest.senderImage}
                          alt=""
                        />
                        <div className="ml-5">
                          <h2 className="text-xl font-semibold">
                            {friendRequest.senderName}
                          </h2>
                          <h5>{friendRequest.senderEmail}</h5>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full mr-2 px-12"
                          onClick={async () => {
                            await axios
                              .put(
                                `https://connectzone.herokuapp.com/pushFriend/${user?.email}`,
                                {
                                  firstName: userData.firstName,
                                  lastName: userData.lastName,
                                  displayName: userData.displayName,
                                  email: userData.email,
                                  dateOfBirth: userData.dateOfBirth,
                                  friends: [
                                    ...userData.friends,
                                    friendRequest.senderEmail,
                                  ],
                                  img: userData.img,
                                  slug: userData.slug,
                                }
                              )
                              .then((res) => {
                                if (res.status === 200) {
                                  axios
                                    .put(
                                      `https://connectzone.herokuapp.com/pushFriend/${friendRequest.senderEmail}`,
                                      {
                                        displayName: friendRequest.senderName,
                                        email: friendRequest.senderEmail,
                                        friends: [
                                          ...friendRequest.senderFriends,
                                          user?.email,
                                        ],
                                        img: friendRequest.senderImage,
                                      }
                                    )
                                    .then((res) => {
                                      if (res.status === 200) {
                                        axios
                                          .delete(
                                            `https://connectzone.herokuapp.com/acceptFriendRequest/${friendRequest.senderEmail}/${user?.email}`
                                          )
                                          .then((res) => {
                                            if (res.status === 200) {
                                              toast.success(
                                                "Friend Request Accepted"
                                              );
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 rounded-full px-12"
                          onClick={() => {
                            axios
                              .delete(
                                `https://connectzone.herokuapp.com/acceptFriendRequest/${friendRequest.senderEmail}/${user?.email}`
                              )
                              .then((res) => {
                                if (res.status === 200) {
                                  toast.success("Friend Request Deleted");
                                }
                              });
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="text-xl font-semibold my-5 text-center">
                No Friend Requests
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
