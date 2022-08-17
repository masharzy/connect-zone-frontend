import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import Loading from "../Shared/Loading/Loading";

const ProfileHeader = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [user, loading] = useAuthState(auth);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [alreadyFriend, setAlreadyFriend] = useState(false);

  useEffect(() => {
    setUserDataLoading(true);
    axios.get(`http://localhost:5000/user/${email}`).then((res) => {
      setUserData(res.data);
      setUserDataLoading(false);
    });
  }, [email, user, friendRequestSent]);

  useEffect(() => {
    if (userData?.friends) {
      for (let i = 0; i < userData?.friends.length; i++) {
        if (userData?.friends[i] === user?.email) {
          return setAlreadyFriend(true);
        }
      }
    }
  }, [userData, user, friendRequestSent]);

  const sendFriendRequest = async () => {
    if (user) {
      await axios
        .get(`http://localhost:5000/user/${user.email}`)
        .then((res) => {
          if (res.status === 200) {
            axios
              .post(`http://localhost:5000/friendRequest`, {
                senderName: user.displayName,
                senderImage: res.data.img,
                senderEmail: user.email,
                senderFriends: res.data.friends,
                receiverEmail: email,
              })
              .then((res) => {
                if (res.status === 200) {
                  toast.success("Friend request sent successfully");
                  setFriendRequestSent(true);
                }
              });
          }
        });
    } else {
      toast.error("You must be logged in to send a friend request");
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/friendRequest/${user.email}/${email}`)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.senderName === user.displayName) {
              setFriendRequestSent(true);
            }
          }
        });
    }
  } , [user, email, friendRequestSent]);

  if (userDataLoading || loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="profile-header flex justify-between items-center bg-[#F0F2F5] p-10 rounded-lg">
        <div className="left-side flex">
          <div className="profile-header-image">
            <img
              className="w-24 h-24 object-cover rounded-full"
              src={userData?.img}
              alt="profile"
            />
          </div>
          <div className="profile-header-info ml-5">
            <div className="profile-header-info-name text-3xl font-semibold">
              {userData?.displayName}
            </div>
            <div className="profile-header-info-email">{userData?.email}</div>
          </div>
        </div>
        <div className="right-side">
          {user?.email === email ? (
            <Link
              className="btn btn-primary text-white px-12 rounded-full"
              to={`/user/${user.email}/edit`}
            >
              Edit Profile
            </Link>
          ) : alreadyFriend ? (
            <div className="text-green-500 text-4xl font-semibold">
              <FaCheckCircle/>
            </div>
          ) : (
            <button
              className="btn btn-primary text-white px-12 rounded-full"
              onClick={() => sendFriendRequest()}
              disabled={friendRequestSent}
            >
              {friendRequestSent
                ? "Friend Request Sent"
                : "Send Friend Request"}
            </button>
          )}
        </div>
      </div>
      <div className="profile-footer">
        <ul className="menu menu-horizontal mt-5">
          <Link className="btn btn-ghost" to={`/user/${email}`}>
            Posts
          </Link>
          <Link className="btn btn-ghost" to={`/user/${email}`}>
            About
          </Link>
          {user?.email === email && (
            <Link className="btn btn-ghost" to={`/user/${email}/requests`}>
              Friend Requests
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileHeader;
