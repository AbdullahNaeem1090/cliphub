import { useNavigate } from "react-router-dom";
import { useAuth } from "../protection/useAuth.jsx";
import { useDispatch } from "react-redux";
import { getUserPlaylists } from "../utils/setCurrVideo&Navigate.js";


export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currUser,isAuthenticated,isAuthenticating } = useAuth()



  setTimeout(() => {
    if (isAuthenticated) {
      console.log("called")
      getUserPlaylists(dispatch,currUser._id)
      navigate("/main");

    } else if(!isAuthenticated && !isAuthenticating){
      navigate("/logIn");
    }
  }, 3000);

  return (
    <>
      <div className="landingPageBg h-screen flex flex-col items-center  justify-center space-y-3 ">
        <div className="flex items-center">
          <img
            src="/src/assets/logoCH.png"
            alt="Start logo"
            className="rounded-full h-28 w-28"
          />
          <p className="fontStyle greet text-8xl font-extrabold cursor-default">
            ClipHub
          </p>
        </div>
        <div className="loader p-1 rounded-lg"></div>
      </div>
    </>
  );
}
