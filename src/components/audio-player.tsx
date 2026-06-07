"use client";

import { useEffect, useRef, useState } from "react";

const VOICES: { id: string; label: string }[] = [
  { id: "david", label: "David" },
  { id: "hays", label: "Hays" },
  { id: "souer", label: "Souer" },
];

const SPEEDS = [0.85, 1, 1.15, 1.35, 1.5];

type Props = {
  /** HelloAO book ID, e.g. "GEN" */
  bookId: string;
  chapter: number;
  bookName: string;
};

/**
 * Plays the chapter audio from HelloAO's free voice readings. Audio is
 * available for BSB chapters; for non-BSB the buttons still appear and may
 * silently fall back to the BSB voice (which is what we want — let the user
 * hear the chapter regardless of which translation they're reading).
 */
export function AudioPlayer({ bookId, chapter, bookName }: Props) {
  const [voice, setVoice] = useState<string>("david");
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const src = `https://audio.bible.helloao.org/api/BSB/${bookId}/${chapter}/audio/${voice}.mp3`;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    // Reset on chapter / voice change
    setTime(0);
    setPlaying(false);
    setError(null);
  }, [bookId, chapter, voice]);

  function fmt(t: number) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    setError(null);
    a.play().catch((err) => {
      setError(
        err?.name === "NotAllowedError"
          ? "Browser blocked autoplay — click play again."
          : "Couldn't load audio for this chapter.",
      );
    });
  }

  function seek(pct: number) {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = (pct / 100) * duration;
  }

  if (!open) {
    return (
      <div className="mb-6 flex items-center justify-between border border-rule px-3 py-2 text-[0.8125rem]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Audio
          </span>
          <span className="text-ink-muted hidden sm:inline">
            Listen to {bookName} {chapter} read aloud
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-ink hover:text-accent inline-flex items-center gap-2"
        >
          <PlayIcon />
          <span>Listen</span>
        </button>
      </div>
    );
  }

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="mb-6 border border-rule">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={(e) => {
          setDuration((e.target as HTMLAudioElement).duration);
          setError(null);
        }}
        onError={() =>
          setError("Audio unavailable for this chapter — try another voice.")
        }
      />

      {error && (
        <div
          role="alert"
          className="px-3 py-2 bg-flag/10 border-b border-flag/30 text-[0.8125rem] text-flag"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="h-9 w-9 inline-flex items-center justify-center bg-accent text-paper hover:bg-accent-2 transition-colors shrink-0"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="flex-1 min-w-0">
          <div
            className="h-1 bg-paper-2 cursor-pointer"
            onClick={(e) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              seek(((e.clientX - r.left) / r.width) * 100);
            }}
          >
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-mono text-[0.625rem] text-ink-muted tabular-nums">
            <span>{fmt(time)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Hide player"
          className="text-ink-subtle hover:text-ink text-[0.75rem] shrink-0"
        >
          Hide
        </button>
      </div>

      <div className="border-t border-rule px-3 py-2 flex flex-wrap items-center gap-3 text-[0.6875rem]">
        <div className="flex items-center gap-1.5">
          <span className="uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Voice
          </span>
          {VOICES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVoice(v.id)}
              className={
                "px-1.5 py-0.5 border " +
                (voice === v.id
                  ? "border-accent text-paper bg-accent"
                  : "border-rule text-ink-muted hover:border-rule-strong")
              }
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Speed
          </span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={
                "px-1.5 py-0.5 border tabular-nums font-mono " +
                (speed === s
                  ? "border-accent text-paper bg-accent"
                  : "border-rule text-ink-muted hover:border-rule-strong")
              }
            >
              {s}×
            </button>
          ))}
        </div>
        <span className="text-ink-subtle ml-auto hidden md:inline">
          via BSB · audio.bible.helloao.org
        </span>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M3 1.5 L12 7 L3 12.5 Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="3" y="2" width="3" height="10" />
      <rect x="8" y="2" width="3" height="10" />
    </svg>
  );
}
