import { useState, useRef } from "react";
import { useAuth } from "../protection/useAuth";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { setCurrentVideo } from "../slices/currentVideoSlice";
import { useDispatch } from "react-redux";
import { myAxios } from "../utils/axiosInstance";

function Header({ setShowSideBar, setResult }) {

  const inpRef = useRef();
  const [suggestions, setSuggestion] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const { currUser } = useAuth();
  let { avatar } = currUser;

  async function navigateToSuggestedVideos() {
    const query = inpRef?.current?.value;
    let resp = await myAxios.get(`/api/video/searchVideos/${query}`);
    if (resp) {
      setResult(resp.data.data);
      setSuggestion([]);
      setShowSearchBar(false);
      navigate("/main/srvp");
    }
  }

  const handleInputChange = async (e) => {
    if (e.target.value == "") {
      setSuggestion([]);
    }
    let resp = await myAxios.get(`/api/video/search/${e.target.value}`);
    setSuggestion(resp?.data.data);
  };

  const handleKeyEnter = (event) => {
    if (event.key === "Enter") {
      navigateToSuggestedVideos();
    }
  };

  async function handleClick(suggestion) {
    if (suggestion?.title) {
      let resp = await myAxios.get(`/api/video/getPlayingVideoData/${suggestion._id}/${currUser._id}`);
      if (resp.data.success) {
        dispatch(setCurrentVideo(resp.data.data))
        navigate("/main/wvp");
        setSuggestion([]);
      }
    } else if (suggestion?.username) {
      let resp = await myAxios.get(`/api/user/getChannel/${suggestion._id}`);
      if (resp.data.success) {
        let Channel=resp.data?.data[0]
        const avatar = Channel.avatar ||  "/icon/defaultAvatar.png"
        navigate(
          `/main/followedPage/${encodeURIComponent(Channel._id)}/${encodeURIComponent(Channel.username)}/${encodeURIComponent(Channel.email)}/${encodeURIComponent(avatar)}/${encodeURIComponent(Channel.subscribersCount)}`
        );
        setSuggestion([]);
      }
    }
  }

  return (
    <section className="fixed top-0 z-50 w-full">
      <nav className="bg-gradient-to-r from-black via-blue-800 to-black w-screen h-16 flex items-center justify-between ">
        {showSearchBar ? (
          <nav className="bg-gradient-to-r from-black via-blue-800 to-black w-screen h-16 flex items-center justify-center space-x-2 sm:hidden">
            <div onClick={() => setShowSearchBar((prev) => !prev)}>
              <img src="/icon/back.png" alt="" className="h-8 w-8" />
            </div>
            <div className="w-[80%]  ">
              {/* <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <img
                    src="/icon/search.png"
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
              <ul className="w-[80%] fixed text-sm font-medium right-1/5 top-16 border  rounded-3xl bg-black border-gray-600 text-white">
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
                <img src="/icon/menu.png" alt="" className="w-7 h-7" />
              </button>
              <div className="flex items-center justify-center">
                <img src="/icon/logoCH.png" alt="" className="w-9 h-9" />
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
                    src="/icon/search.png"
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
                  placeholder="Search"
                />
                <button
                  onClick={navigateToSuggestedVideos}
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 "
                >
                  Search
                </button>
              </div>
              <ul className="w-1/3 fixed text-sm font-medium right-1/5 top-16   rounded-xl bg-black  text-white ">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleClick(suggestion)}
                    className="w-full px-4 py-2 hover:bg-slate-800 rounded-lg border-gray-600 "
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
                    src="/icon/search.png"
                    alt=""
                    className="h-8 w-8 mr-2 sm:hidden"
                  />
                </div>
              </button>
              <div className="shadow-white-ligh">
                <img
                  src={`${avatar ? avatar : "/icon/defaultAvatar.png"}`}
                  alt=""
                  className="h-10 w-10 object-cover rounded-full"
                />
              </div>
            </div>
          </>
        )}
      </nav>
    </section>
  );
}

Header.propTypes = {
    setShowSideBar: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
  };

export default Header;
