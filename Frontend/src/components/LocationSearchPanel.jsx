import React from "react";

const LocationSearchPanel = (props) => {
  const handleSuggestionClick = (suggestion) => {
    if (props.activeField === "pickup") {
      props.setPickup(suggestion.description);
      props.setPickupCoords({ lat: suggestion.lat, lng: suggestion.lng });
    } else if (props.activeField === "destination") {
      props.setDestination(suggestion.description);
      props.setDestinationCoords({
        lat: suggestion.lat,
        lng: suggestion.lng,
      });
    }
  };

  return (
    <div>
      {props.suggestions.map(function (elem, idx) {
        return (
          <div
            key={idx}
            onClick={() => handleSuggestionClick(elem)}
            className="flex gap-4 border-2 p-2 active:border-black border-gray-50 rounded-xl items-center justify-start"
          >
            <div className="w-[20%]">
              <h2 className="bg-[#eee] h-8 flex items-center justify-center w-14 rounded-full">
                <i className="ri-map-pin-fill"></i>
              </h2>
            </div>
            <div>
              <h4 className="font-medium w-[80%]">{elem.description}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
