"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
};

function SelectDaysUi({ onSelectedOption }: Props) {
  const [days, setDays] = useState<number>(3);

  const increaseDays = () => setDays((prev) => prev + 1);
  const decreaseDays = () => setDays((prev) => (prev > 1 ? prev - 1 : prev));
  const handleConfirm = () => onSelectedOption(`${days} Days`);

  return (
    <div className="gen-panel">
      <h2 className="gen-panel-title">How many days do you want to travel?</h2>

      <div className="gen-days-row">
        <button
          className="gen-step-btn"
          onClick={decreaseDays}
          disabled={days === 1}
          aria-label="Fewer days"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="gen-days-num">
          {days} {days === 1 ? "Day" : "Days"}
        </span>

        <button className="gen-step-btn" onClick={increaseDays} aria-label="More days">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button className="gen-confirm" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
}

export default SelectDaysUi;
