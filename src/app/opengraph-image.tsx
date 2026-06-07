import { ImageResponse } from "next/og";

export const alt = "AskScripture — Read the Bible with context, not commentary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#FBFAF7",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontFamily: "Arial",
            fontSize: 22,
            color: "#5B6271",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          AskScripture
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: "#14171F",
              fontWeight: 600,
              maxWidth: 980,
              letterSpacing: -2,
            }}
          >
            Read the Bible with context,<br />not commentary.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Arial",
            fontSize: 22,
            color: "#5B6271",
            letterSpacing: 1,
          }}
        >
          Side-by-side translations · Original language · Honest study
        </div>
      </div>
    ),
    size,
  );
}
