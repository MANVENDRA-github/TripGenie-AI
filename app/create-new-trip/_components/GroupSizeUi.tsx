import React from "react";
import { User, Heart, Home, Users } from "lucide-react";

export const SelectTravelesList = [
  { id: 1, title: "Just Me", desc: "A sole traveler", icon: User, people: "1" },
  { id: 2, title: "A Couple", desc: "Two in tandem", icon: Heart, people: "2 People" },
  { id: 3, title: "Family", desc: "A small crew", icon: Home, people: "3 to 5 People" },
  { id: 4, title: "Friends", desc: "Thrill-seekers", icon: Users, people: "5 to 10 People" },
];

function GroupSizeUi({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
  return (
    <div className="gen-grid gen-grid--4">
      {SelectTravelesList.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="gen-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectedOption(item.title)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectedOption(item.title);
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

export default GroupSizeUi;
