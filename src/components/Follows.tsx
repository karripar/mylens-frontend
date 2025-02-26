import { Follow } from "hybrid-types/DBTypes";
import { useEffect, useReducer } from "react";
import { useFollow } from "../hooks/apiHooks";

type FollowState = {
  count: number;
  userFollow: Follow | null;
};

type FollowAction = {
  type: "setFollowCount" | "follow";
  follow?: Follow | null;
  count?: number;
};

const followInitialState: FollowState = {
  count: 0,
  userFollow: null,
};

const followReducer = (state: FollowState, action: FollowAction): FollowState => {
  switch (action.type) {
    case "setFollowCount":
      return { ...state, count: action.count ?? 0 };
    case "follow":
      return { ...state, userFollow: action.follow ?? null };
    default:
      return state;
  }
};

const Follows = ({ userId }: { userId: number }) => {
  const [followState, followDispatch] = useReducer(followReducer, followInitialState);
  const { getFollowedUsers, postFollow, removeFollow } = useFollow();

  const fetchFollowData = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    try {
      const userFollows = await getFollowedUsers(token);
      console.log(userFollows);
      const userFollow = userFollows.length > 0 ? userFollows[0] : null;
      followDispatch({ type: "follow", follow: userFollow });
    } catch (error) {
      followDispatch({ type: "follow", follow: null });
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchFollowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) return;

      if (followState.userFollow) {
        // Remove follow
        await removeFollow(followState.userFollow.follow_id, token);

        followDispatch({ type: "follow", follow: null });
        followDispatch({ type: "setFollowCount", count: followState.count - 1 });
      } else {
        // Add follow
        const response = await postFollow(userId, token);
        const newFollow = {
          follow_id: response.follow_id,
          follower_id: response.follower_id,
          followed_id: response.followed_id,
        }
        followDispatch({ type: "follow", follow: newFollow });
        followDispatch({ type: "setFollowCount", count: followState.count + 1 });
      }
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      fetchFollowData();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleFollow}
        className={`py-1 px-4 rounded-lg transition duration-200 ${
          followState.userFollow ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {followState.userFollow ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default Follows;
