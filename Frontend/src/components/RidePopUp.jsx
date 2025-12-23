import React, { useContext } from "react";
import { RideDataContext } from "../context/RideContext";

const RidePopUp = (props) => {
  const { rideData } = useContext(RideDataContext);
  return (
    <div>
      <div>
        <h3 className="text-xl font-medium text-center mb-3">
          New Ride available...
        </h3>
        <h5
          onClick={() => {
            props.setRidePopUpPanelOpen(!props.ridePopUpPanelOpen);
          }}
          className="absolute right-6 top-6 text-2xl"
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h5>
        <div className="flex flex-col justify-between items-center">
          <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4 w-full">
            <div className="flex items-center gap-3">
              <img
                className="h-12 rounded-full object-cover w-12"
                src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                alt=""
              />
              <h2 className="text-xl font-medium">
                {rideData?.user?.fullname?.firstname +
                  " " +
                  rideData?.user?.fullname?.lastname}
              </h2>
            </div>
          </div>
          {/* details */}
          <div className="w-full text-lg my-2">
            <div className="flex items-center justify-between py-2 px-1 gap-5 border-y-1 border-gray-300 rounded">
              <div className="text-lg flex itens-center justify-start gap-5 w-75">
                <div className="flex items-center">
                  <i className="ri-map-pin-fill"></i>
                </div>
                <div>
                  <p className="text-md font-medium text-gray-400">Pick Up</p>
                  <h5 className="font-medium text-2sm">{rideData?.pickup}</h5>
                </div>
              </div>
              <div className="text-md font-medium w-23">
                <h3>{props.pickupData?.distance.text}</h3>
                <p>{props.pickupData?.duration.text}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 px-1 gap-2 border-b-1 border-gray-300 rounded">
              <div className="text-lg flex itens-center justify-start gap-5 w-75">
                <div className="flex items-center">
                  <i className="ri-square-fill"></i>
                </div>
                <div>
                  <p className="text-md font-medium text-gray-400">Drop Off</p>
                  <h4 className="font-medium text-2sm">
                    {rideData?.destination}
                  </h4>
                </div>
              </div>
              <div className="text-md font-medium w-23">
                <h3>{props.destinationData?.distance.text}</h3>
                <p>{props.destinationData?.duration.text}</p>
              </div>
            </div>
            <div className="flex items-center justify-start py-3 px-1 gap-5 border-b-1 border-gray-300 rounded">
              <div className="flex items-center">
                <i className="ri-bank-card-2-fill"></i>
              </div>{" "}
              <div className="text-lg">
                <h4 className="font-bold">&#8377; {rideData?.fare}</h4>
              </div>
            </div>
          </div>

          {/* confirm button */}
          <div className="w-full flex items-center justify-between mt-2">
            <button className="bg-red-800 px-4 py-1 rounded-full text-white">
              Decline Ride
            </button>

            <button
              onClick={() => {
                props.setConfirmRidePopUpPanelOpen(true);
              }}
              className="bg-green-800 px-4 py-1 rounded-full text-white"
            >
              Accept Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
