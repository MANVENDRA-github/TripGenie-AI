import React from "react";
import { Compass, Sparkles, Map, Mountain, ArrowRight } from "lucide-react";

const suggestions = [
  { title: "Create a new trip", icon: Compass },
  { title: "Inspire me with travel ideas", icon: Sparkles },
  { title: "Discover hidden gems", icon: Map },
  { title: "Find adventure destinations", icon: Mountain },
];

function EmptyBoxState({ onSelectOption }: { onSelectOption: (value: string) => void }) {
  return (
    <div className="mt-2">
      <span className="kicker">Start here</span>
      <h2
        className="mt-3"
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.65rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          lineHeight: 1.1,
        }}
      >
        Let&apos;s plan your <span className="serif-em">next trip.</span>
      </h2>
      <p
        className="mt-2"
        style={{ color: "var(--app-muted)", fontSize: "0.92rem", lineHeight: 1.55 }}
      >
        Tell me where you&apos;re headed — or pick a starting point and I&apos;ll
        take it from there.
      </p>

      <div className="flex flex-col gap-2 mt-6">
        {suggestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectOption(item.title)}
              className="es-suggest"
            >
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
              <ArrowRight className="w-4 h-4 es-suggest-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EmptyBoxState;
