import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useEffect, useReducer} from 'react';
import {useSavedMedia} from '../hooks/apiHooks';
import {Save} from 'lucide-react';

type SaveState = {
  count: number;
  isSaved: boolean;
};

type SaveAction =
  | {type: 'setSaveCount'; count: number}
  | {type: 'toggleSave'; isSaved: boolean};

const saveInitialState: SaveState = {
  count: 0,
  isSaved: false,
};

const saveReducer = (state: SaveState, action: SaveAction): SaveState => {
  switch (action.type) {
    case 'setSaveCount':
      return {...state, count: action.count};
    case 'toggleSave':
      return {...state, isSaved: action.isSaved};
    default:
      return state;
  }
};

const Saves = ({item}: {item: MediaItemWithOwner}) => {
  const [saveState, saveDispatch] = useReducer(saveReducer, saveInitialState);
  const {postSavedMedia, removeSavedMedia, getIfSaved, getSaveCountByMediaId} =
    useSavedMedia();

  useEffect(() => {
    const fetchSaveData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !item) return;

      try {
        const isSaved = await getIfSaved(item.media_id, token);
        saveDispatch({type: 'toggleSave', isSaved});

        const count = await getSaveCountByMediaId(item.media_id);
        saveDispatch({type: 'setSaveCount', count}); // Now count is a number!
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchSaveData();
  }, [item]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !item) return;

      if (saveState.isSaved) {
        await removeSavedMedia(item.media_id, token);
        saveDispatch({type: 'toggleSave', isSaved: false});
        saveDispatch({type: 'setSaveCount', count: saveState.count - 1});
      } else {
        await postSavedMedia(item.media_id, token);
        saveDispatch({type: 'toggleSave', isSaved: true});
        saveDispatch({type: 'setSaveCount', count: saveState.count + 1});
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleSave}>
        <Save
          className={`w-6 h-6 cursor-pointer ${saveState.isSaved ? 'text-blue-500' : 'text-gray-400'}`}
        />
      </button>
      <p className="text-gray-100">{saveState.count}</p>
    </div>
  );
};

export default Saves;
