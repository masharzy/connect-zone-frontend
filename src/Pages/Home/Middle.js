import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Posts from "./Posts";

const Middle = () => {
  const openFileDialog = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_this) => {
      let files = Array.from(input.files);
      console.log(files);
    };
    input.click();
  };
  const [user] = useAuthState(auth);
  return (
    <div className="middle p-5 m-auto rounded-lg mt-5 max-w-3xl w-full">
      {/* Post form */}
      <div className="post-form bg-white flex justify-center rounded-xl p-10 shadow-sm">
        <img
          className="rounded-full w-12"
          src={user.photoURL}
          alt=""
        />
        <label
          for="my-modal"
          className="cursor-pointer pl-5 relative bg-gray-200 rounded-full w-full ml-4 modal-button"
        >
          <span className="absolute top-1/4">What are you thinking, John?</span>
        </label>
      </div>

      {/* <Posts/> */}
      <Posts/>

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
          <textarea
            className="textarea w-full placeholder:text-2xl"
            placeholder="What are you thinking, John?"
            rows="8"
          ></textarea>
          <div className="addExtra border rounded-lg flex justify-between items-center py-4 px-3">
            <p>Add to your post</p>
            <img
              onClick={openFileDialog}
              className="w-6 cursor-pointer"
              src="https://i.ibb.co/N3GgfHY/image.png"
              alt=""
            />
          </div>
          <button className="btn btn-primary w-full text-white">Post</button>
        </div>
      </div>
</div>
    </div>
  );
};

export default Middle;