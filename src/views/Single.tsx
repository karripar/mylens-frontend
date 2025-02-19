import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import { formatFileSize } from '../lib/functions';


const Single = () => {
  const {state} = useLocation();
  const item: MediaItemWithOwner = state.item;
  const navigate: NavigateFunction = useNavigate();
  return (
    <>
    <div className="flex flex-col items-center justify-center p-2 m-auto w-3/4">
      <h2>{item.title}</h2>
      <div className="border-2 border-stone-600 rounded-lg overflow-hidden flex max-h-150 max-w-150">
      {item.media_type.includes('video') ? (
        <video controls src={item.filename} crossOrigin='anonymous' />
      ) : (
        <img src={item.filename} alt={item.title} />
      )}
      </div>
      <div className="w-3/4 flex flex-col items-center justify-center p-2 m-auto text-center bg-white mt-1 rounded-md">
      <p>Owner: {item.username}</p>
      <p>{item.description}</p>
      <p>Created at: {new Date(item.created_at).toLocaleString('fi-FI')}</p>
      <p>Filesize: {formatFileSize(item.filesize)}</p>
      <div className="flex content-center justify-center">
        <button className=" hover:scale-105 transition-all ease-in-out bg-[linear-gradient(90deg,_#ff5f6d,_#ffc371)] cursor-pointer px-5 py-2 rounded-md text-amber-50 my-4" onClick={() => navigate(-1)}>Go Back</button>
      </div>
      </div>
    </div>
    </>
  );
};

export default Single;

