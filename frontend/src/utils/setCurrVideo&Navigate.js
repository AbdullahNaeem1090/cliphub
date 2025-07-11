
import { setCurrentVideo } from "../slices/currentVideoSlice";
import { setPlaylistData } from "../slices/playlistSlice";
import { myAxios } from "./axiosInstance";



export async function navigateToVideoPage(videoId,CurrUserId,dispatch,navigate) {
    try {
      let resp = await myAxios.get(`/api/video/getPlayingVideoData/${videoId}/${CurrUserId}`);
      dispatch(setCurrentVideo(resp.data.data));
      navigate("./wvp");
    } catch (error) {
      console.log(error)
    }
  }

 export async function getUserPlaylists(dispatch,currUser){
    try {
      let resp=await myAxios.get(`/api/playlist/getPlaylists/${currUser}`)
      if(resp.data.success){
        let data=resp.data.data
        let _private=data.filter((playlist) => playlist._id === "private")[0]?.docs || []
        let _public=data.filter((playlist) => playlist._id === "public")[0]?.docs || []
        let _hidden= data.filter((playlist) => playlist._id === "hidden")[0]?.docs || []
        let obj={
          _private,
          _public,
         _hidden
        }
       dispatch(setPlaylistData(obj))
      }
    } catch (error) {
      console.log(error);
    }
 }

