import axios from "axios";
import React, { useEffect, useState } from "react";

const Comments = ({ isCommented, _id }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    axios
      .get(`https://connectzone.herokuapp.com/comments/${_id}`)
      .then((res) => setComments(res.data));
  }, [isCommented, _id]);
  return (
    <div className="comments">
      {comments?.map((comment, index) => (
        <div className="flex mt-2" key={index}>
          <div className="commenter-img">
            <img
              className="w-12 rounded-full"
              src={comment.commentUserImage}
              alt=""
            />
          </div>
          <div className="comment-info bg-gray-200 rounded-2xl py-2 px-3 ml-2">
            <div className="commenter-name">
              <h5 className="font-semibold link-hover cursor-pointer">
                {comment.commentUserName}
              </h5>
            </div>
            <div className="comment-text">
              <p>{comment.commentText}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
