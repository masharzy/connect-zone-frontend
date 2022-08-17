import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";

const LeftSide = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUserDataLoading(true);
      axios
        .get(`http://localhost:5000/user/${user.email}`)
        .then((res) => {
          setUserData(res.data);
          setUserDataLoading(false);
        });
    }
  }, [user]);

  if (loading || userDataLoading) {
    return (
      <div className="left-side pt-5 bg-white pl-4 w-2/6">
        <div className="fixed w-1/6">
          <Link
            to="/user/friends"
            className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200"
          >
            <img
              className="rounded-full w-11"
              src="https://i.ibb.co/ZM1d7R5/people.png"
              alt=""
            />
            <h4 className="ml-2 font-semibold">Connected Peoples</h4>
          </Link>
          <Link
            to="/groups"
            className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200"
          >
            <img
              className="rounded-full w-11"
              src="https://i.ibb.co/mG5yS48/crowd.png"
              alt=""
            />
            <h4 className="ml-2 font-semibold">Groups</h4>
          </Link>
          <div className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200">
            <img
              className="w-11"
              src="https://i.ibb.co/yXzvwbR/save-instagram.png"
              alt=""
            />
            <h4 className="ml-2 font-semibold">Saved</h4>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="left-side pt-5 bg-white pl-4 w-2/6 lg:block hidden">
      <div className="fixed w-1/6">
        <Link
          to={`/user/${user.email}`}
          className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200"
        >
          <img
            className="w-10 h-10 object-cover rounded-full"
            src={userData.img}
            alt=""
          />
          <h4 className="ml-2 font-semibold">{user.displayName}</h4>
        </Link>
        <Link
          to="/user/friends"
          className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200"
        >
          <img
            className="rounded-full w-11"
            src="https://i.ibb.co/ZM1d7R5/people.png"
            alt=""
          />
          <h4 className="ml-2 font-semibold">Connected Peoples</h4>
        </Link>
        <Link
          to="/groups"
          className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200"
        >
          <img
            className="rounded-full w-11"
            src="https://i.ibb.co/mG5yS48/crowd.png"
            alt=""
          />
          <h4 className="ml-2 font-semibold">Groups</h4>
        </Link>
        <div className="child flex items-center hover:bg-slate-200 cursor-pointer p-2 rounded-lg transition-all duration-200">
          <img
            className="w-11"
            src="https://i.ibb.co/yXzvwbR/save-instagram.png"
            alt=""
          />
          <h4 className="ml-2 font-semibold">Saved</h4>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
