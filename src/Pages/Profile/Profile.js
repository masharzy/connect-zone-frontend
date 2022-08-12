import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import auth from "../../firebase.init";
import Posts from "../Home/Posts";
import Loading from "../Shared/Loading/Loading";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    setUserDataLoading(true);
    axios.get(`https://connectzone.herokuapp.com/user/${email}`).then((res) => {
      setUserData(res.data);
      setUserDataLoading(false);
    });
  }, [email, user]);

  if (userDataLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white">
      <div className="profile px-40 py-5">
        <ProfileHeader/>
        <div className="profile-body mt-10">
          <div className="profile-body-info bg-[#F0F2F5] p-10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              {userData.displayName.split(" ")[0]}'s Posts
            </h3>
            <hr />
          </div>
        </div>
        <div className="posts mt-5">
          <Posts url={`https://connectzone.herokuapp.com/posts/${email}`} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
