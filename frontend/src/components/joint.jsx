import React, { useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import { setWatchHistory } from "../slices/watchHistorySlice";
import {
  setCurrentVideo,
  addToWatchHistory,
} from "../slices/currentVideoSlice";
import { setChannel } from "../slices/followedChannel";

import axios from "axios";

function Joint() {
  console.log("Main nav and sidebar rendered");
  const avatar = useSelector((state) => state.user.currUser.avatar);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inpRef = useRef();

  const [showSideBar, setShowSideBar] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  async function getHistory() {
    let resp = await axios.get("/api/user/getWatchHistory");
    if (resp) {
      console.log(resp.data.data[0].WatchedVideos);
      dispatch(setWatchHistory(resp.data.data[0].WatchedVideos));
    }
  }

  // const [query, setQuery] = useState()
  const [suggestions, setSuggestion] = useState([]);

  const handleInputChange = async (e) => {
    if (e.target.value == "") {
      setSuggestion([]);
    }
    let resp = await axios.get(`/api/video/search/${e.target.value}`);
    setSuggestion(resp?.data.data);
  };

  async function handleClick(suggestion) {
    if (suggestion?.title) {
      console.log("video");
      let resp = await axios.get(`/api/video/playVideo/${suggestion._id}`);
      if (resp) {
        dispatch(setCurrentVideo(resp.data.data));
        dispatch(addToWatchHistory(suggestion._id));
        navigate("/main/wvp");
        setSuggestion([]);
      }
    } else if (suggestion?.username) {
      console.log("channel");
      let resp = await axios.get(`/api/user/getChannel/${suggestion._id}`);
      if (resp) {
        dispatch(setChannel(resp.data.data));
        navigate("/main/followedPage");
        setSuggestion([]);
      }
    }
  }

  const [result, setresult] = useState([]);

  async function navigateToSuggestedVideos() {
    const query = inpRef?.current?.value;
    let resp = await axios.get(`/api/video/searchVideos/${query}`);
    if (resp) {
      setresult(resp.data.data);
      setSuggestion([]);
      setShowSearchBar(false);
      navigate("/main/srvp");
    }
  }
  const handleKeyEnter = (event) => {
    if (event.key === "Enter") {
      navigateToSuggestedVideos();
    }
  };

  return (
    <>
      <section className="fixed top-0 z-50 w-full">
        <nav className="bg-gradient-to-r from-black via-blue-800 to-black w-screen h-16 flex items-center justify-between ">
          {showSearchBar ? (
            <nav className="bg-gradient-to-r from-black via-blue-800 to-black w-screen h-16 flex items-center justify-center space-x-2 sm:hidden">
              <div onClick={() => setShowSearchBar((prev) => !prev)}>
                <img src="/src/assets/back.png" alt="" className="h-8 w-8" />
              </div>
              <div className="w-[80%]  ">
                {/* <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <img
                      src="/src/assets/search.png"
                      alt=""
                      className="h-6 w-6"
                    />
                  </div>
                  <input
                    type="search"
                    ref={inpRef}
                    id="default-search"
                    autoComplete="off"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyEnter}
                    className="block w-full p-4 ps-10 text-sm text-white  rounded-full focus:border-blue-700 bg-black opacity-80 border-slate-700"
                    placeholder="Search . . . "
                    required
                  />
                  <button
                    onClick={navigateToSuggestedVideos}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-4 py-2 "
                  >
                    Search
                  </button>
                </div>
                <ul className="w-[80%] fixed text-sm font-medium right-1/5 top-16 border  rounded-3xl bg-gray-700 border-gray-600 text-white">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleClick(suggestion)}
                      className="w-full px-4 py-2 hover:bg-slate-600 rounded-full border-gray-600 mb-1 "
                    >
                      {suggestion?.title || suggestion?.username}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          ) : (
            <>
              <div className="flex items-center space-x-3 ml-3">
                <button
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-10"
                  onClick={() => setShowSideBar((prev) => !prev)}
                >
                  <img src="/src/assets/menu.png" alt="" className="w-7 h-7" />
                </button>
                <div className="flex items-center justify-center">
                  <img
                    src="/src/assets/logoCH.png"
                    alt=""
                    className="w-9 h-9"
                  />
                  <p className="font-extrabold fontStyle greet text-2xl text-white">
                    ClipHub
                  </p>
                </div>
              </div>
              <div className="w-1/3 hidden sm:block ">
                {/* <label htmlFor="default-search" className=" text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <img
                      src="/src/assets/search.png"
                      alt=""
                      className="h-6 w-6"
                    />
                  </div>
                  <input
                    type="search"
                    ref={inpRef}
                    id="default-search"
                    autoComplete="off"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyEnter}
                    className="block w-full p-4 ps-10 text-sm text-white  rounded-full focus:border-blue-700 bg-black opacity-80 border-slate-700"
                    placeholder="Search . . . "
                  />
                  <button
                    onClick={navigateToSuggestedVideos}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 "
                  >
                    Search
                  </button>
                </div>
                <ul className="w-1/3 fixed text-sm font-medium right-1/5 top-16 border  rounded-xl bg-gray-700 border-gray-600 text-white ">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleClick(suggestion)}
                      className="w-full px-4 py-2 hover:bg-slate-600 rounded-lg border-gray-600 "
                    >
                      {suggestion?.title || suggestion?.username}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center items-center space-x-3 mr-6">
                <button type="button" className="relative inline-flex ">
                  <div onClick={() => setShowSearchBar((prev) => !prev)}>
                    <img
                      src="/src/assets/search.png"
                      alt=""
                      className="h-8 w-8 mr-2 sm:hidden"
                    />
                  </div>
                </button>
                <div className="shadow-white-ligh">
                  <img
                    src={`${avatar ? avatar : "/src/assets/defaultAvatar.png"}`}
                    alt=""
                    className="h-10 w-10 object-cover rounded-full"
                  />
                </div>
              </div>
            </>
          )}
        </nav>
      </section>

      <aside
        className={`fixed top-0  left-0 z-40 w-56 h-screen pt-20 transition-transform ${
          showSideBar ? "translate-x-0" : "-translate-x-full"
        } bg-gray-950 border-r border-slate-900 border-x-2  sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to=""
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img src="/src/assets/home.png" alt="" className="h-6 w-6 " />
                <span className="ms-3 text-white">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="account"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/src/assets/channel.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="ms-3 text-white">Your Channel</span>
              </Link>
            </li>
            <li>
              <Link
                to="subscription"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950 "
              >
                <img
                  src="/src/assets/subscriptions.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  Subscriptions
                </span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-yellow-500 rounded-full">
                  Pro
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="PrivatePlaylists"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/src/assets/playlist.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  Playlists
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="watchHistory"
                onClick={getHistory}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/src/assets/history.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  History
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="settings"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/src/assets/settings.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  Account Settings
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="chathub"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/src/assets/chathub.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  ChatHub
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <Outlet context={result}></Outlet>
    </>
  );
}

export default React.memo(Joint);
