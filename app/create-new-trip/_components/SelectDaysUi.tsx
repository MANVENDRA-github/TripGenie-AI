"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
};

function SelectDaysUi({ onSelectedOption }: Props) {
  const [days, setDays] = useState<number>(3);

  const increaseDays = () => {
    setDays((prev) => prev + 1);
  };

  const decreaseDays = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  const handleConfirm = () => {
    onSelectedOption(`${days} Days`);
  };

  return (
    <div className="bg-white rounded-xl p-5 mt-4 text-center max-w-sm">
      
      <h2 className="font-semibold text-lg mb-4">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center justify-center gap-6 mb-4">
        
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseDays}
          disabled={days === 1}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <span className="text-xl font-bold">
          {days} {days === 1 ? "Day" : "Days"}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={increaseDays}
        >
          <Plus className="w-4 h-4" />
        </Button>

      </div>

      <Button
        className="bg-primary text-white px-6"
        onClick={handleConfirm}
      >
        Confirm
      </Button>

    </div>
  );
}

export default SelectDaysUi;
