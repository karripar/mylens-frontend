import { Like, MediaItemWithOwner } from "hybrid-types/DBTypes";
import { useEffect, useReducer } from "react";
import { useLike } from "../hooks/apiHooks";
import { Heart } from "lucide-react";

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
}

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      return {...state, userLike: action.like ?? null};
    default:
      return state;
  }
}

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {postLike, removeLike, getCountByMediaId, getUserLike} = useLike();

  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!token || !item) return;

    try {
      const userLike = await getUserLike(item.media_id, token);
      console.log('userLike', getLikes);
      likeDispatch({type: 'like', like: userLike})
    } catch (error) {
      likeDispatch({type: 'like', like: null});
      console.error((error as Error).message);
    }
  }

  const getLikeCount = async () => {
    try {
      const likes = await getCountByMediaId(item.media_id);
      if (!likes) return;
      likeDispatch({type: 'setLikeCount', count: likes.length});
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  useEffect(() => {
    getLikes();
    getLikeCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !item) return;

      if (likeState.userLike) {
        await removeLike(likeState.userLike.like_id, token);
        likeDispatch({type: 'like', like: null});
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
      } else {
        const newLike = await postLike(item.media_id, token);
        console.log('newLike', newLike);
        getLikes();
        getLikeCount();
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

return (
  <>
  <p className="text-gray-100">Likes: {likeState.count}</p>
  <button onClick={handleLike}>
    <Heart
      className={`w-6 h-6 text-gray-400 bg-none cursor-pointer ${
        likeState.userLike ? 'text-red-500' : ''
      }`}
    />
  </button>
  </>
)
}

export default Likes;
