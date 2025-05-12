import { useForm } from "react-hook-form";
import { INPUT, signUpPageUI } from "../UI.js";
import { useNavigate } from 'react-router-dom';
import {  useState } from "react";
import axios from 'axios';


export default function SignUpPage() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const togglePasswordVisibility = () => setShowPass(!showPass);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function onsubmit(signUpData) {
    try {
      let resp = await axios.post("/api/user/signUp", signUpData);

      if (resp.data.message === "User registered Successfully") {
        setErrorMsg("");
        setSuccessMsg("Account created ✅");
      }
    } catch (err) {
      console.log("Error while Signing Up ", err);
      setSuccessMsg("");
      setErrorMsg("🚫" + err.response.data.error);
    }
  }

  function navBack() {
    navigate("/login")
  }
  // const nodeRef = useRef(null);
  return (

      <section  className={signUpPageUI.mainBgSec}>
        <div className="md:mx-6 md:p-12 bg-slate-100 bg-opacity-50  rounded-3xl px-3 ">

          <div className="text-center ">
            <img className="mx-auto" src="/src/assets/logoCH.png" alt="logo" />
            <h4 className={signUpPageUI.h4BelowLogo}> ClipHub </h4>
          </div>

          <form onSubmit={handleSubmit(onsubmit)} >
            <p>Please register an account</p>

            <div className='mt-1'>
              <input
                type="text"
                placeholder='Username'
                className='w-72 h-10 text-xl px-2 rounded-lg'
                {...register('username', INPUT.userNameValidations)}
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>

            <div className='mt-3'>
              <input
                type="text"
                placeholder='Email'
                className='w-72 h-10 text-xl px-2 rounded-lg'
                {...register('email', INPUT.emailValidations)}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="relative max-w-72 mt-3">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder='Password'
                className='w-72 h-10 text-xl px-2 rounded-lg'
                {...register('password', INPUT.passwordValidations)}
              />
              <button type="button" className={signUpPageUI.passVisibility} onClick={togglePasswordVisibility}>
                {showPass ? '🧐' : '😑'}
              </button>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div className="mt-1 pb-1 pt-1 text-center">
              <input type="submit" value="Register" disabled={isSubmitting} className={signUpPageUI.registerBtn} />
              <p className="text-green-600 font-bold">{successMsg}</p>
              <p className="text-red-600 font-bold">{errorMsg}</p>
              {successMsg !== "" && <p className="text-black ">You can Go Back & Login</p>}
            </div>
          </form>
        </div>
        <button className={signUpPageUI.goBackBtn} onClick={navBack}> Back </button>
      </section>
  );
}
