"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Calendar, MapPin, Users, Wallet, Clock, Ticket, Star, Building2 } from "lucide-react";
import dynamic from "next/dynamic";

const TripMapInner = dynamic(
  () => import("@/app/create-new-trip/_components/TripMapInner"),
  { ssr: false, loading: () => <div className="trip-map-container"><div className="page-loader"><div className="spinner" /></div></div> }
);

type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  type?: "hotel" | "activity" | "destination";
};

export default function TripPage() {
  const params = useParams();
  const tripId = params.id as string;

  const trip = useQuery(api.trips.getTripById, {
    tripId: tripId as Id<"TripsTable">,
  });

  if (trip === undefined) {
    return (
      <div className="page-loader" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-page">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2 className="empty-state-title">Trip not found</h2>
          <p className="empty-state-desc">This trip may have been deleted or the link is invalid.</p>
          <a href="/my-trips" className="header-btn-primary" style={{ textDecoration: "none" }}>
            Back to My Trips
          </a>
        </div>
      </div>
    );
  }

  let tripData: any = {};
  try {
    tripData = JSON.parse(trip.tripData);
  } catch {
    return (
      <div className="trip-page">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Error loading trip</h2>
          <p className="empty-state-desc">Trip data appears to be corrupted.</p>
        </div>
      </div>
    );
  }

  const plan = tripData.trip_plan;
  if (!plan) {
    return (
      <div className="trip-page">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Invalid trip data</h2>
        </div>
      </div>
    );
  }

  // Build markers
  const markers: MapMarker[] = [];
  plan.hotels?.forEach((h: any) => {
    if (h.geo_coordinates?.latitude && h.geo_coordinates?.longitude) {
      markers.push({
        lat: h.geo_coordinates.latitude,
        lng: h.geo_coordinates.longitude,
        label: h.hotel_name,
        type: "hotel",
      });
    }
  });
  plan.itinerary?.forEach((day: any) => {
    day.activities?.forEach((a: any) => {
      if (a.geo_coordinates?.latitude && a.geo_coordinates?.longitude) {
        markers.push({
          lat: a.geo_coordinates.latitude,
          lng: a.geo_coordinates.longitude,
          label: a.place_name,
          type: "activity",
        });
      }
    });
  });

  return (
    <div className="trip-page">
      {/* Trip Header */}
      <div className="trip-header-card">
        <div className="trip-route">
          <span className="trip-route-city">{plan.origin || trip.origin}</span>
          <span className="trip-route-arrow">→</span>
          <span className="trip-route-city">{plan.destination || trip.destination}</span>
        </div>
        <div className="trip-meta">
          <span className="trip-meta-item">
            <Calendar className="w-4 h-4" />
            {plan.duration || `${trip.days} Days`}
          </span>
          <span className="trip-meta-item">
            <Wallet className="w-4 h-4" />
            {plan.budget || trip.budget}
          </span>
          <span className="trip-meta-item">
            <Users className="w-4 h-4" />
            {plan.group_size || trip.groupSize}
          </span>
        </div>
      </div>

      {/* Map */}
      {markers.length > 0 && (
        <div className="trip-map-container">
          <TripMapInner markers={markers} />
        </div>
      )}

      {/* Hotels */}
      {plan.hotels && plan.hotels.length > 0 && (
        <section>
          <h2 className="trip-section-title">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Hotel Recommendations
          </h2>
          <div className="hotels-grid">
            {plan.hotels.map((hotel: any, i: number) => (
              <div key={i} className="hotel-card">
                <div className="hotel-img">🏨</div>
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.hotel_name}</h3>
                  <p className="hotel-address">{hotel.hotel_address}</p>
                  {hotel.description && (
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                      {hotel.description}
                    </p>
                  )}
                  <div className="hotel-meta">
                    <span className="hotel-price">{hotel.price_per_night}/night</span>
                    <span className="hotel-rating">
                      <Star className="w-4 h-4" fill="#eab308" />
                      {hotel.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Day-by-Day Itinerary */}
      {plan.itinerary && plan.itinerary.length > 0 && (
        <section>
          <h2 className="trip-section-title">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Day-by-Day Itinerary
          </h2>

          {plan.itinerary.map((day: any, dayIndex: number) => (
            <div key={dayIndex} className="day-section">
              <div className="day-header">
                <span className="day-badge">Day {day.day}</span>
                {day.best_time_to_visit_day && (
                  <span className="day-best-time">🌤 Best Time: {day.best_time_to_visit_day}</span>
                )}
              </div>
              {day.day_plan && (
                <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "1rem", marginLeft: "2rem" }}>
                  {day.day_plan}
                </p>
              )}

              <div className="activities-timeline">
                {day.activities?.map((activity: any, actIdx: number) => (
                  <div key={actIdx} className="activity-item">
                    <div className="activity-card">
                      <h4 className="activity-name">{activity.place_name}</h4>
                      <p className="activity-details">{activity.place_details}</p>
                      <div className="activity-chips">
                        {activity.ticket_pricing && (
                          <span className="activity-chip cost">
                            <Ticket className="w-3.5 h-3.5" />
                            {activity.ticket_pricing}
                          </span>
                        )}
                        {activity.time_travel_each_location && (
                          <span className="activity-chip time">
                            <Clock className="w-3.5 h-3.5" />
                            {activity.time_travel_each_location}
                          </span>
                        )}
                        {activity.best_time_to_visit && (
                          <span className="activity-chip">
                            🌅 {activity.best_time_to_visit}
                          </span>
                        )}
                        {activity.place_address && (
                          <span className="activity-chip">
                            <MapPin className="w-3.5 h-3.5" />
                            {activity.place_address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
