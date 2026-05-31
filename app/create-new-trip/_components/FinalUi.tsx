"use client";

import React from "react";
import { Loader, Check } from "lucide-react";

function FinalUi({ generating }: { generating: boolean }) {
  return (
    <div className="gen-final">
      {generating ? (
        <>
          <Loader className="w-7 h-7 animate-spin" />
          <h2 className="gen-final-title">Composing your itinerary</h2>
          <p className="gen-final-desc">
            Selecting hotels, mapping activities and laying out each day. This
            takes a moment.
          </p>
        </>
      ) : (
        <>
          <Check className="w-7 h-7" />
          <h2 className="gen-final-title">Itinerary ready</h2>
          <p className="gen-final-desc">Taking you to your trip…</p>
        </>
      )}
    </div>
  );
}

export default FinalUi;
