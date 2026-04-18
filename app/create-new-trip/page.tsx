"use client";

import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import TripMap from "./_components/TripMap";

type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  type?: "hotel" | "activity" | "destination";
};

export default function CreateNewTrip() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  return (
    <div className="planner-layout">
      <div className="planner-chat-panel">
        <ChatBox onMarkersUpdate={setMarkers} />
      </div>
      <div className="planner-map-panel">
        <TripMap markers={markers} />
      </div>
    </div>
  );
}