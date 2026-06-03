"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Calendar, MapPin, Users, Wallet, Plus, Trash2, Plane } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function MyTripsPage() {
  const { user } = useUser();

  // The owner is resolved server-side from the verified token; no userId is
  // sent from the client. Skip the query until the user is loaded.
  const trips = useQuery(api.trips.getUserTrips, user ? {} : "skip");
  
  const deleteTripMutation = useMutation(api.trips.deleteTrip);
  const [deletingId, setDeletingId] = useState<Id<"TripsTable"> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<Id<"TripsTable"> | null>(null);

  const initDelete = (e: React.MouseEvent, tripId: Id<"TripsTable">) => {
    e.preventDefault(); 
    e.stopPropagation();
    setConfirmDeleteId(tripId);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    try {
      await deleteTripMutation({ tripId: confirmDeleteId });
    } catch (err) {
      console.error("Failed to delete trip:", err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (trips === undefined) {
    return (
      <div className="page-loader" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="my-trips-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="my-trips-title text-foreground">My Trips</h1>
          <p className="my-trips-subtitle">Your saved travel itineraries</p>
        </div>
        <Link href="/create-new-trip" className="header-btn-primary" style={{ textDecoration: "none" }}>
          <Plus className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Plane className="w-6 h-6" />
          </div>
          <h2 className="empty-state-title">No trips yet</h2>
          <p className="empty-state-desc">
            Your saved itineraries will live here. Start with your first one.
          </p>
          <Link href="/create-new-trip" className="header-btn-primary">
            Plan a trip
          </Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <Link
              key={trip._id}
              href={`/trip/${trip._id}`}
              className="trip-card relative group"
            >
              <button
                onClick={(e) => initDelete(e, trip._id)}
                disabled={deletingId === trip._id}
                title="Delete Trip"
                className="absolute top-4 right-4 p-2 bg-destructive/10 text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
              >
                {deletingId === trip._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
              
              <h3 className="trip-card-dest pr-8">{trip.destination}</h3>
              <p className="trip-card-route">
                <MapPin className="w-3.5 h-3.5" style={{ display: "inline", marginRight: "0.25rem" }} />
                From {trip.origin}
              </p>
              <div className="trip-card-chips">
                <span className="trip-card-chip">
                  <Calendar className="w-3 h-3" style={{ display: "inline", marginRight: "0.2rem" }} />
                  {trip.days} Days
                </span>
                <span className="trip-card-chip">
                  <Wallet className="w-3 h-3" style={{ display: "inline", marginRight: "0.2rem" }} />
                  {trip.budget}
                </span>
                <span className="trip-card-chip">
                  <Users className="w-3 h-3" style={{ display: "inline", marginRight: "0.2rem" }} />
                  {trip.groupSize}
                </span>
              </div>
              <p className="trip-card-date">
                {new Date(trip.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ background: "rgba(22, 32, 31, 0.55)" }}
        >
          <div className="bg-card text-card-foreground border border-border w-full max-w-sm rounded-md p-6">
            <h3 className="text-2xl mb-2">Delete trip</h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Are you sure you want to delete this trip permanently? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-destructive hover:opacity-90 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-opacity disabled:opacity-50"
                disabled={deletingId !== null}
              >
                {deletingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
