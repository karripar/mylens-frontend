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

  return (
    <article className="flex flex-col items-center text-center h-full w-full bg-stone-900 p-6 rounded-2xl shadow-xl max-w-md mx-auto transition-transform duration-300 hover:scale-105">
      {/* Image Wrapper */}
      <div className="w-full h-60 max-w-[320px] rounded-xl overflow-hidden shadow-lg group hover:scale-105 transition-transform duration-300">
        <img
          onClick={() => navigate('/single', {state: {item}})}
          className="h-full w-full object-cover rounded-xl cursor-pointer group-hover:opacity-80 transition-opacity duration-300"
          src={
            item.thumbnail ||
            (item.screenshots && item.screenshots[0]) ||
            undefined
          }
          alt={item.title}
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col items-center justify-center mt-4 w-full p-4 rounded-lg bg-stone-800 shadow-lg">
        <p className="text-xl font-semibold text-amber-400 break-words mb-3">
          {item.title}
        </p>

        {/* Metadata */}
        <div className="w-full bg-stone-700 p-3 rounded-lg text-center space-y-1">
          <p className="text-amber-100 text-xs opacity-80">
            📅 {new Date(item.created_at).toLocaleString('fi-FI')}
          </p>
          <p className="text-amber-100 text-xs font-medium">
            👤 {item.username}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-4 w-full mt-5">
        <Link
          to={'/single'}
          state={{item}}
          className="w-full bg-amber-500 text-stone-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300"
        >
          View Details
        </Link>

        {(user?.user_id === item.user_id || user?.level_name === 'Admin') && (
          <>
            <button
              onClick={() => console.log('Modify clicked', item.media_id)}
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Modify
            </button>
            <button
              onClick={() => console.log('Delete clicked', item.media_id)}
              className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default MediaRow;
