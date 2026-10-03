import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/shared/config";

export const alt = `${siteConfig.shortName}: frontend that feels inevitable, built end to end.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse renders outside the page, so it can't read the CSS tokens: these mirror
// `--color-bg`, `--color-fg`, `--color-muted`, `--color-line` and `--color-accent` in globals.css.
const color = {
  bg: "#0c0c0b",
  fg: "#edeae3",
  muted: "#8f8c84",
  line: "#262522",
  accent: "#ff6a3d",
} as const;

// Fonts for the logo lockup: Geist 500 for "Johnny", Instrument Serif italic for "Dang" (both OFL).
const fontDir = join(process.cwd(), "src/app/_og");

/** Open Graph image: the "Logo · identity" lockup over the hero headline. */
export default async function OpengraphImage() {
  const [geist, serif, avatar] = await Promise.all([
    readFile(join(fontDir, "Geist-Medium.ttf")),
    readFile(join(fontDir, "InstrumentSerif-Italic.ttf")),
    // Same file as the Avatar component, so the real export replaces both.
    readFile(join(process.cwd(), "public/avatar.png"), "base64"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: color.bg,
        color: color.fg,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            width: 112,
            height: 112,
            padding: 7,
            borderRadius: 9999,
            background: color.fg,
          }}
        >
          {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse renders plain <img>, next/image doesn't work here */}
          <img
            src={`data:image/png;base64,${avatar}`}
            alt=""
            width={98}
            height={98}
            style={{ borderRadius: 9999 }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.045em" }}>Johnny</span>
          <span
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 58,
              lineHeight: 0.9,
            }}
          >
            Dang<span style={{ color: color.accent }}>.</span>
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: 84,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          maxWidth: 960,
        }}
      >
        <span>Frontend that feels&nbsp;</span>
        <span
          style={{
            fontFamily: "Instrument Serif",
            fontStyle: "italic",
            color: color.accent,
            letterSpacing: "-0.02em",
          }}
        >
          inevitable
        </span>
        <span>, built end to end.</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${color.line}`,
          paddingTop: 24,
          fontSize: 24,
          color: color.muted,
        }}
      >
        <span>{siteConfig.role}</span>
        <span>{new URL(siteConfig.url).host}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, weight: 500, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
