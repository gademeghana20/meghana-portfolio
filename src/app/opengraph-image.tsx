import { ImageResponse } from "next/og";
import { getPortfolioContent } from "@/lib/content";

export const alt = "Gade Meghana | Software Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social sharing preview (LinkedIn, WhatsApp, etc.), built from your live profile.
export default async function OpengraphImage() {
  const { profile } = await getPortfolioContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0e13",
          color: "#e8eaf0",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#7c93ff" }}>
          {profile.designation}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 900,
            fontSize: 36,
            lineHeight: 1.3,
            color: "#9aa1b2",
          }}
        >
          {profile.headline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            width: 120,
            height: 6,
            background: "linear-gradient(90deg, #7c93ff, #a58bff)",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
