import { useState } from "react";
import { Link, Outlet } from "react-router-dom"
// import { useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../protection/useAuth";


function Settings() {
    // const { setIsAuthenticated } = useAuth()

    const navigate = useNavigate()
    const [showLogOut, setShowLogOut] = useState(true)

    async function userLogout() {
        try {
            let res = await axios.post("/api/user/logout")
            if (res) {
                // setIsAuthenticated(false)
                sessionStorage.setItem('auth', JSON.stringify(false));
                setTimeout(() => {
                    navigate("/logIn")
                }, 200)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4 sm:ml-56 ">
            <div className="p-1 border-gray-600 border-dashed rounded-lg mt-14 ">

                <div className="lg:flex">
                    <div className="relative flex flex-col bg-clip-border rounded-xl gradient-bg bg-opacity-25 text-gray-700 lg:min-h-[550px] w-full lg:max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-hidden">

                        <h5 className="mb-2 font-sans text-3xl font-semibold leading-snug text-gray-300">Account Settings</h5>

                        <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-md text-white font-bold">

                            <Link to="changedp" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-300 hover:bg-opacity-80 focus:bg-blue-500 focus:bg-opacity-80 active:bg-blue-500 active:bg-opacity-90 hover:text-blue-900 focus:text-white active:text-blue-900 outline-none">
                                <div className="grid place-items-center mr-4">
                                    <img src="/src/assets/defaultAvatar.png" className="h-7 w-7" alt="" />
                                </div>
                                Change Profile Pic
                            </Link>
                            <Link to="changepass" tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-300 hover:bg-opacity-80 focus:bg-blue-500 focus:bg-opacity-80 active:bg-blue-500 active:bg-opacity-90 hover:text-blue-900 focus:text-white active:text-blue-900 outline-none">
                                <div className="grid place-items-center mr-4">
                                    <img src="/src/assets/password.png" className="h-7 w-7" alt="" />
                                </div>
                                Change Current Pass
                            </Link>

                            <div onClick={() => setShowLogOut((prev) => !prev)} tabIndex="0" className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-300 hover:bg-opacity-80 focus:bg-blue-500 focus:bg-opacity-80 active:bg-blue-500 active:bg-opacity-90 hover:text-blue-900 focus:text-white active:text-blue-900 outline-none cursor-pointer">
                                <div className="grid place-items-center mr-4">
                                    <img src="/src/assets/logout.png" className="h-7 w-7" alt="" />
                                </div>
                                Logout
                            </div>
                            <button className={showLogOut ? "hidden" : "text-white bg-red-600 hover:bg-red-500 font-medium text-sm px-5 py-2.5 text-center w-32 rounded-full mx-auto mt-2"} onClick={userLogout}>Are U Sure?
                            </button>
                        </nav>
                    </div>
                    <Outlet></Outlet>
                </div>




            </div>
        </div>


    );
}

export default Settings;
