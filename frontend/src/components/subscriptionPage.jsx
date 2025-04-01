// import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { removeSubscribedChannel } from "../slices/subscriptionSlice";
import { useNavigate } from "react-router-dom";
import { setChannel } from "../slices/followedChannel";

function Subscription() {
  const dispatch = useDispatch();
  const subscribedChannels = useSelector(
    (state) => state.subscribe.subscribedChannels
  );
  console.log(subscribedChannels);
  const currUser = useSelector((state) => state.user.currUser);
  const navigate = useNavigate();

  async function unSubscribe(id) {
    let resp = await axios.post("/api/subscription/unSubscribe", {
      subscriber: currUser._id,
      subscribedTo: id,
    });
    console.log(resp);
    if (resp.data.data.deletedCount == 1) {
      dispatch(removeSubscribedChannel(id));
    }
  }

  async function navigateToSUbscribedChannel(id) {
    try {
      let resp = await axios.get(`/api/user/getChannel/${id}`);
      if (resp) {
        dispatch(setChannel(resp.data.data));
        navigate("../followedPage");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (subscribedChannels.length < 1) {
    return (
      <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
        <div className="p-3 rounded-lg mt-14 overflow-clip">
          <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56 ">
            No Channel Subscribed Yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:ml-56">
      <div className="p-2 rounded-lg mt-14">
        <div className="w-full  p-4 rounded-lg  sm:p-8 ">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-3xl font-bold leading-none text-white">
              Subscribed Channels
            </h5>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-700">
              {subscribedChannels.map((card) => (
                <li
                  key={1}
                  className="py-3 sm:py-4 hover:bg-white  hover:bg-opacity-5 rounded-md px-2 cursor-pointer"
                  onClick={() =>
                    navigateToSUbscribedChannel(card.ContentCreators[0]._id)
                  }
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={
                          card.ContentCreators[0].avatar ||
                          "/src/assets/defaultAvatar.png"
                        }
                        alt="image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-lg font-medium truncate text-white">
                        {card.ContentCreators[0].username}
                      </p>
                      <p className="text-sm  truncate text-gray-300">
                        {card.ContentCreators[0].email}
                      </p>
                    </div>
                    <button
                      className="text-white bg-red-600 rounded-full p-2 font-bold hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        unSubscribe(card.ContentCreators[0]._id);
                      }}
                    >
                      UnSubscribe
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Subscription;
