import { hideToast, showToast } from "../slices/toastSlice";

function CustomToast(dispatch,content) {

  dispatch(showToast(content));

  setTimeout(() => {
    dispatch(hideToast());
  }, 3000);

}

export { CustomToast };
