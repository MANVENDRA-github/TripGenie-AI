"use client";

import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [finalTriggered, setFinalTriggered] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const saveTrip = useMutation(api.trips.saveTrip);
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

  const appendAssistant = useCallback((content: string, ui?: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content, ui }]);
  }, []);

  // Single source of truth for final generation: request the full plan, persist
  // it, then navigate to the trip page.
  const generateTrip = useCallback(
    async (history: Message[]) => {
      setLoading(true);
      try {
        const result = await axios.post("/api/aimodel", {
          messages: history,
          isFinal: true,
          maxDays,
        });

        const plan = result?.data?.trip_plan;
        if (!plan) {
          console.error("Final response missing trip_plan:", result?.data);
          setGenerating(false);
          appendAssistant("Failed to generate itinerary. Please try creating a new trip.");
          return;
        }

        const tripId = await saveTrip({
          tripData: JSON.stringify(result.data),
          destination: plan.destination ?? "",
          origin: plan.origin ?? "",
          days: parseInt(plan.duration) || 3,
          budget: plan.budget ?? "",
          groupSize: plan.group_size ?? "",
        });

        router.push(`/trip/${tripId}`);
      } catch (err) {
        console.error("Trip generation failed:", err);
        setGenerating(false);
        appendAssistant("Something went wrong while generating your trip. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [maxDays, saveTrip, router, appendAssistant]
  );

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
          isFinal: false,
          maxDays,
        });

        if (result?.data?.error) {
          appendAssistant(`Error: ${result.data.error}. Please try again.`);
          return;
        }

        appendAssistant(result?.data?.resp ?? "", result?.data?.ui);
      } catch (error) {
        console.error("API Error:", error);
        appendAssistant("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [messages, userInput, maxDays, appendAssistant]
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

  // Trigger final generation ONCE when the assistant sends the "final" UI hint.
  useEffect(() => {
    if (finalTriggered) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg?.ui === "final") {
      setFinalTriggered(true);
      setGenerating(true);
      const confirmMsg: Message = { role: "user", content: "Ok, Great! Generate my trip." };
      const history = [...messages, confirmMsg];
      setMessages(history);
      generateTrip(history);
    }
  }, [messages, finalTriggered, generateTrip]);

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
