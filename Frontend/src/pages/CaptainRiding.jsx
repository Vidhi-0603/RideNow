import React, { useContext, useRef, useState } from "react";
import LogoutCaptain from "../components/LogoutCaptain.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axiosInstance from "../utils/axiosInstance.js";
import { CaptainDataContext } from "../context/CaptainContext.jsx";
import CaptainMap from "../components/CaptainMap.jsx";
import { RideDataContext } from "../context/RideContext.jsx";

const CaptainRiding = () => {

  const [OTP, setOTP] = useState("");
  const [OTPPanelOpen, setOTPPanelOpen] = useState(true);
  const OTPPanelRef = useRef(null);
  const finishRidePanelRef = useRef(null);

  const [finishRidePanelOpen, setFinishRidePanelOpen] = useState(false);
  const [isrideStarted, setIsrideStarted] = useState(false);

  const { captain } = useContext(CaptainDataContext);
  const { rideData, setRideData } = useContext(RideDataContext);

  const location = useLocation();
  const {
    destinationData,
    showRoute,
    pickupCoords,
    destinationCoords,
    captainLocation,
  } = location.state || {};

  useGSAP(
    function () {
      if (OTPPanelOpen) {
        gsap.to(OTPPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(OTPPanelRef.current, {
          transform: "translateY(90%)",
        });
      }
    },
    [OTPPanelOpen]
  );

  useGSAP(
    function () {
      if (finishRidePanelOpen) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(90%)",
        });
      }
    },
    [finishRidePanelOpen]
  );

  useGSAP(
    function () {
      if (OTPPanelOpen && !finishRidePanelOpen) {
        gsap.to(OTPPanelRef.current, {
          transform: "translateY(0)",
        });
      } else if (!OTPPanelOpen && !finishRidePanelOpen) {
        gsap.to(OTPPanelRef.current, {
          transform: "translateY(80%)",
        });
      } else {
        gsap.to(OTPPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [OTPPanelOpen]
  );

  useGSAP(
    function () {
      if (finishRidePanelOpen && !OTPPanelOpen) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else if (!finishRidePanelOpen && OTPPanelOpen) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(80%)",
        });
      }
    },
    [finishRidePanelOpen]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.get("/ride/start-ride", {
      params: {
        rideId: rideData?._id,
        otp: OTP,
      },
    });

    if (response.status === 200) {
      setOTPPanelOpen(false);
      setFinishRidePanelOpen(true);
      setIsrideStarted(true);
      setRideData(response.data);
    }
  };

  const navigate = useNavigate();

  async function endRide() {
    const response = await axiosInstance.post("/ride/end-ride", {
      rideId: rideData?._id,
    });

    if (response.status === 200) {
      setIsrideStarted(false);
      setRideData(response.data);
      navigate("/rideDetails", {
        state: { destinationData: destinationData },
      });
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex w-full p-2 items-center justify-between absolute top-0">
        <LogoutCaptain />
      </div>

      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        <CaptainMap
          captain={captain}
          showRoute={showRoute}
          isrideStarted={isrideStarted}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          captainLocation={captainLocation}
        />
      </div>

      <div
        className="absolute bottom-0 bg-white py-5 px-4 w-full"
        ref={OTPPanelRef}
      >
        <h5
          onClick={() => {
            setOTPPanelOpen(!OTPPanelOpen);
          }}
          className="absolute right-6 top-5 text-2xl"
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h5>

        <div className="mb-3 p-2 border-b-3 border-gray-400 bg-gray-50 rounded">
          <h4 className="text-gray-400 font-base text-lg">PICKUP AT</h4>
          <h3 className="font-medium text-2xl">{rideData?.pickup}</h3>
        </div>

        <form action="" className="p-3" onSubmit={submitHandler}>
          <label className="text-2xl font-bold">Enter OTP:</label>
          <input
            type="text"
            className="bg-[#eee] px-5 py-3 mt-3 text-xl rounded-lg w-full"
            placeholder="Enter OTP"
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
            required
            minLength={6}
            maxLength={6}
          />
          <button
            type="submit"
            className="bg-blue-900 px-4 py-2 mt-5 text-2xl w-full rounded text-white"
          >
            Start Ride
          </button>
        </form>

        <div className="mt-5 p-3 flex justify-center">
          <Link
            to="/captainhome"
            className="bg-red-700 px-10 py-2 text-xl rounded text-white"
          >
            Cancel Ride
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-0 bg-white py-5 px-4 w-full translate-y-[100%]"
        ref={finishRidePanelRef}
      >
        <h5
          onClick={() => {
            setFinishRidePanelOpen(!finishRidePanelOpen);
          }}
          className="absolute right-6 top-5 text-2xl"
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h5>

        <div className="mb-3 p-2 border-b-3 border-gray-400 bg-gray-50 rounded">
          <h4 className="text-gray-400 font-base text-lg">DROP OFF AT</h4>
          <h3 className="font-medium text-2xl">{rideData?.destination}</h3>
        </div>

        <div>
          <h3 className="text-2xl font-medium p-2">
            Total Fare:{" "}
            <span className="text-gray-500">&#8377; {rideData?.fare}</span>
          </h3>
          <h3 className="text-2xl font-medium p-2">
            Total Time:{" "}
            <span className="text-gray-500">
              {destinationData?.duration.text}
            </span>
          </h3>
        </div>

        <div className="mt-5 p-3 flex justify-center">
          <button
            onClick={endRide}
            className="bg-red-700 px-10 py-2 text-2xl rounded text-white"
          >
            Finsih Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
