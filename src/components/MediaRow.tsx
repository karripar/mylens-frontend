import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Link, useNavigate} from 'react-router-dom';
import useUserContext from '../hooks/contextHooks';

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
    <article className="flex flex-col items-center h-full w-full bg-gray-950 p-6 rounded-lg shadow-md max-w-lg mx-auto space-y-4 mb-3">
      {/* Image Wrapper */}
      <div className="w-full h-60 max-w-[320px] overflow-hidden rounded-lg shadow-md group">
        <img
          onClick={() => navigate('/single', {state: {item}})}
          className="h-full w-full object-cover rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
          src={
            item.filename ||
            (item.screenshots && item.screenshots[0]) ||
            undefined
          }
          alt={item.title}
        />
      </div>

      {/* Info Section */}
      <div className="w-full text-center">
        <h2 className="text-lg font-semibold text-white">{item.title}</h2>
        <p className="text-sm text-gray-400">
          📅 {new Date(item.created_at).toLocaleString('fi-FI')}
        </p>
        <p className="text-sm text-gray-400">👤 {item.username}</p>
      </div>

      {/* Actions */}
      <div className="w-1/2 flex flex-col gap-3">
        <Link
          to={'/single'}
          state={{item}}
          className="w-full bg-amber-500 text-gray-900 font-semibold py-2 rounded-md text-center hover:bg-amber-600 transition-all duration-300"
        >
          View
        </Link>

        {(user?.user_id === item.user_id || user?.level_name === 'Admin') && (
          <div className="flex w-full gap-2">
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
      </div>
    </article>
  );
};

export default MediaRow;
