
import { Link, Outlet, useParams } from "react-router-dom";

function FollowedChannel() {
 
    const { channelName, avatar ,email,subscribers} = useParams()

  return (
    <div className="p-4 sm:ml-56">
      <div className="lg:px-2  rounded-lg mt-14 lg:flex">
        <div className="lg:max-w-sm rounded-lg lg:mr-4 shadow bg-gray-800 bg-opacity-50">
          <img
            className="rounded-t-lg object-cover max-h-[300px] w-full"
            src={avatar|| "/src/assets/defaultAvatar.png"}
            alt=""
          />

          <div className="p-5">
            <h5 className="mb-1 text-2xl font-bold tracking-tight text-white">
              {channelName}
            </h5>
            <p className="mb-1 font-bolde text-lg text-gray-400">
              {email}
            </p>
            <p className="mb-3 font-bolde text-md text-gray-400">
              {subscribers} Subscribers
            </p>
            <Link
              to="videos"
              className="px-3 py-2 text-sm font-bold text-center text-white hover:border hover:border-white   bg-white bg-opacity-10 rounded-full mx-1"
            >
              Videos
            </Link>
            <Link
              to="playlists"
              className="px-3 py-2 text-sm font-bold text-center text-white hover:border hover:border-white   bg-white bg-opacity-10 rounded-full mx-1 "
            >
              Playlists
            </Link>
          </div>
        </div>

        <Outlet></Outlet>
      </div>
    </div>
  );
}
export default FollowedChannel;
