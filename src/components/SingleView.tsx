import { MediaItemWithProfilePicture } from "hybrid-types/DBTypes";

const SingleView = (props: {
  item: MediaItemWithProfilePicture | undefined;
  setSelectedItem: (item: MediaItemWithProfilePicture | undefined) => void;
}) => {
  const { item, setSelectedItem } = props;

  return (
    <>
      {item && (
        <div className="flex flex-col items-center justify-center w-full bg-stone-900 p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
          {/* User and Title */}
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-amber-400">{item.username}</p>
            <p className="text-xl font-bold text-white mt-2">{item.title}</p>
          </div>

          {/* Media Content */}
          <div className="w-full max-w-3xl mb-6">
            {item.media_type.includes('video') ? (
              <video
                controls
                src={item.filename}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <img
                src={item.filename}
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            )}
          </div>

          {/* Description */}
          <p className="text-white text-sm md:text-base mb-6 text-center max-w-prose">{item.description}</p>

          {/* Close Button */}
          <div className="flex justify-center w-full">
            <button
              onClick={() => setSelectedItem(undefined)}
              className="px-6 py-3 bg-amber-500 text-stone-900 font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
};

export default SingleView;
