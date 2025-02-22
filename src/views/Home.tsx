import {useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import { useMedia } from '../hooks/apiHooks';
import { MediaItemWithOwner } from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import SingleView from '../components/SingleView';

const Home = () => {
  const [activeFeed, setActiveFeed] = useState<'normal' | 'following'>(
    'normal',
  );
  const {user} = useUserContext();
  const [selectedItem, setSelectedItem] = useState<
    MediaItemWithOwner | undefined
  >(undefined);
  const {mediaArray} = useMedia();

  return (
    <>
      <div className="flex flex-col items-center p-4 h-4/5">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeFeed === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveFeed('normal')}
          >
            For You
          </button>

          {user && (
            <button
              className={`px-4 py-2 rounded-lg ${
                activeFeed === 'following'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setActiveFeed('following')}
            >
              Following
            </button>
          )}
        </div>

        <div className="w-full max-w-lg h-full p-2 rounded-md">
          {activeFeed === 'normal' ? (
            <>
              {selectedItem && (
                <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />
              )}
              <section>
                {mediaArray.map((item) => (
                  <div key={item.media_id}>
                    <MediaRow item={item} setSelectedItem={setSelectedItem} />
                  </div>
                ))}
              </section>
            </>
          ) : (
            <>
              {user ? (
                <div>Following Feed</div>
              ) : (
                <div>Please log in to see the Following feed</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
