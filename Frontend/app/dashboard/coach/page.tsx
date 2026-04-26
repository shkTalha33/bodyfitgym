"use client";

import { useMemo, useState, useRef, useEffect, useCallback, type MouseEvent } from "react";
import { CoachSidebarSkeleton } from "@/components/app-skeletons";
import AiStructuredResponse from "@/components/ai-structured-response";
import ProfilePreferencesModal from "@/components/profile-preferences-modal";
import api from "@/lib/api";
import { fetchProfileFresh } from "@/lib/fetch-profile";
import { setAuthUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Avatar, Button, Card, Input } from "@heroui/react";
import { Bot, Clock3, Send, Sparkles, Trash2, Zap } from "lucide-react";

const COACH_NAME = "Body Fit Coach";
const COACH_TAGLINE = "Your AI training partner";

type Message = { role: "user" | "assistant"; content: string };

/** Matches backend COACH_RECENT_MESSAGE_CAP — only this window is sent to the model. */
const RECENT_MESSAGES_FOR_MODEL = 12;

/** Sidebar: load only this many rows from the API (backend defaults to 20 for conversations). */
const SIDEBAR_CONVERSATIONS_LIMIT = 20;

type ChatSession = {
  /** Stable client id (Mongo id when loaded from API, or local-* for new chats). */
  id: string;
  /** Set after first successful save to `/resources/conversations`. */
  remoteId?: string;
  title: string;
  updatedAt: string;
  messages: Message[];
  /** Optional compressed prior context for long threads (persisted when provided). */
  summary?: string;
};

/** Sidebar / header: first real user line, not a generic marketing title. */
function deriveChatTitle(messages: Message[], maxLen = 54): string {
  const u = messages.find((m) => m.role === "user" && typeof m.content === "string" && m.content.trim());
  if (!u) return "";
  let t = u.content.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length > maxLen) return `${t.slice(0, maxLen - 1).trimEnd()}\u2026`;
  return t;
}

function chatListTitle(session: ChatSession): string {
  return deriveChatTitle(session.messages) || session.title.trim() || "New chat";
}

function formatUpdatedLabel(iso: string | undefined): string {
  if (!iso) return "Just now";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "Just now";
  const diff = Date.now() - t;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}

function welcomeMessages(): Message[] {
  return [
    {
      role: "assistant",
      content:
        "I am your fitness coach. I use your saved profile and our recent messages for continuity—tell me what you want to work on next.",
    },
  ];
}

function newLocalSession(): ChatSession {
  const id = `local-${Date.now()}`;
  return {
    id,
    title: "New chat",
    updatedAt: "Just now",
    summary: "",
    messages: welcomeMessages(),
  };
}

export default function CoachPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [sessionsHydrated, setSessionsHydrated] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, typing]);

  /** If the active chat was removed, switch to the first remaining session. */
  useEffect(() => {
    if (sessions.length === 0) return;
    if (!sessions.some((s) => s.id === activeSessionId)) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<unknown[]>(
          `/resources/conversations?limit=${SIDEBAR_CONVERSATIONS_LIMIT}`
        );
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          const s = newLocalSession();
          setSessions([s]);
          setActiveSessionId(s.id);
          setSessionsHydrated(true);
          return;
        }
        const mapped: ChatSession[] = data.map((doc) => {
          const d = doc as Record<string, unknown>;
          const id = String(d._id ?? "");
          const rawMsgs = Array.isArray(d.messages) ? d.messages : [];
          const messages: Message[] = rawMsgs
            .map((entry) => {
              const m = entry as Record<string, unknown>;
              const role = m.role === "user" || m.role === "assistant" ? m.role : null;
              const content = typeof m.content === "string" ? m.content : "";
              if (!role) return null;
              return { role, content };
            })
            .filter((x): x is Message => x !== null);
          const storedTitle = typeof d.title === "string" ? d.title.trim() : "";
          const resolvedTitle =
            deriveChatTitle(messages) || (storedTitle ? storedTitle : "Chat");
          return {
            id,
            remoteId: id,
            title: resolvedTitle,
            updatedAt: formatUpdatedLabel(typeof d.updatedAt === "string" ? d.updatedAt : undefined),
            summary: typeof d.summary === "string" ? d.summary : "",
            messages: messages.length ? messages : welcomeMessages(),
          };
        });
        setSessions(mapped);
        setActiveSessionId(mapped[0].id);
      } catch {
        if (!cancelled) {
          const s = newLocalSession();
          setSessions([s]);
          setActiveSessionId(s.id);
        }
      } finally {
        if (!cancelled) setSessionsHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || sessions[0],
    [sessions, activeSessionId]
  );

  /** Quick prompts only before the first user message in this thread (new chat). */
  const showStarterSuggestions = useMemo(
    () => (activeSession ? !activeSession.messages.some((m) => m.role === "user") : false),
    [activeSession]
  );

  const suggestions = [
    "Build my 7-day fat-loss plan",
    "Optimize today's meals for 160g protein",
    "Adjust workout split for shoulder pain",
    "Give me a recovery protocol after leg day",
  ];

  const persistConversation = useCallback(
    async (sessionId: string, remoteId: string | undefined, title: string, messages: Message[], summary: string) => {
      const body = {
        title,
        messages,
        summary: summary.trim(),
      };
      if (remoteId) {
        await api.patch(`/resources/conversations/${remoteId}`, body);
      } else {
        const { data } = await api.post<Record<string, unknown>>("/resources/conversations", body);
        const newId = String(data._id ?? "");
        if (newId) {
          setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? { ...s, remoteId: newId, id: newId } : s))
          );
          setActiveSessionId((cur) => (cur === sessionId ? newId : cur));
        }
      }
    },
    []
  );

  const send = async () => {
    if (!prompt.trim() || !activeSession) return;

    try {
      const me = await fetchProfileFresh();
      dispatch(setAuthUser(me));
      if (!me.profileComplete) {
        setProfileModalOpen(true);
        return;
      }
    } catch {
      setProfileModalOpen(true);
      return;
    }

    const sessionId = activeSession.id;
    const remoteId = activeSession.remoteId;
    const summary = activeSession.summary ?? "";

    const userMessage: Message = { role: "user", content: prompt.trim() };
    const next: Message[] = [...activeSession.messages, userMessage];
    const titleAfterUser = deriveChatTitle(next) || activeSession.title;

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, messages: next, updatedAt: "Just now", title: titleAfterUser }
          : session
      )
    );
    setPrompt("");
    setTyping(true);

    const recentForModel = next.slice(-RECENT_MESSAGES_FOR_MODEL);

    try {
      const response = await api.post("/ai/coach", {
        messages: recentForModel,
        conversationSummary: summary.trim() || undefined,
      });
      const result = response.data as { success?: boolean; data?: string };

      if (result.success && typeof result.data === "string") {
        const assistantMessage: Message = { role: "assistant", content: result.data };
        const withAssistant = [...next, assistantMessage];
        const persistTitle = deriveChatTitle(withAssistant) || titleAfterUser;
        setSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId
              ? { ...session, updatedAt: "Just now", messages: withAssistant, title: persistTitle }
              : session
          )
        );
        try {
          await persistConversation(sessionId, remoteId, persistTitle, withAssistant, summary);
        } catch (e) {
          console.error("Coach persist:", e);
        }
      }
    } catch (error: unknown) {
      console.error("Coach Error:", error);
      const ax = error as { response?: { status?: number; data?: { code?: string; message?: string } } };
      if (ax.response?.status === 402) {
        const payMsg =
          ax.response.data?.message || "Add USDC to your wallet (Dashboard → Wallet) and try again.";
        const errorMessage: Message = { role: "assistant", content: payMsg };
        setSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId ? { ...session, messages: [...next, errorMessage] } : session
          )
        );
        setTyping(false);
        return;
      }
      if (ax.response?.status === 403 && ax.response.data?.code === "PROFILE_INCOMPLETE") {
        setProfileModalOpen(true);
        setTyping(false);
        return;
      }
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please check if the backend and AI agent are running.",
      };
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, messages: [...next, errorMessage] } : session
        )
      );
    } finally {
      setTyping(false);
    }
  };

  const startNewChat = () => {
    const s = newLocalSession();
    setSessions((prev) => [s, ...prev]);
    setActiveSessionId(s.id);
  };

  const deleteSession = (session: ChatSession, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { id, remoteId } = session;
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.length === 0 ? [newLocalSession()] : filtered;
    });
    if (remoteId) {
      void api.delete(`/resources/conversations/${remoteId}`).catch((err) => {
        console.error("Delete conversation failed (background)", err);
      });
    }
  };

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <ProfilePreferencesModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        initialUser={authUser}
        title="Complete your profile to chat with the coach"
        onSaved={(u) => dispatch(setAuthUser(u))}
      />
      <div>
        <p className="panel-heading">Agent Conversation</p>
        <h1 className="text-2xl font-semibold">AI Coach Agent</h1>
        <p className="mt-1 text-xs text-neutral-500">
          Each reply uses your profile plus the last {RECENT_MESSAGES_FOR_MODEL} messages in this chat, and an optional
          stored summary for older context. Chats sync to your account when the coach responds. Each assistant reply
          charges <strong className="text-neutral-400">0.001 USDC</strong> from your Circle wallet.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Recent Chats</p>
              <Button
                size="sm"
                onClick={startNewChat}
                className="rounded-lg bg-[#F41E1E] font-semibold text-white hover:opacity-95"
              >
                New
              </Button>
            </div>

            <div className="max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto pr-1">
              {!sessionsHydrated ? (
                <CoachSidebarSkeleton />
              ) : sessions.length === 0 ? (
                <p className="text-xs text-slate-500">No chats yet.</p>
              ) : null}
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-stretch gap-0.5 rounded-xl border transition ${
                    session.id === activeSession?.id
                      ? "border-[#F41E1E] bg-[#F41E1E]/10"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSessionId(session.id)}
                    className="min-w-0 flex-1 rounded-l-xl p-3 text-left"
                  >
                    <p className="line-clamp-2 text-sm font-semibold">{chatListTitle(session)}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <Clock3 size={12} />
                      {session.updatedAt}
                    </p>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${chatListTitle(session)}`}
                    title="Delete chat"
                    onClick={(e) => deleteSession(session, e)}
                    className="pointer-events-none shrink-0 self-center rounded-r-xl px-2 py-3 text-red-500 opacity-0 transition-opacity duration-150 hover:text-red-400 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
                  >
                    <Trash2 size={16} strokeWidth={2} className="text-current" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="mb-2 text-xs text-slate-400">Agent status</p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Zap size={14} className="text-[#f87171]" />
                Profile-backed context + recent thread
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="flex h-[75vh] min-h-0 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Card.Content className="flex h-full min-h-0 flex-col gap-3">
            <div className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
              <Avatar size="md" className="h-11 w-11 shrink-0 bg-[#F41E1E] text-white">
                <Bot size={22} strokeWidth={2} />
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{COACH_NAME}</p>
                <p className="text-xs text-slate-400">{COACH_TAGLINE}</p>
              </div>
            </div>

            {showStarterSuggestions ? (
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
            ) : null}

            <div className="custom-scrollbar flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto overflow-x-hidden rounded-xl bg-[var(--surface-soft)] p-3">
              {activeSession?.messages.map((m, idx) => (
                <div key={`${m.role}-${idx}`} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-2xl p-3 text-sm ${
                      m.role === "assistant"
                        ? "bg-[var(--surface-strong)] text-slate-100"
                        : "bg-[#F41E1E] text-white"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <Avatar size="sm" className="shrink-0 bg-[#F41E1E] text-white">
                        <Bot size={14} />
                      </Avatar>
                    )}
                    {m.role === "assistant" ? (
                      <div className="min-w-0 flex-1">
                        <AiStructuredResponse content={m.content} variant="chat" />
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div
                    className="flex max-w-[80%] items-center gap-3 rounded-2xl bg-[var(--surface-strong)] px-4 py-3"
                    aria-live="polite"
                    aria-label="Coach is typing"
                  >
                    <Avatar size="sm" className="shrink-0 bg-[#F41E1E] text-white">
                      <Bot size={14} />
                    </Avatar>
                    <div className="coach-typing-dots flex items-center gap-1.5 py-0.5">
                      <span className="coach-typing-dot" />
                      <span className="coach-typing-dot" />
                      <span className="coach-typing-dot" />
                    </div>
                  </div>
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
                background: rgba(244, 30, 30, 0.35);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(244, 30, 30, 0.55);
              }
              @keyframes coach-typing-bounce {
                0%,
                60%,
                100% {
                  transform: translateY(0);
                  opacity: 0.35;
                }
                30% {
                  transform: translateY(-5px);
                  opacity: 1;
                }
              }
              .coach-typing-dot {
                display: block;
                width: 7px;
                height: 7px;
                border-radius: 9999px;
                background-color: rgb(163 163 163);
                animation: coach-typing-bounce 1.05s ease-in-out infinite;
              }
              .coach-typing-dot:nth-child(2) {
                animation-delay: 0.16s;
              }
              .coach-typing-dot:nth-child(3) {
                animation-delay: 0.32s;
              }
            `}</style>

            <div className="mt-auto shrink-0 overflow-visible border-t border-[var(--border)] px-1 pb-3 pt-3">
              <div className="relative w-full overflow-visible px-1 pb-1 pt-0.5">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Tell the agent what to optimize..."
                  fullWidth
                  className="w-full min-h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pr-12 shadow-none ring-0 outline-none focus-visible:border-[#F41E1E] focus-visible:ring-2 focus-visible:ring-[#F41E1E]/35"
                />
                <Button
                  isIconOnly
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-[#F41E1E] text-white"
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
