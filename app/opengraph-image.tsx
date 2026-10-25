import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Elisha Mlay, data analyst and revenue assurance specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontFile = (pkg: string, file: string) =>
  readFile(path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export default async function Image() {
  const [plex, plexBold, vt] = await Promise.all([
    fontFile("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff"),
    fontFile("ibm-plex-mono", "ibm-plex-mono-latin-600-normal.woff"),
    fontFile("vt323", "vt323-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0c1311",
          color: "#cfe3d8",
          fontFamily: "Plex",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6f8a7d",
            fontSize: 26,
            paddingBottom: 20,
            borderBottom: "2px solid #223530",
          }}
        >
          <span>elisha@dar · zsh</span>
          <span>Dar es Salaam, Tanzania</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                fontFamily: "VT",
                fontSize: 190,
                lineHeight: 1,
                color: "#ffb454",
                letterSpacing: 2,
              }}
            >
              ELISHA MLAY
            </div>
            <div
              style={{
                width: 34,
                height: 150,
                background: "#ffb454",
                marginLeft: 18,
              }}
            />
          </div>
          <div style={{ fontSize: 38, color: "#cfe3d8", marginTop: 8, fontWeight: 600 }}>
            Data Analyst and Revenue Assurance Specialist
          </div>
          <div style={{ fontSize: 28, color: "#6f8a7d", marginTop: 10 }}>
            SQL and PL/SQL · Power BI · Anomaly detection · CRDB Bank
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#5fd3c4" }}>
          <span>elisha@dar:~$</span>
          <span style={{ color: "#cfe3d8", marginLeft: 16 }}>demo</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex", data: plex, weight: 400, style: "normal" },
        { name: "Plex", data: plexBold, weight: 600, style: "normal" },
        { name: "VT", data: vt, weight: 400, style: "normal" },
      ],
    },
  );
}
