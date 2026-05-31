"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Ticket,
  Star,
  Building2,
  Sunrise,
  Search,
  AlertTriangle,
} from "lucide-react";
import dynamic from "next/dynamic";

const TripMapInner = dynamic(
  () => import("@/app/create-new-trip/_components/TripMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="trip-map-container">
        <div className="page-loader">
          <div className="spinner" />
        </div>
      </div>
    ),
  }
);

const FALLBACK_HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=600&q=80",
];

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
          <div className="empty-state-icon">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="empty-state-title">Trip not found</h2>
          <p className="empty-state-desc">
            This trip may have been deleted, or the link is invalid.
          </p>
          <a href="/my-trips" className="header-btn-primary">
            Back to my trips
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
          <div className="empty-state-icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
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
          <div className="empty-state-icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
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
      {/* Masthead */}
      <header className="trip-header-card">
        <div className="trip-kicker">Your itinerary</div>
        <div className="trip-route">
          <span className="trip-route-city">{plan.origin || trip.origin}</span>
          <span className="trip-route-arrow">→</span>
          <span className="trip-route-city">
            {plan.destination || trip.destination}
          </span>
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
      </header>

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
            <Building2 className="w-5 h-5" />
            Where to stay
          </h2>
          <div className="hotels-grid">
            {plan.hotels.map((hotel: any, i: number) => (
              <div key={i} className="hotel-card">
                <div
                  className="hotel-img"
                  style={{
                    backgroundImage: `url(${
                      FALLBACK_HOTEL_IMAGES[i % FALLBACK_HOTEL_IMAGES.length]
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.hotel_name}</h3>
                  <p className="hotel-address">{hotel.hotel_address}</p>
                  {hotel.description && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--ink-70)",
                        marginBottom: "0.75rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {hotel.description}
                    </p>
                  )}
                  <div className="hotel-meta">
                    <span className="hotel-price">
                      {hotel.price_per_night}
                      <span>/night</span>
                    </span>
                    <span className="hotel-rating">
                      <Star className="w-4 h-4" fill="currentColor" />
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
            <Calendar className="w-5 h-5" />
            Day by day
          </h2>

          {plan.itinerary.map((day: any, dayIndex: number) => (
            <div key={dayIndex} className="day-section">
              <div className="day-header">
                <span className="day-badge">Day {day.day}</span>
                {day.best_time_to_visit_day && (
                  <span className="day-best-time">
                    Best time · {day.best_time_to_visit_day}
                  </span>
                )}
              </div>
              {day.day_plan && <p className="day-plan-text">{day.day_plan}</p>}

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
                            <Sunrise className="w-3.5 h-3.5" />
                            {activity.best_time_to_visit}
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
