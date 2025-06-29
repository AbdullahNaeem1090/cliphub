const loginPageUI = {
    bgDiv: "loginbg w-screen h-screen flex items-center justify-center",
    centralLeftDiv: "hidden md:h-[23.4rem]  md:w-80 rounded-2xl md:flex flex-col items-center space-y-3",
    rightSignIn: "bg-slate-400 shadow-lg w-80  h-[20rem] flex flex-col items-center space-y-3  rounded-2xl",
    submitUI:"bg-green-400 w-48 h-9 rounded-full hover:bg-green-500 cursor-pointer font-bold ",
    forgotPassUI:'hover:text-white cursor-pointer font-bold',
    signUpUI:'bg-blue-600 w-80 rounded-xl mt-3 h-10 text-white text-xl hover:bg-blue-500'
}

const INPUT={
    passwordValidations: {
        required: 'Password is required',
        minLength: {
            value: 5,
            message: 'Password must be at least 5 characters long'
        },
        maxLength: {
            value: 15,
            message: 'Password must not exceed 10 characters'
        },
        pattern: {
            value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,15}$/,
            message: 'Password must include both letters and digits'
        }
    },
    emailValidations: {
        required: 'Email is required',
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Invalid email address'
        }
    },
  userNameValidations: {
  required: 'Username is required',
  pattern: {
    value: /^[a-zA-Z0-9_ ]{3,20}$/,
    message: 'Username must be 3-20 characters, only letters, numbers, spaces, and underscores'
  }
}

}

const signUpPageUI={
    mainBgSec:"signUpbg w-screen h-screen flex flex-col items-center justify-center",
    h4BelowLogo:"mb-2 mt-1 pb-1 text-3xl font-bold",
    passVisibility:"absolute inset-y-0 right-0 px-1 max-h-10 bg-green-400 rounded-lg text-2xl",
    registerBtn:"mb-2 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-blue-700 hover:bg-blue-600 ",
    goBackBtn:"bg-slate-500 text-white w-40 mt-2 rounded-2xl py-1 hover:bg-slate-400"
}
export {loginPageUI,INPUT,signUpPageUI}

