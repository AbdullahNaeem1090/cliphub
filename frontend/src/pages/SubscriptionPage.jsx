// import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../protection/useAuth";

function Subscription() {
  const { currUser } = useAuth();
  console.log(currUser._id);

  async function getSubscribedChannels() {
    let resp = await axios.get(
      `/api/subscription/subscribedChannels/${currUser._id}`
    );
    return resp.data.data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribedChannels"],
    queryFn: getSubscribedChannels,
    refetchOnWindowFocus: false,
  });
  console.log(data);

  const navigate = useNavigate();

  async function unSubscribe(id) {
      await axios.post("/api/subscription/unSubscribe", {
      subscriber: currUser._id,
      subscribedTo: id,
    });
  }

  async function navigateToSUbscribedChannel(id) {
    try {
        let obj = data.find((obj) => obj.Channel._id === id);
        let Channel = obj?.Channel;
        const avatar = Channel.avatar ||  "/src/assets/defaultAvatar.png";
        navigate(
          `../followedPage/${encodeURIComponent(Channel._id)}/${encodeURIComponent(Channel.username)}/${encodeURIComponent(Channel.email)}/${encodeURIComponent(avatar)}/${encodeURIComponent(Channel.subscribersCount)}`
        );
    } catch (error) {
      console.log(error);
    }
  }

  if (error) {
    return (
      <div className="p-3 md:p-4 sm:ml-56 mt-14">
        <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56 ">
          Error While Fetching
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-3 md:p-4 sm:ml-56 mt-14">
        <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56 ">
          Laoding
        </p>
      </div>
    );
  }

  if (!data || data.length < 1) {
    return (
      <div className="p-3 md:p-4 sm:ml-56 mt-14">
        <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56 ">
          No Channel Subscribed Yet
        </p>
      </div>
    );
  }

  return (
    <div className="p-1 sm:ml-56">
      <div className="p-5 rounded-lg mt-14">
        <h5 className="text-3xl font-bold leading-none text-white mt-3">
          Subscribed Channels
        </h5>
      </div>

      <ul role="list" className="divide-y divide-gray-700 px-5 py-2">
        {data.map((card) => (
          <li
            key={card._id}
            className="py-3 sm:py-4 hover:bg-white  hover:bg-opacity-5 rounded-md px-2 cursor-pointer"
            onClick={() => navigateToSUbscribedChannel(card.Channel._id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={card.Channel.avatar || "/src/assets/defaultAvatar.png"}
                  alt="image"
                />
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <p className="text-lg font-medium truncate text-white">
                  {card.Channel.username}
                </p>
                <p className="text-sm  truncate text-gray-300">
                  {card.Channel.email}
                </p>
              </div>
              <button
                className="text-white bg-red-600 rounded-full p-2 font-bold hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  unSubscribe(card.Channel._id);
                }}
              >
                UnSubscribe
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Subscription;
