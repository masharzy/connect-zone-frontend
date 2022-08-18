import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
import GroupPost from "./GroupPost";

const GroupPosts = ({isPosted}) => {
  const { groupSlug } = useParams();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    setPostsLoading(true);
    fetch(`https://connectzone.herokuapp.com/group/${groupSlug}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setPostsLoading(false);
      });
  }, [isPosted, groupSlug]);

  if (postsLoading) {
    return (
      <div>
        <div className="mt-5">
          <SkeletonTheme baseColor="#cdd3d4" highlightColor="#f5f7f7">
            <Skeleton
              className="h-12 mr-4"
              width="7%"
              borderRadius="50%"
              inline={true}
            />
            <div className="inline">
              <Skeleton width="50%" />
            </div>
          </SkeletonTheme>
          <SkeletonTheme baseColor="#cdd3d4" highlightColor="#f5f7f7">
            <Skeleton />
            <Skeleton />
            <Skeleton className="h-60" />
            <Skeleton />
            <Skeleton />
          </SkeletonTheme>
        </div>
        <div className="mt-5">
          <SkeletonTheme baseColor="#cdd3d4" highlightColor="#f5f7f7">
            <Skeleton
              className="h-12 mr-4"
              width="7%"
              borderRadius="50%"
              inline={true}
            />
            <div className="inline">
              <Skeleton width="50%" />
            </div>
          </SkeletonTheme>
          <SkeletonTheme baseColor="#cdd3d4" highlightColor="#f5f7f7">
            <Skeleton />
            <Skeleton />
            <Skeleton className="h-60" />
            <Skeleton />
            <Skeleton />
          </SkeletonTheme>
        </div>
      </div>
    );
  }

  return (
    <div className="posts flex flex-col-reverse">
      {posts ? (
        posts.map((post) => <GroupPost key={post._id} post={post} />)
      ) : (
        <h1>No posts</h1>
      )}
    </div>
  );
};

export default GroupPosts;
