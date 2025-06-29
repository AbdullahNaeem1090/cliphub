import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function SideBar({showSideBar}) {

  return (
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
                <img src="/icon/home.png" alt="" className="h-6 w-6 " />
                <span className="ms-3 text-white">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="account"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/icon/channel.png"
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
                  src="/icon/subscriptions.png"
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
                  src="/icon/playlist.png"
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
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gradient-to-r from-gray-950 via-blue-800 to-gray-950"
              >
                <img
                  src="/icon/history.png"
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
                  src="/icon/settings.png"
                  alt=""
                  className="h-6 w-6 "
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-white">
                  Account Settings
                </span>
              </Link>
            </li>
           
          </ul>
        </div>
      </aside>
  )
}

SideBar.propTypes = {
    showSideBar: PropTypes.bool, 
  };

export default SideBar