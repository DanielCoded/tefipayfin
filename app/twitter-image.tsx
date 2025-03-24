import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "TefiPay - The Future of Contactless Payments in Africa"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom, #030303, #0a0a0a)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #6366f1, #f43f5e)",
          backgroundClip: "text",
          color: "transparent",
          fontSize: "72px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        TefiPay
      </div>
      <div
        style={{
          color: "white",
          fontSize: "36px",
          fontWeight: "medium",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        The Future of Contactless Payments in Africa
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "24px",
        }}
      >
        <span>@TefiPayOfficial</span>
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}

