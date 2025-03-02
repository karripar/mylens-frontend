import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import Comments from '../components/Comments';
import Likes from '../components/Likes';
import Follows from '../components/Follows';
import {ArrowLeft} from 'lucide-react';
import useUserContext from '../hooks/contextHooks';
import { useMediaTags } from '../hooks/useMediaTags';

const Single = () => {
  const {state} = useLocation();
  const item: MediaItemWithOwner = state?.item;
  const navigate: NavigateFunction = useNavigate();
  const {user} = useUserContext();
  const tags = useMediaTags(item.media_id);

  if (!item) {
    return <div className="text-white">Item not found</div>
  }

  return (
    <div>
      <button
        className="flex justify-start gap-2 text-gray-300 mb-4 hover:text-white cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Go Back</span>
      </button>
      <div className="flex flex-col items-center justify-center p-4 m-auto w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-white mb-4">{item.title}</h2>

        <div className="border-2 border-stone-600 rounded-lg overflow-hidden flex max-h-150 max-w-2xl shadow-lg">
          {item.media_type.includes('video') ? (
            <video
              controls
              src={item.filename}
              crossOrigin="anonymous"
              className="w-full h-auto"
            />
          ) : (
            <img
              src={item.filename}
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-1 my-3">
        {tags.length > 0 &&
          tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-600 cursor-pointer"  
              onClick={() => navigate(`/tag/${tag}`)}
            >
              {tag}
            </span>
          )) || <span className="text-xs text-gray-400">No tags</span>}
      </div>

        <div className="w-full max-w-2xl flex flex-col items-center justify-center p-4 bg-gray-800 text-white mt-4 rounded-md shadow-md text-center">
        {user && user.user_id !== item.user_id && <Follows userId={item.user_id} />}

          <p className="text-lg font-medium">Owner: {item.username}</p>
          <p className="text-sm text-gray-300">{item.description}</p>
          <p className="text-xs text-gray-400">
            Created at: {new Date(item.created_at).toLocaleString('fi-FI')}
          </p>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Likes item={item} />
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center justify-center p-4 bg-gray-800 text-white mt-4 rounded-md shadow-md">
          <Comments item={item} />
        </div>
      </div>
    </div>
  );
};

export default Single;
