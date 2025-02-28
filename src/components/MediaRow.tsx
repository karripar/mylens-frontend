import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useNavigate} from 'react-router-dom';
import useUserContext from '../hooks/contextHooks';
import {MessageCircle} from 'lucide-react';
import Likes from './Likes';
import Follows from './Follows';
import { useMediaTags } from '../hooks/useMediaTags';

type MediaRowProps = {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

const MediaRow = (props: MediaRowProps) => {
  const {item} = props;
  const {user} = useUserContext();
  const navigate = useNavigate();
  const tags = useMediaTags(item.media_id);
  console.log(item.thumbnail);


  return (
    <article className="flex flex-col w-full max-w-lg bg-gray-800 p-3 rounded-lg shadow-lg mx-auto my-3 space-y-3">
      {/* User Info */}
      <div className="flex items-center space-x-3 w-full">
        <img
          className="w-10 h-10 rounded-full cursor-pointer object-cover"
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt={item.username}
          onClick={() =>
            navigate(
              user?.username === item.username
                ? '/user'
                : `/profile/${item.username}`,
            )
          }
        />
        <div
          className="text-left cursor-pointer"
          onClick={() =>
            navigate(
              user?.username === item.username
                ? '/user'
                : `/profile/${item.username}`,
            )
          }
        >
          <p className="text-white font-semibold hover:text-blue-300">{item.username}</p>
          <p className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleString('fi-FI')}
          </p>
        </div>
        <div className="ml-auto">
          {user && user.user_id !== item.user_id && (
            <Follows userId={item.user_id} />
          )}
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-90 bg-gray-800 overflow-hidden rounded-md">
        <img
          onClick={() => navigate('/single', {state: {item}})}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          src={
            item.filename ||
            (item.screenshots && item.screenshots[0]) ||
            undefined
          }
          alt={item.title}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-items-start space-x-3 w-full px-2">
        <Likes aria-label="like the post" item={item} />
        <MessageCircle
          aria-label="comment"
          className="w-6 h-6 text-gray-400 cursor-pointer hover:opacity-85 "
          onClick={() => navigate('/single', {state: {item}})}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {tags.length > 0 &&
          tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-gray-600"
              onClick={() => navigate(`/tag/${tag}`)}
            >
              {tag}
            </span>
          )) || <span className="text-xs text-gray-400">No tags</span>}
      </div>

      {/* Caption */}
      <div className="text-white text-sm px-2 text-left bg-gray-900 p-2 rounded-md">
        <h4 className="font-semibold my-0.5 ">{item.title}</h4>
        <p>{item.description}</p>
      </div>

      {/* Admin Actions */}
      {(user?.user_id === item.user_id || user?.level_name === 'Admin') && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => console.log('Modify clicked', item.media_id)}
            className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Modify
          </button>
          <button
            onClick={() => console.log('Delete clicked', item.media_id)}
            className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition-all duration-300"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default MediaRow;
