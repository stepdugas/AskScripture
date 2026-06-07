import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for AskScripture.",
};

export default function TermsPage() {
  return (
    <>
    <article className="mx-auto max-w-[760px] px-6 lg:px-10 pt-16 pb-24">
          <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            Last updated 2026-06-06
          </div>
          <h1 className="serif mt-3 text-[2.5rem] leading-[1.05] tracking-tight text-ink font-semibold">
            Terms.
          </h1>

          <div className="serif mt-10 text-[1.0625rem] leading-[1.8] text-ink space-y-6">
            <p>
              <strong>The service.</strong> AskScripture is a Bible study tool
              provided as-is. We make no warranties about uptime, accuracy of
              AI responses, or the correctness of any particular interpretation
              presented on the site.
            </p>
            <p>
              <strong>Acceptable use.</strong> Don't abuse the service. Don't
              attempt to extract bulk scripture data via scraping (the
              underlying Bible APIs have their own redistribution licenses you
              should follow). Don't use the AI features to produce content that
              violates Anthropic's Usage Policies.
            </p>
            <p>
              <strong>Generated content.</strong> Content produced by the AI is
              your responsibility to evaluate and use. The system is a study
              aid, not a theological authority.
            </p>
            <p>
              <strong>Changes.</strong> We may change features, plans, and
              terms. Material changes will be noted on this page with a new
              "last updated" date.
            </p>
            <p>
              <strong>Contact.</strong> Reach out via the site contact form or
              the project's email address listed in the footer.
            </p>
          </div>
        </article>
    </>
  );
}
