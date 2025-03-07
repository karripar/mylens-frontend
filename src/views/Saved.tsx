import { useNavigate } from "react-router-dom";
import { useSavedMedia } from "../hooks/apiHooks";
import { useEffect } from "react";

const Saved = () => {
  const { savedMediaArray } = useSavedMedia();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }
  , [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <h2 className="text-2xl font-semibold mb-4">Saved items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {savedMediaArray && savedMediaArray.length > 0 ? (
          savedMediaArray.map((item) => (
            <div
              key={item.media_id}
              className="w-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={item.thumbnail || (item.screenshots && item.screenshots[0]) || undefined}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => navigate('/single', { state: { item } })}
              />
            </div>
          ))
        ) : (
          <p>No saved items</p>
        )}
      </div>
    </div>
  );
};

export default Saved;
