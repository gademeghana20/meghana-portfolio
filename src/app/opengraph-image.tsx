import { ImageResponse } from "next/og";
import { getPortfolioContent } from "@/lib/content";

export const alt = "Gade Meghana | Software Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const palette = ["#A26360", "#D4A29C", "#E8B298", "#EDCC8B", "#BDD1C5", "#9BAAA2"];

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
          background: "#FAF4EE",
          color: "#2F2321",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8A4C49" }}>
          {profile.designation}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 88,
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
            color: "#75605B",
          }}
        >
          {profile.headline}
        </div>
        <div style={{ display: "flex", marginTop: 56 }}>
          {palette.map((c) => (
            <div key={c} style={{ display: "flex", width: 64, height: 12, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
