import { useForm } from "react-hook-form";
import { INPUT } from "../UI";
import axios from "axios";
import { useState } from "react";


function PassChange() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log("change pass rendered")

    const [showTick, setShowTick] = useState(false)

    const changePass = async (data) => {
        console.log(data)
        try {
            let resp = await axios.post("/api/user/changePass", data)
            if (resp.data.statusCode==200) {
                console.log(resp)
                setShowTick(true)
                setTimeout(() => {
                    setShowTick(false)
                }, 2000)
            }
        } catch (error) {
            console.log(error)
        }
    };
    return <>
        <form onSubmit={handleSubmit(changePass)} className="flex flex-col items-center space-y-4 lg:w-1/3 md:2/3 mx-auto border border-gray-700 p-5
                rounded-2xl py-3 mb-2 overflow-hidden mt-3 gradient-bg" id="form2" >

            <input type="text" className="bg-slate-900 text-white rounded-lg w-full p-2"  {...register('currentPassword')} placeholder="Enter Current Password" />


            <input type="text" className="bg-slate-900 text-white rounded-lg  p-2 w-full" placeholder="Enter New Password" {...register('newPassword', INPUT.passwordValidations)} />

            <p className={showTick? "mx-auto text-3xl text-green-500":"hidden"} >Done ✅</p>
            {errors.password && <p className="text-red-500 pb-3">{errors.password.message}</p>}
            <input type="submit" value="Change" className={showTick? "hidden":"bg-green-500 cursor-pointer lg:w-1/3 py-2 px-3 rounded-lg  w-full font-bold hover:bg-green-600 text-white"} form="form2" />

        </form>


    </>
}

export default PassChange