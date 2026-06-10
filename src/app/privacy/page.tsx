import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How AskScripture handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Last updated 2026-06-06
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Privacy.
          </h1>

          <div className="serif mt-10 text-[1.0625rem] leading-[1.8] text-ink space-y-6">
            <p>
              <strong>Local data.</strong> Your notes, highlights, bookmarks,
              streak, and reading position are stored in your browser's
              localStorage. They never leave your device unless you sign in.
            </p>
            <p>
              <strong>Account data (when sign-in is available).</strong> Email
              and a hashed password for authentication; the same study data
              listed above, synced across your devices. No marketing emails.
            </p>
            <p>
              <strong>AI requests.</strong> When you use Study Chat or any of
              the generators, the message you send and the relevant passage
              text are forwarded to Anthropic's Claude API. Anthropic's data
              retention is governed by their Usage Policies. We do not log
              your messages on our servers.
            </p>
            <p>
              <strong>Analytics.</strong> We use minimal, privacy-preserving
              analytics for page views and error reporting. No cross-site
              tracking. No advertising IDs. No third-party trackers.
            </p>
            <p>
              <strong>Children.</strong> AskScripture is not directed at
              children under 13. Family mode is designed for parents reading
              with children; the parent operates the device.
            </p>
            <p>
              <strong>Deletion.</strong> Local data can be cleared from {""}
              <a href="/settings" className="text-accent hover:underline">
                preferences
              </a>
              . Once accounts are live, deletion will remove everything tied to
              your email within 30 days.
            </p>
            <p>
              <strong>Questions?</strong> Email {""}
              <a
                href="mailto:stephanie@erie-apps.com"
                className="text-accent hover:underline"
              >
                stephanie@erie-apps.com
              </a>
              . One human reads every message.
            </p>
          </div>
        </article>
    </>
  );
}
