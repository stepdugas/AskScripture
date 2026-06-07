import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Print layout — bypasses the site chrome and applies print-friendly styles.
 * Users use the browser's "Print → Save as PDF" to get a real PDF.
 */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html, body { background: white; color: #14171f; font-family: 'Iowan Old Style', Charter, Georgia, serif; }
          * { box-sizing: border-box; }
          .doc { max-width: 6.5in; margin: 0.75in auto; line-height: 1.7; }
          .eyebrow { font-family: -apple-system, 'Helvetica Neue', sans-serif; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #5b6271; font-weight: 600; }
          h1 { font-size: 28pt; line-height: 1.05; margin: 8px 0 24px; font-weight: 600; letter-spacing: -0.5px; }
          h2 { font-size: 14pt; margin-top: 32px; margin-bottom: 8px; font-weight: 600; }
          p { font-size: 13pt; line-height: 1.7; margin: 8px 0; }
          .meta { font-family: -apple-system, sans-serif; font-size: 10pt; color: #5b6271; border-top: 1px solid #d6cfbd; padding-top: 16px; margin-top: 48px; }
          .body { white-space: pre-wrap; }
          .controls { font-family: -apple-system, sans-serif; padding: 16px; background: #f5f2ea; border: 1px solid #d6cfbd; margin-bottom: 32px; display: flex; gap: 12px; align-items: center; font-size: 13px; }
          .controls button { background: #1B2845; color: #fbfaf7; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; }
          @media print {
            .controls { display: none; }
            body { background: white; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
