"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Avatar, Button, Card, Input, Spinner } from "@heroui/react";
import { Bot, Clock3, MessageSquare, Send, Sparkles, Zap } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type ChatSession = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
};

export default function CoachPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session-live",
      title: "Today plan optimization",
      updatedAt: "Just now",
      messages: [
        {
          role: "assistant",
          content:
            "I am your autonomous fitness agent. I can build plans, adjust nutrition, and optimize recovery in real time.",
        },
      ],
    },
    {
      id: "session-recovery",
      title: "Post leg-day recovery",
      updatedAt: "2h ago",
      messages: [
        { role: "user", content: "My legs are sore after squats." },
        {
          role: "assistant",
          content:
            "Reduce volume tomorrow, add 25 minutes low-intensity cycling, and prioritize hydration + 8h sleep.",
        },
      ],
    },
    {
      id: "session-meal",
      title: "High protein meal tuning",
      updatedAt: "Yesterday",
      messages: [
        { role: "user", content: "Can you raise my protein to 165g without increasing calories?" },
        {
          role: "assistant",
          content: "Swap lunch carbs for lean chicken and add Greek yogurt as snack. Net +22g protein.",
        },
      ],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("session-live");
  const [prompt, setPrompt] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, typing]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || sessions[0],
    [sessions, activeSessionId]
  );

  const suggestions = [
    "Build my 7-day fat-loss plan",
    "Optimize today's meals for 160g protein",
    "Adjust workout split for shoulder pain",
    "Give me a recovery protocol after leg day",
  ];

  const send = async () => {
    if (!prompt.trim()) return;
    const userMessage: Message = { role: "user", content: prompt };
    const next: Message[] = [...activeSession.messages, userMessage];
    
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSession.id
          ? { ...session, messages: next, updatedAt: "Just now" }
          : session
      )
    );
    setPrompt("");
    setTyping(true);

    try {
      // First, save the user message to the DB (optional but keeping original logic)
      await api.post("/resources/conversations", {
        title: activeSession.title,
        messages: next,
      });

      // Now call the AI Coach (Express -> Groq)
      const response = await fetch("http://localhost:5000/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const result = await response.json();

      if (result.success) {
        const assistantMessage: Message = { role: "assistant", content: result.data };
        setSessions((prev) =>
          prev.map((session) =>
            session.id === activeSession.id
              ? {
                  ...session,
                  updatedAt: "Just now",
                  messages: [...session.messages, assistantMessage],
                }
              : session
          )
        );
      }
    } catch (error) {
      console.error("Coach Error:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting right now. Please check if the AI agent is running." 
      };
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSession.id
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
    } finally {
      setTyping(false);
    }
  };

  const startNewChat = () => {
    const id = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: "New AI strategy chat",
      updatedAt: "Just now",
      messages: [
        {
          role: "assistant",
          content: "New session ready. Share your current goal and constraints, and I will generate a full strategy.",
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
  };

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <div>
        <p className="panel-heading">Agent Conversation</p>
        <h1 className="text-2xl font-semibold">AI Coach Agent</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Recent Chats</p>
              <Button size="sm" onClick={startNewChat} className="rounded-lg bg-violet-600 text-white">
                New
              </Button>
            </div>

            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    session.id === activeSession.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  <p className="text-sm font-semibold">{session.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <Clock3 size={12} />
                    {session.updatedAt}
                  </p>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="mb-2 text-xs text-slate-400">Agent status</p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Zap size={14} className="text-violet-300" />
                Active and learning from your recent logs
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] h-[75vh] overflow-hidden">
          <Card.Content className="flex h-full flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 flex-shrink-0">
              <div>
                <p className="text-sm font-semibold">{activeSession.title}</p>
                <p className="text-xs text-slate-400">Context-aware coach mode enabled</p>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <MessageSquare size={12} />
                {activeSession.messages.length} messages
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)]"
                >
                  <Sparkles size={12} />
                  {s}
                </Button>
              ))}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto rounded-xl bg-[var(--surface-soft)] p-3 custom-scrollbar min-h-0">
              {activeSession.messages.map((m, idx) => (
                <div key={`${m.role}-${idx}`} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-2xl p-3 text-sm ${
                      m.role === "assistant"
                        ? "bg-[var(--surface-strong)] text-slate-100"
                        : "bg-gradient-to-r from-violet-600 to-indigo-500 text-white"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <Avatar size="sm" className="bg-violet-600 text-white">
                        <Bot size={14} />
                      </Avatar>
                    )}
                    <p>{m.content}</p>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Spinner size="sm" /> Agent is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(139, 92, 246, 0.3);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(139, 92, 246, 0.5);
              }
            `}</style>

            <div className="mt-auto border-t border-[var(--border)] pt-3">
              <div className="relative w-full">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell the agent what to optimize..."
                fullWidth
                className="w-full bg-[var(--surface-soft)] pr-12"
              />
              <Button
                isIconOnly
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-violet-600 text-white"
                onClick={send}
                isDisabled={!prompt.trim() || typing}
              >
                <Send size={16} />
              </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
