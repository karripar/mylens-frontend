import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useState, useMemo} from 'react';
import {useMedia} from '../hooks/apiHooks';

const MIN_TITLE_LENGTH = 3;
const MIN_DESC_LENGTH = 0;

const EditMediaModal = ({
  item,
  onClose,
  onSave,
}: {
  item: MediaItemWithOwner;
  onClose: () => void;
  onSave: (updatedItem: {title: string; description: string}) => void;
}) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {modifyMedia} = useMedia();

  const isValid = useMemo(() => {
    if (title.trim().length < MIN_TITLE_LENGTH) return false;
    if ((description || '').trim().length < MIN_DESC_LENGTH) return false;
    return true;
  }, [title, description]);

  const handleSave = async () => {
    if (!isValid) {
      setError(
        `Title must be at least ${MIN_TITLE_LENGTH} characters and description at least ${MIN_DESC_LENGTH}.`,
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const inputs = {
        title: title.trim(),
        description: (description || '').trim(),
      };

      const response = await modifyMedia(item.media_id, inputs, token);

      if (!response) {
        throw new Error('Failed to update media details.');
      }

      onSave({title, description: description || ''});
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white w-96">
        <h3 className="text-xl font-bold mb-4">Edit Media</h3>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <span className="text-sm text-gray-400">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-600 rounded bg-gray-700 text-white"
          placeholder="Title"
          maxLength={128}
        />
        <p className="text-sm text-gray-400">
          {title.length < MIN_TITLE_LENGTH
            ? `Minimum ${MIN_TITLE_LENGTH} characters required.`
            : ''}
        </p>
        <span className="text-sm text-gray-400">Description (optional)</span>
        <textarea
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-600 rounded bg-gray-700 text-white min-h-40 max-h-100"
          placeholder="Description"
          maxLength={1000}
        />
        <p className="text-sm text-gray-400">
          {description && description.length < MIN_DESC_LENGTH
            ? `Minimum ${MIN_DESC_LENGTH} characters required.`
            : ''}
        </p>
        <div className="flex justify-between mt-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded text-white ${
              loading || !isValid
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading || !isValid}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMediaModal;
