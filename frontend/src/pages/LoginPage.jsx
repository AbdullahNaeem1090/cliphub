import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginPageUI, INPUT } from "../UI.js";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyVideos } from "../slices/myVideoSlice.js"
import { useAuth } from "../protection/useAuth.jsx";
import { setAllVideos } from "../slices/allVideosSlice.js";
import { setLikedVideos } from '../slices/likeSlice.js';
import { setSubscribedChannels } from "../slices/subscriptionSlice.js";
import { getUserPlaylists } from "../utils/setCurrVideo&Navigate.js";

export default function LoginPage() {
    const { setIsAuthenticated,setCurrUser,isAuthenticated,isAuthenticating } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    // const [show, setShow] = useState(true);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    function navi() {
        // setShow(false);
        setTimeout(() => navigate('/signUp'), 300); // Transition duration should match the timeout
    }

    async function getAllVideos() {
        let resp = await axios.get("/api/video/getVideos");
        if (resp.data.data) {
            dispatch(setAllVideos(resp.data.data));
        }
    }

    async function getMyVideos() {
        try {
            let resp = await axios.get("/api/video/myVideos");
            if (resp) {
                dispatch(setMyVideos(resp.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getMyPlaylists() {
        try {
            let res = await axios.get("/api/playlist/getPlaylists");
            if (res.data.statusCode === 200) {
                dispatch(initializePlaylist(res.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getLikesAndSubscribedChannels(id) {
        try {
            let resp1 = await axios.get(`/api/like/getLikes/${id}`);
            let resp2 = await axios.get(`/api/subscription/subscribedChannels/${id}`);
            if (resp1 && resp2) {
                dispatch(setLikedVideos(resp1.data.data));
                dispatch(setSubscribedChannels(resp2.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function onsubmit(logInData) {
        try {
            let response = await axios.post("/api/user/logIn", logInData);
            console.log(response)
            if (response.data.success) {
                setIsAuthenticated(true);
                setCurrUser(response.data.data)
                setErrMsg("");
                await getUserPlaylists(dispatch,response.data.data?._id)
    
                await getAllVideos();
                await getMyPlaylists();
                await getMyVideos();
                await getLikesAndSubscribedChannels(response.data.data._id);
                setTimeout(() => navigate("/main"), 300);
            }
        } catch (error) {
            console.log(error);
            setErrMsg(error.response?.data?.message || "An error occurred");
        }
    }

console.log(isAuthenticated,isAuthenticating)


    return (
            <div className={loginPageUI.bgDiv}>
                <div className='flex space-x-3 bg-slate-300 px-4 py-4 rounded-3xl bg-opacity-60 '>
                    <div className={loginPageUI.centralLeftDiv}>
                        <div className='mt-2'>
                            <img src="/src/assets/cliphub.png" alt="" className='w-60 h-14 rounded-full' />
                        </div>
                        <div className='px-3 w-full'>
                            <p className='text-3xl font-bold'>🙂 Welcome!</p>
                            <p className='text-lg mt-2'>- Email must be unique</p>
                            <p className='text-lg'>- Try to set Difficult Password</p>
                            <p className='text-lg'>-  Best Social Platform</p>
                            <p className='text-md font-bold bg-red-400 opacity-70 rounded-xl px-2 text-white my-2'>
                                In case of any issue Please Contact at cliphub.com.pk
                            </p>
                            <p className='text-md font-bold bg-slate-500 opacity-70 rounded-xl px-2 text-white my-2'>
                                All rights are Reserved as copyright Policy 2024
                            </p>
                            <p className='text-center'>-------------------------------</p>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit(onsubmit)} className={loginPageUI.rightSignIn}>
                            <p className='text-3xl mt-3'>Sign In</p>
                            <div className='mt-3'>
                                <input
                                    type="text"
                                    placeholder='Email'
                                    className='w-64 h-10 text-xl px-2 rounded-lg'
                                    {...register('email', INPUT.emailValidations)}
                                />
                                {errors.email && <p>{errors.email.message}</p>}
                            </div>
                            <div className="relative max-w-64">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    className='w-64 h-10 text-xl px-2 rounded-lg max-w-64'
                                    {...register('password', { required: 'Password is required' })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-1 max-h-10 bg-green-400 rounded-lg text-2xl"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? '🧐' : '😑'}
                                </button>
                                {errors.password && <p>{errors.password.message}</p>}
                                <label className="flex items-center mt-2" >
                                    <input type="checkbox" className="mr-2 h-5 w-4 text-teal-600 border-gray-300 rounded" 
                                    {...register('rememberMe')}
                                    />
                                    Remember me
                                </label>
                            </div>
                            <input type="submit" value="login" className={loginPageUI.submitUI} />
                            <p className="text-red-600 font-bold">{errMsg}</p>
                        </form>
                        <button className={loginPageUI.signUpUI} onClick={navi}>Sign Up</button>
                    </div>
                </div>
            </div>
    );
}


