import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainRegister from "./pages/CaptainRegister";
import Home from "./pages/Home";
import Start from "./pages/Start";
import CheckAuth from "./utils/checkAuth.jsx";
import CaptainHome from "./pages/CaptainHome.jsx";
import CheckCaptainAuth from "./utils/CheckCaptainAuth.jsx";
import OngoingRide from "./pages/OngoingRide.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";
import RideDetails from "./pages/RideDetails.jsx";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route
          path="/ongoing-ride"
          element={
            <CheckAuth>
              <OngoingRide />
            </CheckAuth>
          }
        />
        <Route
          path="/captain-riding"
          element={
            <CheckCaptainAuth>
              <CaptainRiding />
            </CheckCaptainAuth>
          }
        />
        <Route path="/rideDetails" element={<RideDetails />} />

        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-register" element={<CaptainRegister />} />
        <Route
          path="/home"
          element={
            <CheckAuth>
              <Home />
            </CheckAuth>
          }
        />
        <Route
          path="/captainhome"
          element={
            <CheckCaptainAuth>
              <CaptainHome />
            </CheckCaptainAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
