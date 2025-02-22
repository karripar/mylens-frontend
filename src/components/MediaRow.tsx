import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useNavigate} from 'react-router-dom';
import useUserContext from '../hooks/contextHooks';
import { MessageCircle } from 'lucide-react';
import Likes from './Likes';


type MediaRowProps = {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

const MediaRow = (props: MediaRowProps) => {
  const {item} = props;
  const {user} = useUserContext();
  const navigate = useNavigate();
  console.log(item.thumbnail);
  return (
    <article className="flex flex-col w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg mx-auto my-3 space-y-3">
      {/* User Info */}
      <div className="flex items-center space-x-3 w-full">
        <div className="w-10 h-10 bg-gray-700 rounded-full" />
        <div className="text-left">
          <p className="text-white font-semibold">{item.username}</p>
          <p className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleString("fi-FI")}
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-90 bg-gray-800 overflow-hidden rounded-md">
        <img
          onClick={() => navigate("/single", { state: { item } })}
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
        <Likes item={item} />
        <MessageCircle className="w-6 h-6 text-gray-400" />
      </div>

      {/* Caption */}
      <div className="text-white text-sm px-2 text-left">
        <h4 className="font-semibold my-0.5 ">{item.title}</h4>
        <p>{item.description}</p>
      </div>

      {/* Admin Actions */}
      {(user?.user_id === item.user_id || user?.level_name === "Admin") && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => console.log("Modify clicked", item.media_id)}
            className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Modify
          </button>
          <button
            onClick={() => console.log("Delete clicked", item.media_id)}
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
