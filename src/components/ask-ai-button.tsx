"use client";

import { useState } from "react";
import { ChatDrawer } from "./chat-drawer";

type Props = {
  passage: string;
  translationId: string;
};

export function AskAiButton({ passage, translationId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-accent text-paper px-4 py-3 text-left hover:bg-accent-2 transition-colors group"
      >
        <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-paper/70 font-medium">
          Ask about this passage
        </div>
        <div className="mt-1 text-[0.875rem] text-paper">
          Open the study chat &rarr;
        </div>
      </button>
      {open && (
        <ChatDrawer
          passage={passage}
          translationId={translationId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
