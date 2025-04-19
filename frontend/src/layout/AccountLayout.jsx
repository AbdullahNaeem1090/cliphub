import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../protection/useAuth";

// import axios from "axios";
function AccountLayout() {
  console.log("Account Rendered");

  const {currUser} =useAuth()

  return (
    <div className="p-3 sm:ml-56  mt-14 rounded-lg ">
      {/* logo part */}
      <div className="flex flex-col items-center pb-3 max-w-md mx-auto border-b border-gray-500 mt-5 ">
        <img
          className="w-36 h-36 object-cover mb-3 rounded-full antialiased border-gray-700 bg-gradient-to-r from-green-400 via-blue-700 to-pink-600 p-0.5 border-2"
          src={currUser?.avatar || "/src/assets/defaultAvatar.png"}
          alt="pic"
        />
        <h5 className="mb-1 text-xl font-medium text-white">{currUser.email}</h5>
        <span className="text-sm text-gray-400">Subscribers:100k</span>
        <div className="px-4 py-1 mt-3 text-white font-semibold bg-gradient-to-r from-blue-700 to-purple-600 rounded-3xl">
          {currUser.username}
        </div>
      </div>

      {/* nav Links */}
      <div className="text-sm font-medium text-center text-gray-300 flex justify-center pt-2 md:mb-3">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <NavLink
              to="myVideos"
              className={({ isActive }) =>
                isActive
                  ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600"
                  : "inline-block p-4 hover:text-gray-600"
              }
            >
              My Videos
            </NavLink>
          </li>
          <li className="me-2">
            <NavLink
              to="myPlaylist"
              className={({ isActive }) =>
                isActive
                  ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600"
                  : "inline-block p-4 hover:text-gray-600"
              }
            >
              playLists
            </NavLink>
          </li>
          <li className="me-2">
            <NavLink
              to="uploadVideo"
              className={({ isActive }) =>
                isActive
                  ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600"
                  : "inline-block p-4 hover:text-gray-600"
              }
            >
              Create Video
            </NavLink>
          </li>
        </ul>
      </div>

      <Outlet></Outlet>
    </div>
  );
}

export default AccountLayout;
