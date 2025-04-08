import { AdvancedMarker, AdvancedMarkerAnchorPoint, Pin } from "@vis.gl/react-google-maps";
import React from "react";
import { GooglePlace } from "../../data/pins";

type CustomMarkerProps = {
  pin: {
    google_place_id: string;
    pin_name: string;
    categories: string[];
    metadata: GooglePlace;
    lat: number;
    long: number;
  };
  onClick: () => void;
  hoveredMarkerId: string | null;
  setHoveredMarkerId: (id: string | null) => void;
  selectedMarkerId: string | null;
};

const categoryIconMap: Record<string, string> = {
  bar: "🍺",
  restaurant: "🍴",
  cafe: "☕",
  hotel: "🏨",
  park: "🌳",
  shopping_mall: "🛍️",
  supermarket: "🛒",
  museum: "🏛️",
  library: "📚",
  landmark: "🏰",
  tourist_attraction: "📸",
};

const CustomMarker: React.FC<CustomMarkerProps> = ({
  pin,
  onClick,
  hoveredMarkerId,
  setHoveredMarkerId,
  selectedMarkerId,
}) => {
  const isHovered = hoveredMarkerId === pin.google_place_id;
  const isSelected = selectedMarkerId === pin.google_place_id;

  const getIcon = () => {
    if (!pin.categories || pin.categories.length === 0) {
      return "";
    }

    for (const category of pin.categories) {
      if (categoryIconMap[category]) {
        return categoryIconMap[category];
      }
    }
    return "";
  };

  return (
    <AdvancedMarker
      position={{ lat: pin.lat, lng: pin.long }}
      onClick={onClick}
      onMouseEnter={() => setHoveredMarkerId(pin.google_place_id)}
      onMouseLeave={() => setHoveredMarkerId(null)}
      zIndex={isHovered || isSelected ? 1000 : 1}
      style={{
        transform: isHovered ? "scale(1.3)" : "scale(1)",
        transition: "all 200ms ease-in-out",
        transformOrigin: AdvancedMarkerAnchorPoint["BOTTOM"].join(" "),
      }}
    >
      <Pin
        background={isSelected ? "#ff0000" : "#0f9d58"}
        glyphColor="#ffffff"
        borderColor={isHovered ? "#000" : "#006425"}
      >
        {getIcon()}
      </Pin>
    </AdvancedMarker>
  );
};

export default CustomMarker;
