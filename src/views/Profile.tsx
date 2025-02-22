import { useEffect, useState } from "react";
import useUserContext from "../hooks/contextHooks"
import { useNavigate } from "react-router-dom";
import { MediaItemWithOwner, UserWithNoPassword } from "hybrid-types/DBTypes";
import { fetchData } from "../lib/functions";


const Profile = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();
  const [userMedia, setUserMedia] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    const fetchUserMedia = async () => {
      if (!user) return; // If no user is logged in, don't fetch media

      const token = localStorage.getItem('token');
      if (!token) return; // Make sure the user is authenticated

      try {
        // Fetch media specific to the logged-in user
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        // Fetch user media from the server (assuming /media/byuser is the endpoint)
        const userMedia = await fetchData<MediaItemWithOwner[]>(
          import.meta.env.VITE_MEDIA_API + '/media/bytoken',
          options
        );

        // Fetch the owner info for each piece of media
        const userMediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          userMedia.map(async (item: MediaItemWithOwner) => {
            const owner = await fetchData<UserWithNoPassword>(
              import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
              options
            );

            return { ...item, username: owner.username };
          })
        );

        // Set the media to state
        setUserMedia(userMediaWithOwner);
      } catch (error) {
        console.error('Error fetching user media:', (error as Error).message);
      }
    };

    fetchUserMedia();
  }, [user]); // Refetch when the user context changes


  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-1/2 bg-gray-900 p-4 my-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Welcome</h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={user?.username}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={user?.level_name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col justify-center min-h-1/2 bg-gray-900 p-4 my-20">
      <h2 className="text-2xl font-semibold text-gray-400 text-center mb-6">Your uploads</h2>
      <div className="flex flex-wrap items-start justify-center">
        {userMedia.map((item) => (
          <div key={item.media_id} className="m-2">
            <img
              onClick={() => navigate("/single", { state: { item } })}
              className="w-64 h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-101"
              src={item.filename || (item.screenshots && item.screenshots[0]) || undefined}
              alt={item.title}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default Profile
