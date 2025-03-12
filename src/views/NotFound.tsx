import {useNavigate} from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-amber-500 drop-shadow-lg animate-pulse">
          404
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div
          onClick={() => navigate('/')}
          className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-lg font-semibold text-black transition duration-300 hover:bg-amber-600 hover:shadow-lg cursor-default"
        >
          Go Home
        </div>
      </div>
    </div>
  );
};

export default NotFound;
