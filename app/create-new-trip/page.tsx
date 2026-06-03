"use client";

import React from "react";
import ChatBox from "./_components/ChatBox";
import TripMap from "./_components/TripMap";

export default function CreateNewTrip() {
  return (
    <div className="planner-layout">
      <div className="planner-chat-panel">
        <ChatBox />
      </div>
      <div className="planner-map-panel">
        <TripMap />
      </div>
    </div>
  );
}
