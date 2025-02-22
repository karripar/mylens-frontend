import { useMedia } from "../hooks/apiHooks";
import useUserContext from "../hooks/contextHooks"
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const {user} = useUserContext();
  const {mediaArray} = useMedia();
  const navigate = useNavigate();

  const userMediaArray = mediaArray.filter((item) => item.user_id === user?.user_id);
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
    <div>
      <h2 className="text-2xl font-semibold text-gray-400 text-center mb-6">Your uploads</h2>
      <div className="flex flex-wrap justify-center">
        {userMediaArray.map((item) => (
          <div key={item.media_id} className="m-2">
            <img
              onClick={() => navigate("/single", { state: { item } })}
              className="w-64 h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
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
