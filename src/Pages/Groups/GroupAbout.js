import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Shared/Loading/Loading";
import GroupHeader from "./GroupHeader";

const GroupAbout = () => {
  const { groupSlug } = useParams();
  const [groupInfo, setGroupInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://connectzone.herokuapp.com/groupBySlug/${groupSlug}`).then((res) => {
      setGroupInfo(res.data);
      setLoading(false);
    });
  }, [groupSlug]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white">
    <GroupHeader groupSlug={groupSlug}/>
      <div className="about w-1/3 mx-auto  bg-[#F0F2F5] px-10 my-5 py-5 rounded-lg leading-10">
        <h2 className="text-lg fon-bold">About this group</h2>
        <hr className="mb-2"/>
        <h4>
          <span className="font-bold">Group Name:</span> {groupInfo.groupName}{" "}
        </h4>
        <p>
          <span className="font-bold">Group Description:</span>{" "}
          {groupInfo.groupDescription}{" "}
        </p>
        <p>
          <span className="font-bold">Group Members:</span>{" "}
          {groupInfo?.groupMembers?.length}{" "}
        </p>
      </div>
    </div>
  );
};

export default GroupAbout;
