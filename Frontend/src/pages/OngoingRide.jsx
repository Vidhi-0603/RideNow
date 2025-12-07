import React, { useContext, useRef, useState } from "react";
import LogoutUser from "../components/LogoutUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import RiderMap from "../components/RiderMap";

const OngoingRide = () => {
  const [currentRidePanelOpen, setCurrentRidePanelOpen] = useState(false);

  const collapsePanelRef = useRef(null);

  const location = useLocation();
  const { ride, isRideStarted, pickupCoords, destinationCoords } =
    location.state || {};
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();

  console.log(ride);

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  useGSAP(
    function () {
      if (currentRidePanelOpen) {
        gsap.to(collapsePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(collapsePanelRef.current, {
          transform: "translateY(85%)",
        });
      }
    },
    [currentRidePanelOpen]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Uberlogo Image and Logout button */}
      <div className="flex w-full p-2 items-center justify-between absolute top-0">
        <LogoutUser />
      </div>

      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        {/* {isRideStarted && ( */}
        <RiderMap
          user={ride?.user}
          ride={ride}
          captainFound={true}
          isrideStarted={isRideStarted}
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />
      </div>

      {/* Ongoing Ride */}
      <div
        ref={collapsePanelRef}
        className="absolute bottom-0 bg-white py-5 px-3 w-full"
      >
        <div>
          {/* heading and down button */}
          <div>
            <h3 className="text-xl font-medium border-b-2 border-gray-300 rounded-full pb-2 text-center mb-2">
              Ongoing Ride...
            </h3>

            <h5
              onClick={() => {
                setCurrentRidePanelOpen(!currentRidePanelOpen);
              }}
              className="absolute right-6 top-5 text-2xl"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
          </div>

          <div className="flex flex-col justify-between items-center">
            {/* vehicle and Driver details */}
            <div className="my-3 flex items-center justify-between w-full px-5 py-2">
              <img
                className="h-18"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlY8AdbzbAMTo8-CVmbJ83KmL0zMdus0ugWNUMePGgoZVIs7qXn4eQgxhvFkYhjaqK30o&usqp=CAU"
                alt="uber car"
              />
              <div className="">
                <h3 className="text-3xl font-medium">
                  {ride?.captain.fullname.firstname +
                    " " +
                    ride?.captain.fullname.lastname}
                </h3>
                <h5 className="text-2xl font-base">
                  {ride?.captain.vehicle.plate}
                </h5>
                <h5 className="text-2xl font-base">
                  {ride?.captain.vehicle.color}
                </h5>
              </div>
            </div>

            {/* destination and fare details */}
            <div className="w-full text-lg my-2">
              <div className="flex items-center justify-start py-2 px-3 gap-5 border-b-1 border-gray-300 rounded">
                <i class="ri-square-fill"></i>
                <div className="text-xl">
                  <h4 className="font-bold">{ride?.destination}</h4>
                </div>
              </div>
              <div className="flex items-center justify-start py-3 px-3 gap-5 border-b-1 border-gray-300 rounded">
                <i class="ri-bank-card-2-fill"></i>
                <div className="text-xl">
                  <h4 className="font-bold">&#8377;{ride?.fare}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* button */}
        <div className="w-full text-center text-xl mt-2">
          <button className="bg-blue-800 px-4 py-2 rounded-full text-white">
            Make a Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OngoingRide;
