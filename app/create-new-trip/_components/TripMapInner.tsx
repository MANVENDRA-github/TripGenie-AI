"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";

// Fix default marker icon issue with webpack
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

function TripMapInner({ markers = [], center = [20, 0], zoom = 2, className = "" }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (markers.length === 0) return;

    const bounds = L.latLngBounds([]);

    markers.forEach((m) => {
      if (!m.lat || !m.lng || isNaN(m.lat) || isNaN(m.lng)) return;

      // On-palette marker triad: teal hotels, gold activities, rust destination.
      const color =
        m.type === "hotel" ? "#1f6e6a" :
        m.type === "activity" ? "#c78b2c" :
        "#b0513a";

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([m.lat, m.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${m.label}</strong>`);

      bounds.extend([m.lat, m.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: "300px" }}
    />
  );
}

export default TripMapInner;
