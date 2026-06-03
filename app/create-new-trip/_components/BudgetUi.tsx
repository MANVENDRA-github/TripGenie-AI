import React from "react";
import { Wallet, Coins, Gem } from "lucide-react";

export const SelectBudgetOptions = [
  { id: 1, title: "Cheap", desc: "Stay conscious of costs", icon: Wallet },
  { id: 2, title: "Moderate", desc: "Keep cost on the average side", icon: Coins },
  { id: 3, title: "Luxury", desc: "Don't worry about cost", icon: Gem },
];

function BudgetUi({ onSelectedOption }: any) {
  return (
    <div className="gen-grid gen-grid--3">
      {SelectBudgetOptions.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="gen-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectedOption(item.title + ":" + item.desc)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectedOption(item.title + ":" + item.desc);
              }
            }}
          >
            <Icon className="w-5 h-5 gen-card-icon" />
            <h2 className="gen-card-title">{item.title}</h2>
            <p className="gen-card-desc">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetUi;
