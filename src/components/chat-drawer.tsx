"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/lib/preferences/provider";
import { MODE_LIST, type ModeDescriptor } from "@/lib/chat/modes";
import type { ChatMode } from "@/lib/preferences/types";
import { cn } from "@/lib/utils/cn";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  passage?: string;
  translationId?: string;
  onClose: () => void;
};

export function ChatDrawer({ passage, translationId, onClose }: Props) {
  const { preferences } = usePreferences();
  const [mode, setMode] = useState<ChatMode>(preferences.defaultChatMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          passage,
          translationId,
          messages: next,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setError(
          errBody?.error ??
            "The chat service returned an error. Make sure ANTHROPIC_API_KEY is set on the server.",
        );
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const updated = [...m];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setStreaming(false);
    }
  }

  const currentMode = MODE_LIST.find((m) => m.id === mode) ?? MODE_LIST[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Study chat"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="flex-1 bg-ink/30"
      />
      <div className="w-full max-w-[520px] bg-paper border-l border-rule-strong flex flex-col">
        <DrawerHeader passage={passage} mode={currentMode} onClose={onClose} />
        <ModeSwitcher current={mode} onChange={setMode} />

        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
        >
          {messages.length === 0 ? (
            <Empty mode={currentMode} passage={passage} />
          ) : (
            messages.map((m, i) => <Bubble key={i} message={m} />)
          )}
          {error && (
            <div className="text-[0.8125rem] text-flag bg-flag/10 border border-flag/30 p-3">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={send}
          className="border-t border-rule px-6 py-4 bg-paper"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder={
                passage
                  ? `Ask about ${passage}…`
                  : "Ask about a passage…"
              }
              disabled={streaming}
              className="flex-1 resize-none bg-paper border border-rule-strong px-3 py-2 text-[0.9375rem] text-ink placeholder:text-ink-subtle focus:border-accent outline-none"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="bg-accent text-paper px-4 py-2.5 text-[0.8125rem] font-medium tracking-wide hover:bg-accent-2 transition-colors disabled:opacity-50"
            >
              {streaming ? "…" : "Send"}
            </button>
          </div>
          <p className="mt-2 text-[0.6875rem] text-ink-subtle">
            Press Enter to send · Shift+Enter for newline · Esc to close
          </p>
        </form>
      </div>
    </div>
  );
}

function DrawerHeader({
  passage,
  mode,
  onClose,
}: {
  passage?: string;
  mode: ModeDescriptor;
  onClose: () => void;
}) {
  return (
    <div className="px-6 py-4 border-b border-rule flex items-start justify-between gap-4">
      <div>
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
          Study chat
        </div>
        <div className="serif mt-1 text-[1.125rem] font-semibold text-ink">
          {passage ?? "AskScripture"}
        </div>
        <p className="mt-1 text-[0.75rem] text-ink-muted leading-snug">
          {mode.oneLine}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-ink-muted hover:text-ink text-[0.875rem]"
      >
        Close
      </button>
    </div>
  );
}

function ModeSwitcher({
  current,
  onChange,
}: {
  current: ChatMode;
  onChange: (next: ChatMode) => void;
}) {
  return (
    <div className="px-6 py-3 border-b border-rule flex gap-1 overflow-x-auto">
      {MODE_LIST.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={cn(
            "text-[0.75rem] px-2.5 py-1 whitespace-nowrap border transition-colors",
            current === m.id
              ? "border-accent text-paper bg-accent"
              : "border-rule text-ink-muted hover:border-rule-strong hover:text-ink",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-paper-2 border border-rule px-3.5 py-2.5 text-[0.9375rem] text-ink whitespace-pre-wrap leading-6">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mb-1.5">
        AskScripture
      </div>
      <div
        className="text-[0.9375rem] text-ink leading-7 whitespace-pre-wrap"
        aria-live="polite"
        aria-atomic="false"
      >
        {message.content}
        {!message.content && (
          <span
            className="inline-block w-2 h-4 bg-ink-muted align-middle animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

function Empty({
  mode,
  passage,
}: {
  mode: ModeDescriptor;
  passage?: string;
}) {
  const samples = passage
    ? [
        `What's the historical setting of ${passage}?`,
        `Where does this passage land in the broader argument of the book?`,
        `What's a contested word or phrase here, and what's the debate?`,
      ]
    : [
        "What does arsenokoitai mean in 1 Cor 6:9?",
        "Why do translations differ on Ephesians 5:22?",
        "What's the genre of Genesis 1-2?",
      ];
  return (
    <div>
      <p className="text-[0.875rem] text-ink-muted leading-6">
        You're in <span className="text-ink font-medium">{mode.label}</span> mode.
        Ask anything about {passage ? `this passage` : `a passage or topic`}.
      </p>
      <div className="mt-5 space-y-2">
        {samples.map((s) => (
          <button
            key={s}
            type="button"
            className="block text-left text-[0.8125rem] text-ink-muted hover:text-accent transition-colors"
            disabled
          >
            <span className="text-ink-subtle mr-2">·</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
