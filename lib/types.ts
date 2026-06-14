/**
 * Shared shapes for the AI-generated trip plan.
 *
 * These mirror the JSON schema the model is instructed to return in
 * `app/api/aimodel/route.ts` (FINAL_PROMPT). The model output is not guaranteed
 * to be complete, so fields that the UI guards against (`field?.foo && ...`) are
 * marked optional here to keep the types honest about what may be missing.
 */

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  geo_coordinates?: GeoCoordinates;
  rating?: number;
  description?: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  geo_coordinates?: GeoCoordinates;
  place_address?: string;
  ticket_pricing?: string;
  time_travel_each_location?: string;
  best_time_to_visit?: string;
};

export type ItineraryDay = {
  day: number;
  day_plan?: string;
  best_time_to_visit_day?: string;
  activities?: Activity[];
};

export type TripPlan = {
  destination?: string;
  origin?: string;
  duration?: string;
  budget?: string;
  group_size?: string;
  hotels?: Hotel[];
  itinerary?: ItineraryDay[];
};

/** The full stringified payload persisted in `TripsTable.tripData`. */
export type TripData = {
  trip_plan?: TripPlan;
};
