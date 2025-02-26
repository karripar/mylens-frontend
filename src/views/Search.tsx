import { MediaItem, MediaItemWithOwner, UserWithNoPassword } from "hybrid-types/DBTypes";
import { fetchData } from "../lib/functions";
import { useState } from "react";
import useUserContext from "../hooks/contextHooks";
import Follows from "../components/Follows";
import Likes from "../components/Likes";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [searchResults, setSearchResults] = useState<MediaItemWithOwner[]>([]);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const options = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log('Search terms: ',searchCategory, searchQuery);
      const query = `${import.meta.env.VITE_MEDIA_API}/media/search?search=${encodeURIComponent(searchQuery)}&searchBy=${encodeURIComponent(searchCategory)}`;
      console.log('Query: ', query);
      const response = await fetchData<MediaItem[]>(
        query,
        options,
      );
      console.log(response);
      const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
        response.map(async (item) => {
          const owner = await fetchData<UserWithNoPassword>(
            import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
            options,
          );

          const mediaItem: MediaItemWithOwner = {
            ...item,
            username: owner.username,
          };
          return mediaItem;
        }),
      );
      setSearchResults(mediaWithOwner);

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <h1>Search</h1>
      <form className="max-w-lg mx-auto" onSubmit={handleSearch}>
        <div className="flex">
          {/* Dropdown for search category */}
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            <option value="title">Title</option>
            <option value="description">Description</option>
            <option value="tags">Tags</option>
          </select>

          <div className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              placeholder="Search media..."
              required
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              🔍
            </button>
          </div>
        </div>
      </form>

      {/* Display search results */}
      <div>
      {searchResults.map((item) => (
        <article key={item.media_id} className="flex flex-col w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg mx-auto my-3 space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="text-left">
              <p className="text-white font-semibold">{item.username}</p>
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
              onClick={() => navigate('/single', { state: { item } })}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              src={item.filename || (item.screenshots && item.screenshots[0]) || undefined}
              alt={item.title}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-items-start space-x-3 w-full px-2">
            <Likes aria-label="like the post" item={item} />
            <MessageCircle
              aria-label="comment"
              className="w-6 h-6 text-gray-400 cursor-pointer hover:opacity-85"
              onClick={() => navigate('/single', { state: { item } })}
            />
          </div>

          {/* Caption */}
          <div className="text-white text-sm px-2 text-left bg-gray-900 p-2 rounded-md">
            <h4 className="font-semibold my-0.5">{item.title}</h4>
            <p>{item.description}</p>
          </div>

          {/* Admin Actions */}
          {(user?.user_id === item.user_id || user?.level_name === 'Admin') && (
            <div className="flex gap-2 pt-2">
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
        </article>
      ))}
    </div>
    </>
  );
};

export default Search;
