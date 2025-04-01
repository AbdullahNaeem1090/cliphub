import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../slices/currentUser.js";
import { setMyVideos } from "../slices/myVideoSlice"
import { useAuth } from "../protection/useAuth.jsx";
import { initializePlaylist } from '../slices/playlistSlice.js';
import { setAllVideos } from '../slices/allVideosSlice.js';
import { setLikedVideos } from '../slices/likeSlice.js';
import { setSubscribedChannels } from '../slices/subscriptionSlice.js';
import { CSSTransition } from 'react-transition-group';

const FadeOutComponent = ({ show, onExitComplete }) => (
  <CSSTransition
    in={show}
    timeout={300}
    classNames="fade"
    onExited={onExitComplete}

  >
    <div className='landingPageBg h-screen flex flex-col items-center  justify-center space-y-3 ' >
      <div className='flex items-center'>
        <img src="/src/assets/logoCH.png" alt="Start logo" className='rounded-full h-28 w-28' />
        <p className='fontStyle greet text-8xl font-extrabold cursor-default'>ClipHub</p>
      </div>

      <div className='loader p-1 rounded-lg'></div>
    </div>
  </CSSTransition>
);


export default function LandingPage() {
  const { setIsAuthenticated } = useAuth()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [show, setShow] = useState(true);

  const handleExitComplete = () => {
    navigate('/main'); 
  };


  async function getAllVideos() {
    let resp = await axios.get("/api/video/getVideos")
    if (resp.data.data) {
      dispatch(setAllVideos(resp.data.data))
    }
  }
  async function getLikesAndSubscribedChannels(id) {
    try {
      console.log(id)
      let resp1 = await axios.get(`/api/like/getLikes/${id}`)
      let resp2 = await axios.get(`/api/subscription/subscribedChannels/${id}`)
      console.log(resp2.data.data)
      if (resp1 && resp2) {
        dispatch(setLikedVideos(resp1.data.data))
        dispatch(setSubscribedChannels(resp2.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function getMyVideos() {
    try {
      let resp = await axios.get("/api/video/myVideos")
      console.log("dispatched myvideos", resp.data.data)
      dispatch(setMyVideos(resp.data.data))
    } catch (error) {
      console.log(error)
    }
  }

  async function getMyPlaylists() {
    try {
      let res = await axios.get("/api/playlist/getPlaylists")
      if (res.data.statusCode == 200) {
        dispatch(initializePlaylist(res.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

 
  useEffect(() => {
    const fetchCurrUser = async () => {
      try {
        let resp = await axios.get("/api/user/currUser");
        if (resp) {
          setIsAuthenticated(true)
          await getAllVideos()
          await getMyVideos()
          await getMyPlaylists()
          await getLikesAndSubscribedChannels(resp.data.data._id)
          sessionStorage.setItem('auth', JSON.stringify(true));
          setTimeout(() => {
            dispatch(setCurrentUser(resp.data.data))
            setShow(false)
          }, 2000)
        }
      } catch (error) {
        setTimeout(() => {
          navigate('/logIn')
        }, 3000)
        console.log(error);
      }
    };

    fetchCurrUser();
  }, []);


  return <div>
    <FadeOutComponent show={show} onExitComplete={handleExitComplete} />
  </div>

}

