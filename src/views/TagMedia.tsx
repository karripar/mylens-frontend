import {useParams, useNavigate} from 'react-router';
import {useMedia, useProfilePicture} from '../hooks/apiHooks';
import {useEffect, useState} from 'react';
import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import useUserContext from '../hooks/contextHooks';
import Follows from '../components/Follows';
import Likes from '../components/Likes';
import {MessageCircle} from 'lucide-react';

const TagMedia = () => {
  const tagName = useParams().tag as string;
  const {getMediaByTagName} = useMedia();
  const [media, setMedia] = useState<MediaItemWithOwner[]>([]);
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {getProfilePicture} = useProfilePicture();
  const [profilePictures, setProfilePictures] = useState<
    Record<number, string | null>
  >({});

  useEffect(() => {
    const fetchMedia = async () => {
      const media = await getMediaByTagName(tagName);
      setMedia(media);

      // Fetch profile pictures for each user_id in media
      const uniqueUserIds = [...new Set(media.map((item) => item.user_id))];
      const profilePics: Record<number, string | null> = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const profileData = await getProfilePicture(userId);
          profilePics[userId] = profileData ? profileData.filename : null;
        }),
      );

      setProfilePictures(profilePics);
    };

    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagName]);

  return (
    <>
      {media.length === 0 ? (
        <h1 className="text-white text-2xl text-center mt-10">
          No media found with tag {tagName}
        </h1>
      ) : (
        <div>
          {media.map((item) => (
            <article
              key={item.media_id}
              className="flex flex-col w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg mx-auto my-10 space-y-3"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 w-full">
                <img
                  className="w-10 h-10 bg-gray-700 rounded-full"
                  src={
                    profilePictures[item.user_id] ||
                    'https://robohash.org/' + item.username
                  }
                  alt={item.username}
                />
                <div className="text-left">
                  <p className="text-white font-semibold">
                    {user && user.user_id === item.user_id ? (
                      <>
                        {item.username}{' '}
                        <span className="text-blue-400 text-xs">- You</span>
                      </>
                    ) : (
                      item.username
                    )}
                  </p>
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
                    item.thumbnail ||
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
                  className="w-6 h-6 text-gray-400 cursor-pointer hover:opacity-85"
                  onClick={() => navigate('/single', {state: {item}})}
                />
              </div>

              {/* Caption */}
              <div className="text-white text-sm px-2 text-left bg-gray-900 p-2 rounded-md">
                <h4 className="font-semibold my-0.5">{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default TagMedia;
