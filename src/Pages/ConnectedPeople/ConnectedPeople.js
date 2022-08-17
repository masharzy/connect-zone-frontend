import axios from "axios";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";
import LeftSide from "../Home/LeftSide";
import RightSide from "../Home/RightSide";

const ConnectedPeople = () => {
  const [friends, setFriends] = React.useState([]);
  const [cLoader, setCLoading] = React.useState(true);
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    setCLoading(true);
    axios
      .get(
        `http://localhost:5000/user/${user.email}/friends`
      )
      .then((res) => {
        setFriends(res.data);
        setCLoading(false);
      });
  }, [user]);
  if (loading || cLoader) {
    return (
      <div>
        <div className="flex gap-4">
          <LeftSide />
          <div className="middle p-5 m-auto rounded-lg mt-5 max-w-3xl w-full h-screen">
            <div
              style={{ borderTopColor: "transparent" }}
              className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin mx-auto"
            ></div>
          </div>
          <RightSide />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex gap-4">
        <LeftSide />
        <div className="middle p-5 m-auto rounded-lg mt-5 max-w-3xl w-full h-screen">
          {friends.map((friend) => {
            return (
              <Link
                to={`/user/${friend.email}`}
                className="card my-3 cursor-pointer bg-white mx-auto"
              >
                <div className="friend-info flex py-5 px-10">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={friend.img}
                    alt=""
                  />
                  <h5 className="card-title ml-2">{friend.displayName}</h5>
                </div>
              </Link>
            );
          })}
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default ConnectedPeople;
