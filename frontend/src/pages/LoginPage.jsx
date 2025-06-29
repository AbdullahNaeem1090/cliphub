import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginPageUI, INPUT } from "../UI.js";
import { useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { useAuth } from "../protection/useAuth.jsx";

import { getUserPlaylists } from "../utils/setCurrVideo&Navigate.js";
import { myAxios } from "../utils/axiosInstance.js";

export default function LoginPage() {
    const { setIsAuthenticated, setCurrUser, isAuthenticated, isAuthenticating } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    function navi() {
        // setShow(false);
        setTimeout(() => navigate('/signUp'), 300); // Transition duration should match the timeout
    }


    async function onsubmit(logInData) {
        try {
            let response = await myAxios.post("/api/user/logIn", logInData);
            if (response.data.success) {
                setIsAuthenticated(true);
                setCurrUser(response.data.data)
                setErrMsg("");
                await getUserPlaylists(dispatch, response.data.data?._id)


                setTimeout(() => navigate("/main"), 300);
            }
        } catch (error) {
            console.log(error);
            setErrMsg(error.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div className={loginPageUI.bgDiv}>
            <div className='flex space-x-3 bg-slate-300 px-4 py-4 rounded-3xl bg-opacity-60 '>
                <div className={loginPageUI.centralLeftDiv}>
                    <div className='mt-2'>
                        <img src="/icon/cliphub.png" alt="" className='w-60 h-14 rounded-full' />
                    </div>
                    <div className="px-4 w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-3">Welcome to ClipHub</h2>

                        <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4 text-[1rem]">
                            <li>Email must be unique</li>
                            <li>Set a strong password for security</li>
                            <li>Experience the best social video platform</li>
                        </ul>

                        <div className="bg-red-500 bg-opacity-80 text-white text-sm rounded-lg p-2 mb-2 font-semibold shadow">
                            🚨 For any issues, contact: <a href="mailto:masenko2023@gmail.com" className="underline">masenko.dev</a>
                        </div>

                        <div className="bg-slate-600 bg-opacity-80 text-white text-sm rounded-lg p-2 mb-4 font-semibold shadow">
                            © 2024 ClipHub — All rights reserved.
                        </div>

                        <p className="text-center text-gray-500">――――――――――――――――――――</p>
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


