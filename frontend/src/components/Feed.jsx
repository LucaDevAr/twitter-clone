/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import instance from "../utils/axiosConfig.js";
import { CreatePost } from "./CreatePost.jsx";
import Tweet from "./Tweet.jsx";
import FeedHeader from "./FeedHeader.jsx";

export const Feed = ({ onClick, fetch, onCommentClick }) => {
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("ForYou");

  const fetchTweets = useCallback(async () => {
    try {
      const response = await instance.get(
        `http://localhost:8080/api/tweets/${
          activeTab === "ForYou" ? "" : "following"
        }`
      );

      if (activeTab === "Following") {
        const followingTweets = response.data.tweets.map((post) => ({
          ...post.tweet,
          type: post.type,
          rtUser: post.username,
        }));

        setTweets(followingTweets);
      } else {
        setTweets(response.data.tweets);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets, activeTab, fetch]);

  const handleTweetDelete = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
  };

  return (
    <div className="w-[600px] min-h-screen border-gray-200 border pt-14 border-t-0">
      <FeedHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <CreatePost />
      {tweets.length > 0 &&
        tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            type={tweet.type}
            rtUser={tweet.rtUser}
            onClick={onClick}
            onTweetDelete={handleTweetDelete}
            onCommentClick={() => onCommentClick(tweet)}
          />
        ))}
    </div>
  );
};
