import React, { useState } from "react";
import {  Outlet } from "react-router-dom";
import "../App.css";
import { useSelector } from "react-redux";
import SideBar from "../components/sideBar";
import Header from "../components/header";

function AppLayout() {

  const toast = useSelector((state) => state.toast);
  const [showSideBar, setShowSideBar] = useState(false);
  const [result, setResult] = useState([]);

  return (
    <>
      <Header 
       setShowSideBar={setShowSideBar}
       setResult={setResult}
      />

      <SideBar  showSideBar={showSideBar}  />

      <Outlet context={result}></Outlet>

      {toast.isVisible && (
        <div
          id="toast-bottom-left"
          className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm bottom-5 dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 right-5"
          role="alert"
        >
          <div className="text-sm font-normal">{toast.content}.</div>
        </div>
      )}

    </>
  );
}

export default React.memo(AppLayout);
