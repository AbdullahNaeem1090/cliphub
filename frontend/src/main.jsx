import ReactDOM from "react-dom/client";
import LandingPage from "./pages/landingPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import SignUpPage from "./pages/signUp.jsx";
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
import WatchPlaylistPage from "./pages/watchPlaylistPage.jsx";
import AccountLayout from "./layout/AccountLayout.jsx";
import MyVideosPage from "./pages/Account/MyVideosPage.jsx";
import MyPlaylistPage from "./pages/Account/MyPlaylistsPage.jsx";
import UploadVideoPage from "./pages/Account/UploadVideoPage.jsx";
import ProfilePic from "./components/profileChange.jsx";
import PassChange from "./components/passchange.jsx";
import ProtectedRoute from "./protection/protection.jsx";
import { AuthProvider } from "./protection/useAuth.jsx";
import PlaylistMode from "./components/playlistMode.jsx";
import Subscription from "./pages/SubscriptionPage.jsx";
import FollowedChannel from "./components/followedChannel.jsx";
import SubscribedChannelVideos from "./components/subscribedChannelVideos.jsx";
import SubscribedChannelPlaylists from "./components/subscribedChannelPlaylists.jsx";
import WatchHistory from "./components/watchHistory.jsx";
import ChatHub from "./components/chatHub.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layout/Applayout.jsx";
import PersonalPlaylists from "./pages/PersonalPlaylists.jsx";

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
        <Route path="PrivatePlaylists" element={<PersonalPlaylists />} />
        <Route path="srvp" element={<SearchResultVideosPage />} />
        <Route path="wvp" element={<WatchVideoPage />} />
        <Route path="watchPlaylist/:playlistId" element={<WatchPlaylistPage />} />
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
        <Route path="account" element={<AccountLayout />}>
          <Route index element={<MyVideosPage />} />
          <Route path="myVideos" element={<MyVideosPage />} />
          <Route path="myPlaylist" element={<MyPlaylistPage />} />
          <Route path="uploadVideo" element={<UploadVideoPage />} />
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
