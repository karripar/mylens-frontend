import {
  MediaItem,
  MediaItemWithOwner,
  ProfilePicture,
  UserWithNoSensitiveInfo,
} from 'hybrid-types/DBTypes';
import {fetchData} from '../lib/functions';
import {useEffect, useState} from 'react';
import useUserContext from '../hooks/contextHooks';
import Follows from '../components/Follows';
import Likes from '../components/Likes';
import {MessageCircle} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { useProfilePicture } from '../hooks/apiHooks';

const searchOptions = [
  {value: 'title', label: 'Media by Title'},
  {value: 'description', label: 'Media by Description'},
  {value: 'tags', label: 'Media by Tag name'},
  {value: 'user', label: 'Search for Users'},
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [mediaSearchResults, setMediaSearchResults] = useState<MediaItemWithOwner[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<UserWithNoSensitiveInfo[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // Track whether a search has been performed
  const { user } = useUserContext();
  const navigate = useNavigate();
  const {getProfilePicture} = useProfilePicture();
  const [profilePicture, setProfilePicture] = useState<ProfilePicture>();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setMediaSearchResults([]);
      setUserSearchResults([]);
      setHasSearched(false); // Reset search status when the query is empty
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchCategory]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return;

      try {
        const response = await getProfilePicture(user.user_id);
        setProfilePicture(response);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    fetchProfilePicture();
  }
  , [user]);

  const handleSearch = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log('Search terms:', searchCategory, searchQuery);

      if (searchCategory === 'user') {
        const query = `${import.meta.env.VITE_AUTH_API}/users/search/byusername?username=${encodeURIComponent(searchQuery)}`;
        const response = await fetchData<UserWithNoSensitiveInfo[]>(query, options);
        setUserSearchResults(response);
        setMediaSearchResults([]); // Clear media results
      } else {
        const query = `${import.meta.env.VITE_MEDIA_API}/media/search?search=${encodeURIComponent(searchQuery)}&searchBy=${encodeURIComponent(searchCategory)}`;
        const response = await fetchData<MediaItem[]>(query, options);

        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          response.map(async (item) => {
            const owner = await fetchData<UserWithNoSensitiveInfo>(
              `${import.meta.env.VITE_AUTH_API}/users/${item.user_id}`,
              options
            );
            return { ...item, username: owner.username };
          })
        );

        setMediaSearchResults(mediaWithOwner);
        setUserSearchResults([]); // Clear user results
      }
      setHasSearched(true); // Mark search as completed
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Search</h1>

      {/* Search Category Tabs */}
      <div className="flex justify-center space-x-2 mb-4">
        {searchOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSearchCategory(option.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              searchCategory === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form className="max-w-lg mx-auto" onSubmit={handleSearch}>
        <div className="relative w-full">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder="Search..."
            required
          />
        </div>
      </form>

      {/* Display User Search Results */}
      {hasSearched && userSearchResults.length === 0 && searchCategory === 'user' && (
        <div className="w-full max-w-lg mx-auto text-center my-4">
          <p className="text-gray-400 text-sm">No users found.</p>
        </div>
      )}
      {userSearchResults.length > 0 && (
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-lg font-semibold text-white mt-4">
            User Results
          </h2>
          {userSearchResults.map((userItem) => (
            <div
              key={userItem.user_id}
              className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg my-3 flex items-center justify-between space-x-2 sm:space-x-4 w-full hover:bg-gray-700 transition-all cursor-pointer"
              onClick={() =>
                navigate(
                  user?.username === userItem.username
                    ? '/user'
                    : `/profile/${userItem.username}`,
                )
              }
            >
              {/* Avatar */}
              <img
                src={profilePicture?.filename || 'https://robohash.org/' + userItem.username}
                className="w-10 h-10 min-w-10 rounded-full flex-shrink-0"
              />

              {/* User Details */}
              <div className="flex-1 text-start">
                <p className="text-white font-semibold text-sm sm:text-base">
                  {userItem.username}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {userItem.level_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Media Search Results */}
      {hasSearched && mediaSearchResults.length === 0 && searchCategory !== 'user' && (
        <div className="w-full max-w-lg mx-auto text-center my-4">
          <p className="text-gray-400 text-sm">No media found.</p>
        </div>
      )}
      {mediaSearchResults.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mt-4">
            Media Results
          </h2>
          {mediaSearchResults.map((item) => (
            <article
              key={item.media_id}
              className="flex flex-col w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg mx-auto my-3 space-y-3"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
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
                  src={item.thumbnail || (item.screenshots && item.screenshots[0]) || undefined}
                  alt={item.title}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 px-2">
                <Likes aria-label="like the post" item={item} />
                <MessageCircle
                  aria-label="comment"
                  className="w-6 h-6 text-gray-400 cursor-pointer hover:opacity-85"
                  onClick={() => navigate('/single', {state: {item}})}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default Search;
