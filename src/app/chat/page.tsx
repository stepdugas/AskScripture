"use client";

import { useState } from "react";
import { ChatDrawer } from "@/components/chat-drawer";

export default function ChatPage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="mx-auto max-w-[860px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Study chat
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Ask anything about the Bible.
          </h1>
          <p className="mt-5 text-[1rem] leading-7 text-ink-muted max-w-[58ch]">
            Six modes — Objective, Scholarly, Devotional, Affirming,
            Storytelling, and Kids &amp; family — let you choose how the same
            answer is framed. The text underneath never changes.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center px-6 bg-accent text-paper text-[0.875rem] font-medium tracking-wide hover:bg-accent-2 transition-colors"
            >
              Open chat
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <ModeCard
              title="Objective"
              body="No tradition assumed. Surveys major readings, names where the text is ambiguous, doesn't adjudicate."
            />
            <ModeCard
              title="Scholarly"
              body="Source/form/redaction criticism. ANE and Greco-Roman parallels. Authorship debates. Citations of scholars and schools."
            />
            <ModeCard
              title="Devotional"
              body="Personal and reflective. Grounded in the passage. One honest question at the end."
            />
            <ModeCard
              title="Affirming"
              body="Inclusive lens: LGBTQ+ readings, women in leadership, marginalized perspectives. Cites Vines, Brownson, Wright on women."
            />
            <ModeCard
              title="Storytelling"
              body="Cinematic retelling. Sensory detail and pacing. Stays inside what the text says."
            />
            <ModeCard
              title="Kids & family"
              body="Short sentences for ages 6-11. Honest about hard parts. One discussion question at the end."
            />
          </div>
        </div>
      {open && <ChatDrawer onClose={() => setOpen(false)} />}
    </>
  );
}

function ModeCard({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
        Mode
      </div>
      <h3 className="serif text-[1.25rem] mt-1 font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-6 text-ink-muted">{body}</p>
    </div>
  );
}
