// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   addToWatchHistory,
//   setCurrentVideo,
// } from "../slices/currentVideoSlice";
// import { setPlaylistVideos } from "../slices/playistVideosSlice";
// import { deletePlaylist } from "../slices/playlistSlice";
// import { useEffect, useMemo, useState } from "react";

// function MyPlaylist() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { _public, _hidden } = useSelector((state) => state.playlist);

//   const playlists = useMemo(() => [..._public, ..._hidden], [_public, _hidden]);

//   async function navigateToVideoPage(index) {
//     let videoId = playlists[index].videos[0];
//     try {
//       console.log("po");
//       let resp = await axios.get(`/api/video/playVideo/${videoId}`);
//       let resp1 = await axios.get(
//         `/api/playlist/playlistVideos/${playlists[index]._id}`
//       );
//       console.log("do");
//       dispatch(setCurrentVideo(resp.data.data));
//       dispatch(addToWatchHistory(resp.data.data._id));
//       dispatch(setPlaylistVideos(resp1.data.data));
//       navigate("../../playlist");
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   async function DeletePlaylist(id) {
//     try {
//       let resp = await axios.delete(`/api/playlist/deletePlaylist/${id}`);
//       console.log(resp);
//       if (resp) {
//         console.log("dne");
//         dispatch(deletePlaylist({ id: id, category: "public" }));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const [playListThumbnail, setPlaylistThumbnail] = useState({});

//   async function getPlaylistThumbnail(playlistId) {
//     console.log("first");
//     try {
//       let resp = await axios.get(`/api/playlist/getPLThumbnail/${playlistId}`);
//       if (resp.data.success) {
        
//         return resp.data.data;
//       }
//     } catch (error) {
//       console.log(error);
//       return "";
//     }
//   }

//   useEffect(() => {
//     if (!playlists.length) return;

//     playlists.forEach((playlist) => {
//       getPlaylistThumbnail(playlist._id).then((data) => {
//         setPlaylistThumbnail((prev) => ({
//           ...prev,
//           [playlist._id]: data,
//         }));
//       });
//     });
//   }, [playlists]);

//   if (playlists.length < 1) {
//     return (
//       <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">
//         No Playlists Yet
//       </p>
//     );
//   }

//   return (
//     <>
      
//       <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 lg:ml-3">
//         {playlists?.map((playlist, index) => (
//           <div
//             key={index}
//             onClick={() => navigateToVideoPage(index)}
//             className="cursor-pointer rounded-xl overflow-hidden shadow-md transform hover:scale-[1.001] transition duration-200 group"
//           >
//             <div className="relative w-full h-56">
//               <div className="absolute top-1 left-2 w-full h-full bg-gray-500 rounded-md opacity-40 z-0" />
//               <img
//                 className="relative w-full h-full object-cover rounded-md z-10"
//                 src={
//                   playListThumbnail[playlist?._id] ||
//                   "/src/assets/defaultPlaylist.png"
//                 }
//                 alt=""
//               />
//             </div>

//             <div className="bg-transparent p-4 flex justify-between items-start">
//               <div>
//                 <h5 className="text-xl font-semibold text-white mb-1">
//                   {playlist?.title}
//                 </h5>
//                 <p className="text-sm text-gray-400">
//                   Type: {playlist?.type || "Standard"}
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   Videos: {playlist?.videos.length}
//                 </p>
//               </div>

//               <img
//                 src="/src/assets/delete.png"
//                 className="h-6 w-6 hover:scale-110 transition-transform duration-150"
//                 alt="delete"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   DeletePlaylist(playlist._id);
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//         <div
//           onClick={() => console.log("hello")}
//           className="flex flex-col justify-center items-center h-56 rounded-xl  text-white hover:bg-slate-600 hover:bg-opacity-5 transition cursor-pointer"
//         >
//           <img src="/src/assets/add.png" alt="Add" className="h-10 w-10 mb-2" />
//           <p className="text-sm font-semibold">Add Playlist</p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default MyPlaylist;
