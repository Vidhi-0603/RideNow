import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import SelectedRidePanel from "../components/SelectedRidePanel";
import WaitingForDriver from "../components/WaitingForDriver";
import LogoutUser from "../components/LogoutUser";
import axiosInstance from "../utils/axiosInstance";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import RiderMap from "../components/RiderMap";
import { RideDataContext } from "../context/RideContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [selectedRidePanelOpen, setSelectedRidePanelOpen] = useState(false);
  const [ConfirmRide, setConfirmRide] = useState(false);
  const [waitingForDriverPanelOpen, setWaitingForDriverPanelOpen] =
    useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [nearbyCaptains, setNearbyCaptains] = useState([]);
  const [isrideStarted, setIsRideStarted] = useState(null);
  const [ride, setRide] = useState(null);
  const [showCaptains, setShowCaptains] = useState(false);
  const [captainFound, setCaptainFound] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const vehiclePanelCloseRef = useRef(null);
  const SelectedRidePanelRef = useRef(null);
  const SelectedRidePanelCloseRef = useRef(null);
  const WaitingForDriverPanelRef = useRef(null);
  const WaitingForDriverPanelCloseRef = useRef(null);

  const { setRideData } = useContext(RideDataContext);
  const { socket } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user, socket]);

  socket.on("ride-confirmed", (ride) => {
    setRideData(ride);
    setShowCaptains(false);
    setCaptainFound(true);
    setWaitingForDriverPanelOpen(true);
    setSelectedRidePanelOpen(false);
    setVehiclePanelOpen(false);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingForDriverPanelOpen(false);
    setRideData(ride);
    setRide(ride);
    setIsRideStarted(true);
    navigate("/ongoing-ride", {
      state: { ride, isRideStarted: true, pickupCoords, destinationCoords },
    });
  });

  // GSAP animations for mobile panels
  useGSAP(
    function () {
      if (window.innerWidth < 1024) {
        if (panelOpen) {
          gsap.to(panelRef.current, {
            height: "65%",
            padding: 24,
          });
          gsap.to(panelCloseRef.current, {
            opacity: 1,
          });
        } else {
          gsap.to(panelRef.current, {
            height: "0%",
            padding: 0,
          });
          gsap.to(panelCloseRef.current, {
            opacity: 0,
          });
        }
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (window.innerWidth < 1024) {
        if (vehiclePanelOpen) {
          gsap.to(vehiclePanelRef.current, {
            transform: "translateY(0)",
          });
          gsap.to(vehiclePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        } else {
          gsap.to(vehiclePanelRef.current, {
            transform: "translateY(100%)",
          });
          gsap.to(vehiclePanelCloseRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        }
      }

      // Desktop close button animation for vehicle panel
      if (window.innerWidth >= 1024) {
        if (vehiclePanelOpen && vehiclePanelCloseRef.current) {
          gsap.to(vehiclePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        } else if (vehiclePanelCloseRef.current) {
          gsap.to(vehiclePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        }
      }
    },
    [vehiclePanelOpen]
  );

  useGSAP(
    function () {
      if (window.innerWidth < 1024) {
        if (selectedRidePanelOpen) {
          gsap.to(SelectedRidePanelRef.current, {
            transform: "translateY(0)",
          });
          gsap.to(SelectedRidePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        } else {
          gsap.to(SelectedRidePanelRef.current, {
            transform: "translateY(100%)",
          });
          gsap.to(SelectedRidePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        }
      }

      // Desktop close button animation for selected ride panel
      if (window.innerWidth >= 1024) {
        if (selectedRidePanelOpen) {
          gsap.to(SelectedRidePanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        } else if (SelectedRidePanelCloseRef.current) {
          gsap.to(SelectedRidePanelCloseRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        }
      }
    },
    [selectedRidePanelOpen]
  );

  // New GSAP animation for waiting for driver panel
  useGSAP(
    function () {
      if (window.innerWidth < 1024) {
        if (waitingForDriverPanelOpen) {
          gsap.to(WaitingForDriverPanelRef.current, {
            transform: "translateY(0)",
          });
        } else {
          gsap.to(WaitingForDriverPanelRef.current, {
            transform: "translateY(100%)",
          });
        }
      }

      // Desktop close button animation for waiting for driver panel
      if (window.innerWidth >= 1024) {
        if (
          waitingForDriverPanelOpen &&
          WaitingForDriverPanelCloseRef.current
        ) {
          gsap.to(WaitingForDriverPanelCloseRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        } else if (WaitingForDriverPanelCloseRef.current) {
          gsap.to(WaitingForDriverPanelCloseRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        }
      }
    },
    [waitingForDriverPanelOpen]
  );

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axiosInstance.get("/maps/get-suggestions", {
        params: { address: e.target.value },
      });
      setPickupSuggestions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axiosInstance.get("/maps/get-suggestions", {
        params: { address: e.target.value },
      });
      setDestinationSuggestions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function findTrip() {
    setVehiclePanelOpen(true);
    setPanelOpen(false);

    const response = await axiosInstance.get("/ride/get-fare", {
      params: { pickupCoords, destinationCoords },
    });
    setFare(response.data);
  }

  async function createRide() {
    const response = await axiosInstance.post("/ride/create-ride", {
      pickup,
      destination,
      vehicleType,
      pickupCoords,
      destinationCoords,
    });
    setNearbyCaptains(response.data.captains || []);
    setConfirmRide(true);
    setShowCaptains(true);
    setRideData(response.data.ride);
  }

  // Determine which panel content to show on desktop
  const getCurrentPanelContent = () => {
    if (waitingForDriverPanelOpen) {
      return (
        <WaitingForDriver
          waitingForDriverPanelOpen={waitingForDriverPanelOpen}
          setWaitingForDriverPanelOpen={setWaitingForDriverPanelOpen}
          WaitingForDriverPanelCloseRef={WaitingForDriverPanelCloseRef}
          WaitingForDriverPanelRef={WaitingForDriverPanelRef}
        />
      );
    }
    if (selectedRidePanelOpen) {
      return (
        <SelectedRidePanel
          SelectedRidePanelCloseRef={SelectedRidePanelCloseRef}
          setSelectedRidePanelOpen={setSelectedRidePanelOpen}
          setConfirmRide={setConfirmRide}
          ConfirmRide={ConfirmRide}
          setWaitingForDriverPanelOpen={setWaitingForDriverPanelOpen}
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
        />
      );
    }
    if (vehiclePanelOpen) {
      return (
        <VehiclePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          vehiclePanelCloseRef={vehiclePanelCloseRef}
          setSelectedRidePanelOpen={setSelectedRidePanelOpen}
          fare={fare}
          selectVehicle={setVehicleType}
        />
      );
    }
    if (panelOpen) {
      return (
        <div className="h-full px-2 overflow-auto">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
            setPickupCoords={setPickupCoords}
            setDestinationCoords={setDestinationCoords}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Mobile & Tablet Layout (< 1024px) */}
      <div className="h-screen relative overflow-hidden lg:hidden">
        {/* Uber logo and Logout button */}
        <div className="flex w-full p-2 items-center justify-between absolute top-0 pointer-events-none">
          <div className="flex w-full items-center justify-between pointer-events-auto">
            <LogoutUser panelOpen={panelOpen} />
          </div>
        </div>

        {/* Map */}
        <div className="h-screen w-screen">
          <RiderMap
            user={user}
            ride={ride}
            nearbyCaptains={nearbyCaptains}
            showCaptains={showCaptains}
            captainFound={captainFound}
            isrideStarted={isrideStarted}
            pickupCoords={pickupCoords}
            destinationCoords={destinationCoords}
            ConfirmRide={ConfirmRide}
            style={{ paddingTop: "80px" }}
          />
        </div>

        {/* Search Panel */}
        <div className="flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none">
          <div className="h-[35%] p-4 bg-white relative pointer-events-auto">
            <h5
              ref={panelCloseRef}
              onClick={() => {
                setPanelOpen(false);
              }}
              className="absolute right-6 top-6 text-2xl opacity-0"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-2xl font-semibold">Find a Trip</h4>

            <form
              className="relative pt-3 pb-3"
              onSubmit={(e) => {
                submitHandler(e);
              }}
            >
              <input
                type="text"
                className="bg-[#eee] px-5 py-2 text-lg rounded-lg w-full"
                placeholder="Enter a pick up location"
                value={pickup}
                onChange={handlePickupChange}
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("pickup");
                }}
              />
              <input
                type="text"
                className="bg-[#eee] px-5 py-2 text-lg rounded-lg w-full mt-3"
                placeholder="Enter your destination"
                value={destination}
                onChange={handleDestinationChange}
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("destination");
                }}
              />
            </form>
            <button
              onClick={findTrip}
              className="bg-black text-white text-xl text-bold px-4 py-2 rounded-lg mt-3 w-full"
            >
              Find Trip
            </button>
          </div>

          {/* Location Suggestions */}
          <div ref={panelRef} className="bg-white h-0 pointer-events-auto">
            <LocationSearchPanel
              suggestions={
                activeField === "pickup"
                  ? pickupSuggestions
                  : destinationSuggestions
              }
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
              setPickupCoords={setPickupCoords}
              setDestinationCoords={setDestinationCoords}
            />
          </div>
        </div>

        {/* Mobile Panels */}
        <div
          ref={vehiclePanelRef}
          className="absolute bottom-0 translate-y-full bg-white py-5 px-3 w-full"
        >
          <VehiclePanel
            setVehiclePanelOpen={setVehiclePanelOpen}
            vehiclePanelCloseRef={vehiclePanelCloseRef}
            setSelectedRidePanelOpen={setSelectedRidePanelOpen}
            fare={fare}
            selectVehicle={setVehicleType}
          />
        </div>

        {selectedRidePanelOpen && (
          <div
            ref={SelectedRidePanelRef}
            className="absolute bottom-0 bg-white py-5 px-3 w-full"
            style={{ transform: "translateY(100%)" }}
          >
            <SelectedRidePanel
              SelectedRidePanelCloseRef={SelectedRidePanelCloseRef}
              setSelectedRidePanelOpen={setSelectedRidePanelOpen}
              setConfirmRide={setConfirmRide}
              ConfirmRide={ConfirmRide}
              setWaitingForDriverPanelOpen={setWaitingForDriverPanelOpen}
              createRide={createRide}
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
            />
          </div>
        )}

        <div
          ref={WaitingForDriverPanelRef}
          className="absolute bottom-0 translate-y-full bg-white py-5 px-3 w-full"
        >
          <WaitingForDriver
            waitingForDriverPanelOpen={waitingForDriverPanelOpen}
            setWaitingForDriverPanelOpen={setWaitingForDriverPanelOpen}
            WaitingForDriverPanelCloseRef={WaitingForDriverPanelCloseRef}
            WaitingForDriverPanelRef={WaitingForDriverPanelRef}
          />
        </div>
      </div>

      {/* Desktop Layout (>= 1024px) */}
      <div className="hidden lg:flex h-screen relative overflow-hidden">
        {/* Header for Desktop - Full Width */}

        {/* Left Side - Map */}
        <div className="flex-1 relative">
          {/* Map */}
          <div className="h-full w-full">
            <RiderMap
              user={user}
              ride={ride}
              nearbyCaptains={nearbyCaptains}
              showCaptains={showCaptains}
              captainFound={captainFound}
              isrideStarted={isrideStarted}
              pickupCoords={pickupCoords}
              destinationCoords={destinationCoords}
              ConfirmRide={ConfirmRide}
              style={{ paddingTop: "80px" }}
            />
          </div>
        </div>

        {/* Right Side - Panels */}
        <div className="w-full lg:w-96 xl:w-[450px] 2xl:w-[500px] bg-white shadow-lg overflow-hidden flex flex-col relative">
          {/* Default Search Panel */}
          <div className="absolute top-0 left-0 right-0 flex p-4 items-center justify-between">
            <LogoutUser panelOpen={panelOpen} />
          </div>
          <div className="mt-13 p-6 border-b flex-shrink-0">
            <h4 className="text-2xl font-semibold mb-4">Find a Trip</h4>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                submitHandler(e);
              }}
            >
              <input
                type="text"
                className="bg-[#eee] px-5 py-3 text-lg rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a pick up location"
                value={pickup}
                onChange={handlePickupChange}
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("pickup");
                }}
              />
              <input
                type="text"
                className="bg-[#eee] px-5 py-3 text-lg rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your destination"
                value={destination}
                onChange={handleDestinationChange}
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField("destination");
                }}
              />
              <button
                onClick={findTrip}
                type="button"
                className="bg-black text-white text-xl font-bold px-4 py-3 rounded-lg w-full hover:bg-gray-800 transition-colors"
              >
                Find Trip
              </button>
            </form>
          </div>

          {/* Dynamic Panel Content */}
          <div className="flex-1 overflow-auto">{getCurrentPanelContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
