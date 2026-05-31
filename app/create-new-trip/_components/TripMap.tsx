"use client";

import dynamic from "next/dynamic";

const TripMapInner = dynamic(() => import("./TripMapInner"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper-deep)" }}>
      <div className="spinner" />
    </div>
  ),
});

type Marker = {
  lat: number;
  lng: number;
  label: string;
  type?: "hotel" | "activity" | "destination";
};

type Props = {
  markers?: Marker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
};

export default function TripMap(props: Props) {
  return <TripMapInner {...props} />;
}
