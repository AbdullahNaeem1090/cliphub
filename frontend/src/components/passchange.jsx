import { useForm } from "react-hook-form";
import { INPUT } from "../UI";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CustomToast } from "../utils/showUtils";

function PassChange() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

      const dispatch=useDispatch()
    

    const [showTick, setShowTick] = useState(false);
    const [apiError, setApiError] = useState("");

    const changePass = async (data) => {
        setApiError("");

        if (data.newPassword !== data.confirmPassword) {
            CustomToast(dispatch, "‼️ New passwords are not same")
            return;
        }

        try {
            const resp = await axios.post("/api/user/changePass", data);

            if (resp.data.success) {
                setShowTick(true);
                reset();
                setTimeout(() => setShowTick(false), 2000);
            } else {
                setApiError(resp.data.error || "Failed to change password.");
            }
        } catch (error) {
            console.log(error);
            setApiError("Something went wrong.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(changePass)}
            className="flex flex-col items-center space-y-4 lg:w-1/3 md:2/3 mx-auto border border-gray-700 p-5 rounded-2xl py-3 mb-2 overflow-hidden mt-3 gradient-bg"
        >
            <input
                type="password"
                className="bg-slate-900 text-white rounded-lg w-full p-2"
                {...register("currentPassword", { required: "Current password required" })}
                placeholder="Enter Current Password"
            />
            {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}

            <input
                type="password"
                className="bg-slate-900 text-white rounded-lg p-2 w-full"
                placeholder="Enter New Password"
                {...register("newPassword", INPUT.passwordValidations)}
            />
            {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

            <input
                type="password"
                className="bg-slate-900 text-white rounded-lg p-2 w-full"
                placeholder="Confirm New Password"
                {...register("confirmPassword", { required: "Please confirm password" })}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

            {apiError && <p className="text-red-500">{apiError}</p>}
            {showTick && <p className="mx-auto text-3xl text-green-500">Done ✅</p>}

            <input
                type="submit"
                value="Change"
                className={`${
                    showTick ? "hidden" : ""
                } bg-green-500 cursor-pointer lg:w-1/3 py-2 px-3 rounded-lg w-full font-bold hover:bg-green-600 text-white`}
            />
        </form>
    );
}

export default PassChange;
