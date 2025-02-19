import { useState } from "react"

const Home = () => {
  const [activeFeed, setActiveFeed] = useState<"normal" | "following">("normal")

  return (
    <>
    <div className="flex flex-col items-center p-4 h-4/5">
      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded-lg ${activeFeed === "normal" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveFeed("normal")}
        >
          For You
        </button>
        <button className={`px-4 py-2 rounded-lg ${activeFeed === "following" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveFeed("following")}
        >
          Following
        </button>
      </div>
      <div className="w-full max-w-lg h-full p-4 border rounded-lg">
        {activeFeed === "normal" ? (
          <>
          <div>Normal Feed</div>
          </>
        ) : (
          <>
          <div>Following Feed</div>
          </>
        )
      }
      </div>

    </div>
    </>
  )
}

export default Home
