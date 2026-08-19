import { ImageResponse } from "next/og";
import { site, brand } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated social card — no binary asset to keep in the repo. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.frost,
          padding: 72,
          color: brand.midnight,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 120 120">
            <polygon points="12,104 48,20 48,104" fill={brand.indigo} />
            <polygon points="48,20 84,104 48,104" fill={brand.signal} />
            <polygon points="58,104 82,52 82,104" fill={brand.signal} />
            <polygon points="82,52 106,104 82,104" fill={brand.periwinkle} />
            <polygon points="46,104 64,70 82,104" fill={brand.ice} />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: brand.indigo,
            }}
          >
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: 3 }}>
              NEXZA
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: 12,
                color: brand.periwinkle,
              }}
            >
              DIGITAL
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -2,
            maxWidth: 940,
            color: brand.midnight,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(16,23,54,0.66)",
          }}
        >
          <div style={{ display: "flex" }}>{site.strapline}</div>
          <div
            style={{
              display: "flex",
              background: brand.signal,
              color: brand.frost,
              padding: "12px 26px",
              fontWeight: 600,
            }}
          >
            {site.domain}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
