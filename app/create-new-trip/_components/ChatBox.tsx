"use client";

import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import { maxTripDaysFor } from "@/lib/plans";

import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  type?: "hotel" | "activity" | "destination";
};

type Props = {
  onMarkersUpdate?: (markers: MapMarker[]) => void;
};

function ChatBox({ onMarkersUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [finalTriggered, setFinalTriggered] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const saveTrip = useMutation(api.trips.saveTrip);
  const { user } = useUser();
  const router = useRouter();

  // Cap trip length based on the user's plan (free → 10 days, paid → unlimited).
  const userDetail = useContext(UserDetailContext);
  const maxDays = maxTripDaysFor(userDetail?.userDetails?.subscription);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onSend = useCallback(
    async (text?: string) => {
      const messageText = text ?? userInput;
      if (!messageText?.trim()) return;

      const newMsg: Message = { role: "user", content: messageText };
      const updatedMessages = [...messages, newMsg];

      setMessages(updatedMessages);
      setUserInput("");
      setLoading(true);

      try {
        const result = await axios.post("/api/aimodel", {
          messages: updatedMessages,
          isFinal: isFinal,
          maxDays,
        });

        if (result?.data?.error) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Error: ${result.data.error}. Please try again.` },
          ]);
          setLoading(false);
          return;
        }

        if (isFinal && result?.data?.trip_plan) {
          const tripData = result.data;
          const plan = tripData.trip_plan;

          try {
            const tripId = await saveTrip({
              userId: user?.primaryEmailAddress?.emailAddress ?? "",
              tripData: JSON.stringify(tripData),
              destination: plan.destination ?? "",
              origin: plan.origin ?? "",
              days: parseInt(plan.duration) || 3,
              budget: plan.budget ?? "",
              groupSize: plan.group_size ?? "",
            });

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
            onMarkersUpdate?.(markers);
            router.push(`/trip/${tripId}`);
          } catch (err) {
            console.error("Failed to save trip:", err);
            setGenerating(false);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "Trip generated but failed to save. Please try again.",
              },
            ]);
          }
        } else if (isFinal && !result?.data?.trip_plan) {
          // Final was sent but response didn't contain trip_plan
          console.error("Final response missing trip_plan:", result.data);
          setGenerating(false);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Failed to generate itinerary. Please try creating a new trip.",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: result?.data?.resp ?? "",
              ui: result?.data?.ui,
            },
          ]);
        }
      } catch (error: any) {
        console.error("API Error:", error);
        setGenerating(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, userInput, isFinal, user, saveTrip, router, onMarkersUpdate, maxDays]
  );

  // Only render interactive UI for the LAST assistant message that has a UI hint
  const getLastUiIndex = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant" && messages[i].ui && messages[i].ui !== "none") {
        return i;
      }
    }
    return -1;
  };

  const lastUiIndex = getLastUiIndex();

  const RenderGenerativeUI = (ui: string, isLatest: boolean) => {
    // Only render interactive components for the latest UI message
    if (!isLatest) return null;

    if (ui === "budget") return <BudgetUi onSelectedOption={(v: string) => onSend(v)} />;
    if (ui === "groupSize") return <GroupSizeUi onSelectedOption={(v: string) => onSend(v)} />;
    if (ui === "tripDuration")
      return <SelectDaysUi onSelectedOption={(v: string) => onSend(v)} maxDays={maxDays} />;
    if (ui === "final") return <FinalUi generating={generating} />;
    return null;
  };

  // Trigger final generation ONCE when AI sends "final" UI
  useEffect(() => {
    if (finalTriggered) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg?.ui === "final") {
      setFinalTriggered(true);
      setIsFinal(true);
      setGenerating(true);
      // Small delay to prevent race condition
      setTimeout(() => {
        const confirmMsg: Message = { role: "user", content: "Ok, Great! Generate my trip." };
        setMessages((prev) => [...prev, confirmMsg]);
        setLoading(true);

        axios
          .post("/api/aimodel", {
            messages: [...messages, confirmMsg],
            isFinal: true,
            maxDays,
          })
          .then((result) => {
            if (result?.data?.trip_plan) {
              const tripData = result.data;
              const plan = tripData.trip_plan;

              saveTrip({
                userId: user?.primaryEmailAddress?.emailAddress ?? "",
                tripData: JSON.stringify(tripData),
                destination: plan.destination ?? "",
                origin: plan.origin ?? "",
                days: parseInt(plan.duration) || 3,
                budget: plan.budget ?? "",
                groupSize: plan.group_size ?? "",
              })
                .then((tripId) => {
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
                  onMarkersUpdate?.(markers);
                  router.push(`/trip/${tripId}`);
                })
                .catch((err) => {
                  console.error("Save failed:", err);
                  setGenerating(false);
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "Failed to save trip. Try again." },
                  ]);
                });
            } else {
              console.error("No trip_plan in response:", result.data);
              setGenerating(false);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Failed to generate itinerary. Please try again." },
              ]);
            }
          })
          .catch((err) => {
            console.error("Final API error:", err);
            setGenerating(false);
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "Error generating trip. Please try again." },
            ]);
          })
          .finally(() => {
            setLoading(false);
          });
      }, 300);
    }
  }, [messages, finalTriggered]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && !generating) onSend();
    }
  };

  return (
    <div className="chat-container">
      {messages.length === 0 && !loading && (
        <div className="chat-empty-state">
          <EmptyBoxState onSelectOption={(v: string) => onSend(v)} />
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div className="chat-msg-user" key={index}>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ) : (
            <div className="chat-msg-ai" key={index}>
              <div className="chat-bubble">
                {msg.ui !== "final" && msg.content}
                {msg.ui &&
                  msg.ui !== "none" &&
                  RenderGenerativeUI(msg.ui, index === lastUiIndex)}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="chat-msg-ai">
            <div className="chat-bubble">
              <div className="chat-loading">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <input
            type="text"
            placeholder={generating ? "Generating your trip..." : "Type your message..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || generating}
          />
          <button
            className="chat-send-btn"
            onClick={() => onSend()}
            disabled={loading || generating || !userInput.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
