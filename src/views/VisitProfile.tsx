import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {UserWithNoPassword} from 'hybrid-types/DBTypes';
import {fetchData} from '../lib/functions';
import {useFollow, useMedia} from '../hooks/apiHooks';
import {useNavigate} from 'react-router-dom';
import Follows from '../components/Follows';
import useUserContext from '../hooks/contextHooks';
import {ArrowLeft} from 'lucide-react';

const VisitProfile = () => {
  const {username} = useParams<{username: string}>();
  const [visitedUser, setVisitedUser] = useState<UserWithNoPassword | null>(
    null,
  );
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const {user} = useUserContext();

  const {getFollowedUsers, getFollowers} = useFollow();

  const {mediaArray} = useMedia('', username);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;

      const response: UserWithNoPassword = await fetchData(
        import.meta.env.VITE_AUTH_API + '/users/byusername/' + username,
      );

      if (!response) return;

      setVisitedUser(response);
    };

    const fetchFollowData = async () => {
      try {
        const userFollows = await getFollowedUsers('', username);
        const userFollowers = await getFollowers('', username);

        console.log('Follows: ', userFollows);
        console.log('Followers: ', userFollowers);
        setFollowerCount(userFollowers.length);
        setFollowingCount(userFollows.length);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchFollowData();

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {visitedUser ? (
        <>
          <button
            className="flex justify-start gap-2 text-gray-300 mb-4 hover:text-white cursor-pointer "
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Go Back</span>
          </button>
          <div className="flex flex-col items-center justify-center min-h-2/3 p-6">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center space-y-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt={visitedUser.username}
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                />
              </div>

              {/* Username */}
              <h2 className="text-3xl font-bold text-gray-800">
                {visitedUser.username}
              </h2>

              {/* User Role */}
              <p className="text-gray-600 text-lg">{visitedUser.bio}</p>
              <p className="text-gray-600 text-lg">{visitedUser.level_name}</p>

              {/* Media / Posts / Follow stats */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Posts</p>
                  <p className="font-semibold text-xl">{mediaArray.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-semibold text-xl">{followerCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Following</p>
                  <p className="font-semibold text-xl">{followingCount}</p>
                </div>
              </div>

              {/* Follow Button */}
              <div>
                {user && user.user_id !== visitedUser.user_id && (
                  <Follows userId={visitedUser.user_id} />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center min-h-1/2 bg-gray-900 p-4 my-20">
            <h2 className="text-2xl font-semibold text-gray-400 text-center mb-6">
              {visitedUser?.username}'s uploads
            </h2>
            <div className="flex flex-wrap items-start justify-center">
              {mediaArray.map((item) => (
                <div key={item.media_id} className="m-2">
                  <img
                    onClick={() => navigate('/single', {state: {item}})}
                    className="w-64 h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-101"
                    src={
                      item.filename ||
                      (item.screenshots && item.screenshots[0]) ||
                      undefined
                    }
                    alt={item.title}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-white text-2xl text-center">User not found</div>
      )}
    </>
  );
};

export default VisitProfile;
