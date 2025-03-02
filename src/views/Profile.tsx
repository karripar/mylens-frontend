import {useEffect, useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import {Link, useNavigate} from 'react-router-dom';
import {useFollow, useProfilePicture, useUser} from '../hooks/apiHooks';
import {useMedia} from '../hooks/apiHooks';
import {useForm} from '../hooks/formHooks';
import { ProfilePicture } from 'hybrid-types/DBTypes';

const Profile = () => {
  const {user} = useUserContext();

  //console.log('User after login:', user);
  const navigate = useNavigate();
  const {getFollowedUsers, getFollowers} = useFollow();
  const {putUserBioAndUsername, getUsernameAvailable} = useUser();
  const {getProfilePicture} = useProfilePicture();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(null);

  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initValues = {
    username: '',
    bio: '',
  };

  const token = localStorage.getItem('token') || '';
  const {mediaArray} = useMedia(token);

  useEffect(() => {
    const fetchFollowData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const userFollows = await getFollowedUsers(token);
        const userFollowers = await getFollowers(token);

        setFollowerCount(userFollowers.length);
        setFollowingCount(userFollows.length);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchFollowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Refetch when the user context changes

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return;

      try {
        const response = await getProfilePicture(user.user_id);
        setProfilePicture(response);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchProfilePicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Refetch when the user context changes

  const doUpdateProfile = async (event?: React.SyntheticEvent) => {
    if (event) event.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';

      const content = {
        username: inputs.username,
        bio: inputs.bio,
      };

      const response = await putUserBioAndUsername(content, token);
      console.log('Profile updated:', response);
      setIsEditing(false);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doUpdateProfile,
    initValues,
  );

  useEffect(() => {
    const main = async () => {
      try {
        if (inputs.username.length > 2) {
          const response = await getUsernameAvailable(inputs.username);
          setUsernameAvailable(response.available ?? true);
        } else {
          setUsernameAvailable(true);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.username]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-2/3  p-6">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={profilePicture?.filename || 'https://robohash.org/' + user?.username}
              alt=""
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            <div className="text-white absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-400">
              Edit
            </div>
          </div>

          {/* Username */}
          <h2 className="text-3xl font-bold text-gray-800">{user?.username}</h2>

          {/* User Role */}
          <p className="text-gray-600 text-lg">{user?.level_name}</p>
          <p className="text-gray-500 text-sm">{user?.bio}</p>
          {/* Media or Posts Section */}
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

          {/* Action buttons */}
          <div className="w-full mt-4 flex justify-center space-x-4">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition duration-200"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <Link to="/logout">
              <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition duration-200">
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit profile form */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500 ${
                  usernameAvailable ? 'border-green-500' : 'border-red-500'
                }`}
                placeholder="Username"
                autoComplete="off"
                minLength={3}
                maxLength={50}
                value={inputs.username}
                onChange={handleInputChange}
              />
              <textarea
                name="bio"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500 min-h-30 max-h-100"
                minLength={3}
                maxLength={300}
                placeholder="Bio"
                value={user?.bio || inputs.bio}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-400 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition duration-200"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center min-h-1/2 bg-gray-900 p-4 my-20">
        <h2 className="text-2xl font-semibold text-gray-400 text-center mb-6">
          Your uploads
        </h2>
        <div className="flex flex-wrap items-start justify-center">
          {mediaArray.map((item) => (
            <div key={item.media_id} className="m-2">
              <img
                onClick={() => navigate('/single', {state: {item}})}
                className="w-64 h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-101"
                src={
                  item.thumbnail ||
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
  );
};

export default Profile;
