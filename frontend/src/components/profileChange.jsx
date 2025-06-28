import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../protection/useAuth.jsx";
import { CustomToast } from "../utils/showUtils.js";
import { useDispatch } from "react-redux";
import { myAxios } from "../utils/axiosInstance.js";

function ProfilePic() {
  const { currUser } = useAuth();
  let avatarUrl = currUser.avatar;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selectedImage, setSelectedImage] = useState(null);
  const [waiter, setWaiter] = useState(false);
  const [done, setDone] = useState(false);
  const dispatch=useDispatch()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const profilePicChange = async (data) => {
    if (!data.image || data.image.length === 0) {
      console.log("No image selected");
      return;
    }

    const formadata = new FormData();
    formadata.append("pic", data.image[0]);

    try {
      setWaiter(true);
      const resp = await myAxios.post("/api/user/avatarUpload", formadata);
 
      if (resp) {
        setWaiter(false);
        setDone(true);
        reset(); // reset form
        setSelectedImage(null); // reset image preview
        CustomToast(dispatch, "✅ Profile Pic Changed . Please Refresh To see the Update Pic")
        setTimeout(() => {
          setDone(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setWaiter(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(profilePicChange)}
      className="flex flex-col items-center space-y-4 lg:w-1/3 md:2/3 mx-auto border border-gray-700 rounded-2xl py-3 mb-2 overflow-hidden mt-3 gradient-bg"
    >
      <img
        src={selectedImage || avatarUrl || "/src/assets/defaultAvatar.png"}
        alt="Preview"
        className="h-36 w-36 rounded-full object-cover border border-white"
      />

      <input
        type="file"
        accept="image/*"
        {...register("image", { required: "Please select an image" })}
        onChange={handleImageChange}
        className="text-slate-300 rounded-lg bg-white bg-opacity-10"
      />
      {errors.image && (
        <p className="text-red-500 text-sm">{errors.image.message}</p>
      )}

      {waiter && <div className="waiter mx-auto"></div>}
      {done && <p className="mx-auto text-3xl text-green-500">Done ✅</p>}

      <input
        type="submit"
        value="Change"
        className="bg-green-500 font-bold text-white rounded-lg w-1/2 px-3 py-1 hover:bg-green-600"
      />
    </form>
  );
}

export default ProfilePic;
