"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
  // Upper bound on trip length for the user's plan; null means unlimited.
  maxDays?: number | null;
};

function SelectDaysUi({ onSelectedOption, maxDays = null }: Props) {
  const [days, setDays] = useState<number>(3);

  const atMax = maxDays != null && days >= maxDays;

  const increaseDays = () =>
    setDays((prev) => (maxDays != null && prev >= maxDays ? prev : prev + 1));
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

        <button
          className="gen-step-btn"
          onClick={increaseDays}
          disabled={atMax}
          aria-label="More days"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {atMax && (
        <p className="gen-cap-hint">
          Free plan covers trips up to {maxDays} days.{" "}
          <Link href="/pricing">Upgrade</Link> for longer journeys.
        </p>
      )}

      <button className="gen-confirm" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
}

export default SelectDaysUi;
