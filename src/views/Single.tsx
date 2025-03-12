import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {NavigateFunction, useLocation, useNavigate} from 'react-router';
import Comments from '../components/Comments';
import Likes from '../components/Likes';
import {ArrowLeft} from 'lucide-react';
import useUserContext from '../hooks/contextHooks';
import {useMediaTags} from '../hooks/useMediaTags';
import Saves from '../components/Saves';
import {useMedia} from '../hooks/apiHooks';
import {useState} from 'react';
import EditMediaModal from '../components/EditModal';

const Single = () => {
  const {state} = useLocation();
  const item: MediaItemWithOwner = state?.item;
  const navigate: NavigateFunction = useNavigate();
  const {user} = useUserContext();
  const tags = useMediaTags(item.media_id);
  const {deleteMedia} = useMedia();
  const [showEditModal, setShowEditModal] = useState(false);
  const [mediaData, setMediaData] = useState({
    title: item.title,
    description: item.description,
  });

  const handleSaveEdit = (updatedItem: {
    title: string;
    description: string;
  }) => {
    setMediaData(updatedItem);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  if (!item) {
    return <div className="text-white">Item not found</div>;
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const deleteResponse = await deleteMedia(item.media_id, token);
      console.log(deleteResponse);

      setDeleteMessage('Item deleted successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error(error);
      setDeleteMessage('Error deleting item. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

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
      <div className="w-full max-w-2xl flex-col bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {item.title}
        </h2>

        {/* Media Display */}
        <div className="relative max-w-3/4 border-2 flex m-auto border-stone-600 rounded-lg overflow-hidden shadow-md">
          {item.media_type.includes('video') ? (
            <video
              controlsList='nodownload'
              onContextMenu={(e) => e.preventDefault()}
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
          <p
            className="text-lg font-semibold mt-2 hover:text-blue-400 break-all cursor-default"
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
          {user && (
            <>
              <div className="flex justify-center gap-4 mt-4">
                <Likes item={item} />
              </div>

              <div className="mt-6 p-4 bg-gray-700 flex justify-center rounded-lg shadow-md">
                <Saves item={item} />
              </div>
            </>
          )}

          {/* Delete Button */}
          {user && user.user_id === item.user_id && (
            <div className="mt-6 p-4 bg-gray-700 flex gap-10 justify-center rounded-lg">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <EditMediaModal
            item={{
              ...item,
              title: mediaData.title,
              description: mediaData.description,
            }}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveEdit}
          />
        )}

        {/* Comments Section */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md">
          <Comments item={item} />
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white">
            {!deleteMessage ? (
              <>
                <p className="text-lg mb-4">
                  Are you sure you want to delete this item?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="text-lg mb-4">{deleteMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Single;
