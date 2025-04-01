import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../slices/currentUser.js";


function ProfilePic() {
console.log("pic rendered")

    const avatarUrl = useSelector((state) => state.user.currUser.avatar)
    const dispatch = useDispatch()
    const { register, handleSubmit  } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);

    const [waiter, setWaiter] = useState(false)
    const [done, setDone] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    const profilePicChange = async (data) => {
        console.log("Form submitted:", data);
        const formadata = new FormData()
        formadata.append('pic', data.image[0])
        try {
            setWaiter(true)
            let resp = await axios.post("/api/user/avatarUpload", formadata)
            console.log(resp)
            if (resp) {
                setWaiter(false)
                setDone(true)
                setTimeout(() => {
                    setDone(false)
                }, 1000)
                dispatch(setCurrentUser(resp.data.data))
            }
        } catch (error) {
            console.log(error)
        }

    };
    return <>
        <form onSubmit={handleSubmit(profilePicChange)}
            className="flex flex-col items-center space-y-4 lg:w-1/3 md:2/3 mx-auto border border-gray-700
                                    rounded-2xl py-3 mb-2 overflow-hidden mt-3 gradient-bg">
            <img src={selectedImage || avatarUrl || "/src/assets/defaultAvatar.png"}
                alt="Preview"
                className="h-36 w-36 rounded-full object-cover border border-white"
            />
            <input
                type="file"
                accept="image/*"
                {...register('image', { required: 'Image is required' })}
                onChange={handleImageChange}
                className="text-slate-300 rounded-lg bg-white bg-opacity-10 "
            />
            <div className={waiter && "waiter mx-auto "} ></div>
            <p className={done ? "mx-auto text-3xl text-green-500" : "hidden"} >Done ✅</p>
            <input type="submit" value="Change" className="bg-green-500 font-bold text-white rounded-lg w-1/2 px-3 py-1 hover:bg-green-600" />
        </form>


    </>
}

export default ProfilePic