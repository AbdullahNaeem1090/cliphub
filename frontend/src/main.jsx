import ReactDOM from "react-dom/client";
import LandingPage from "./components/landingPage.jsx";
import LoginPage from "./components/loginPage.jsx";
import SignUpPage from "./components/signUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import Settings from "./components/settings.jsx";
import "./index.css";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import SearchResultVideosPage from "./components/searchResult.jsx";
import { store, persistor } from "./store/store.js";
import WatchVideoPage from "./pages/WatchVideoPage.jsx";
import Account from "./components/account.jsx";
import MyVideos from "./components/myVideos.jsx";
import MyPlaylist from "./components/myPlaylist.jsx";
import UploadVideo from "./components/uploadVideo.jsx";
import ProfilePic from "./components/profileChange.jsx";
import PassChange from "./components/passchange.jsx";
import ProtectedRoute from "./protection/protection.jsx";
import { AuthProvider } from "./protection/useAuth.jsx";
import PrivatePlaylist from "./components/privatePlaylist.jsx";
import PlaylistMode from "./components/playlistMode.jsx";
import Subscription from "./components/subscriptionPage.jsx";
import FollowedChannel from "./components/followedChannel.jsx";
import SubscribedChannelVideos from "./components/subscribedChannelVideos.jsx";
import SubscribedChannelPlaylists from "./components/subscribedChannelPlaylists.jsx";
import WatchHistory from "./components/watchHistory.jsx";
import ChatHub from "./components/chatHub.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layout/Applayout.jsx";

const queryClient = new QueryClient();


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/main" element={<ProtectedRoute ><AppLayout/></ProtectedRoute>} >
        <Route index element={<HomePage />} />
        <Route path="homePage" element={<HomePage />} />
        <Route path="PrivatePlaylists" element={<PrivatePlaylist />} />
        <Route path="srvp" element={<SearchResultVideosPage />} />
        <Route path="wvp" element={<WatchVideoPage />} />
        <Route path="watchHistory" element={<WatchHistory />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="chathub" element={<ChatHub />} />
        <Route path="followedPage" element={<FollowedChannel />}>
          <Route index element={<SubscribedChannelVideos />} />
          <Route path="videos" element={<SubscribedChannelVideos />} />
          <Route path="playlists" element={<SubscribedChannelPlaylists />} />
        </Route>
        <Route path="playlist" element={<PlaylistMode />} />
        <Route path="settings" element={<Settings />}>
          <Route path="changedp" element={<ProfilePic />} />
          <Route path="changepass" element={<PassChange />} />
        </Route>
        <Route path="account" element={<Account />}>
          <Route index element={<MyVideos />} />
          <Route path="myVideos" element={<MyVideos />} />
          <Route path="myPlaylist" element={<MyPlaylist />} />
          <Route path="uploadVideo" element={<UploadVideo />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/main" />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ scrollRestoration: "manual" }} />
      </QueryClientProvider>
      </PersistGate>
    </Provider>
  </AuthProvider>
);
