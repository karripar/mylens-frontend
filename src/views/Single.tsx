import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import Comments from '../components/Comments';
import Likes from '../components/Likes';
import Follows from '../components/Follows';
import {ArrowLeft} from 'lucide-react';
import useUserContext from '../hooks/contextHooks';
import {useMediaTags} from '../hooks/useMediaTags';

const Single = () => {
  const {state} = useLocation();
  const item: MediaItemWithOwner = state?.item;
  const navigate: NavigateFunction = useNavigate();
  const {user} = useUserContext();
  const tags = useMediaTags(item.media_id);

  if (!item) {
    return <div className="text-white">Item not found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-6">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 self-start"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Go Back</span>
      </button>

      {/* Main Content Container */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {item.title}
        </h2>

        {/* Media Display */}
        <div className="relative w-full aspect-video border-2 border-stone-600 rounded-lg overflow-hidden shadow-md">
          {item.media_type.includes('video') ? (
            <video
              controls
              src={item.filename}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.filename}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 cursor-pointer transition"
                onClick={() => navigate(`/tag/${tag}`)}
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No tags</span>
          )}
        </div>

        {/* User Info & Actions */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md text-center text-white">
          {user && user.user_id !== item.user_id && (
            <Follows userId={item.user_id} />
          )}

          <p
            className="text-lg font-semibold mt-2 hover:text-blue-400 cursor-default"
            onClick={() =>
              navigate(
                user?.username === item.username
                  ? '/user'
                  : `/profile/${item.username}`,
              )
            }
          >
            Owner: {item.username}
          </p>
          <p className="text-sm text-gray-300 mt-1">{item.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            Created at: {new Date(item.created_at).toLocaleString('fi-FI')}
          </p>

          {/* Like & Other Actions */}
          <div className="flex justify-center gap-4 mt-4">
            <Likes item={item} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md">
          <Comments item={item} />
        </div>
      </div>
    </div>
  );
};

export default Single;
