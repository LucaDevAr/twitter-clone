import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftSidebar } from "../components/LeftSidebar.jsx";
import { RightSidebar } from "../components/RightSidebar.jsx";
import { Feed } from "../components/Feed.jsx";
import Loader from "../components/Loader.jsx";
import PostModal from "../components/PostModal.jsx";
import CommentModal from "../components/CommentModal.jsx";
import { useAuth } from "../utils/AuthContext.jsx";

export const Home = () => {
  const { user, loading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleTweetClick = (tweet) => {
    navigate(`/post/${tweet._id}`);
  };

  const handleCommentClick = (tweet) => {
    setSelectedTweet(tweet);
    setShowCommentModal(true);
  };

  const handleTweetCreated = () => {
    setShowPostModal(false);
    setFetching(!fetching);
  };

  const handleCommentCreated = () => {
    setShowCommentModal(false);
    setFetching(!fetching);
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="relative w-full flex">
      <LeftSidebar onPostButtonClick={() => setShowPostModal(true)} />
      <div className="w-[990px] flex mr-[40px] gap-[35px]">
        <Feed
          onClick={handleTweetClick}
          onCommentClick={handleCommentClick}
          fetch={fetching}
        />
        <RightSidebar />
      </div>
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onTweetCreated={handleTweetCreated}
      />
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        tweet={selectedTweet}
        onCommentCreated={handleCommentCreated}
      />
    </div>
  );
};
