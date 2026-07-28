/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import type { SyncStatus } from "@/lib/store";

// ---------- Handgezeichnet wirkender Fortschrittsring ----------

export function FortschrittsRing({
  prozent,
  groesse = 160,
  dicke = 10,
  farbe = "#D9A441",
  spur = "#EFE6CF",
  children,
}: {
  prozent: number; // 0..100
  groesse?: number;
  dicke?: number;
  farbe?: string;
  spur?: string;
  children?: ReactNode;
}) {
  const p = Math.max(0, Math.min(100, prozent));
  const r = (groesse - dicke) / 2;
  const umfang = 2 * Math.PI * r;
  const versatz = umfang * (1 - p / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: groesse, height: groesse }}>
      <svg width={groesse} height={groesse} className="-rotate-90">
        <circle
          cx={groesse / 2}
          cy={groesse / 2}
          r={r}
          fill="none"
          stroke={spur}
          strokeWidth={dicke}
          strokeLinecap="round"
        />
        <circle
          cx={groesse / 2}
          cy={groesse / 2}
          r={r}
          fill="none"
          stroke={farbe}
          strokeWidth={dicke}
          strokeLinecap="round"
          strokeDasharray={umfang}
          strokeDashoffset={versatz}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

// ---------- Horizontaler Balken ----------

export function Balken({
  prozent,
  farbe = "#C96F4A",
  hintergrund = "#F4EDE0",
  hoehe = 10,
}: {
  prozent: number;
  farbe?: string;
  hintergrund?: string;
  hoehe?: number;
}) {
  const p = Math.max(0, Math.min(100, prozent));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ backgroundColor: hintergrund, height: hoehe }}
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${p}%`, backgroundColor: farbe, transition: "width 0.4s ease" }}
      />
    </div>
  );
}

// ---------- Ampel ----------

export type Ampel = "gruen" | "gelb" | "rot" | "leer";

export function AmpelPunkt({ ampel }: { ampel: Ampel }) {
  const farben: Record<Ampel, { bg: string; label: string }> = {
    gruen: { bg: "#8A9B6E", label: "im Rahmen" },
    gelb: { bg: "#D9A441", label: "knapp daneben" },
    rot: { bg: "#9D3D2C", label: "kritisch" },
    leer: { bg: "#C9BCA4", label: "noch offen" },
  };
  const f = farben[ampel];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block rounded-full"
        style={{ width: 14, height: 14, backgroundColor: f.bg }}
        aria-hidden
      />
      <span className="text-xs text-tinte/70">{f.label}</span>
    </span>
  );
}

// Ampel-Logik: gruen innerhalb Toleranz, gelb knapp daneben, rot kritisch
export function ampelFuer(
  istText: string,
  min?: number,
  max?: number,
  tol?: number
): Ampel {
  if (min === undefined || max === undefined || tol === undefined) return "leer";
  const wert = parseFloat(istText.replace(",", "."));
  if (isNaN(wert)) return "leer";
  if (wert >= min - tol && wert <= max + tol) return "gruen";
  if (wert >= min - 2 * tol - 3 && wert <= max + 2 * tol + 3) return "gelb";
  return "rot";
}

// ---------- Sync-Status ----------

export function SyncBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { punkt: string; text: string }> = {
    verbunden: { punkt: "#D9A441", text: "verbunden" },
    synchronisiert: { punkt: "#8A9B6E", text: "synchronisiert" },
    offline: { punkt: "#9D3D2C", text: "offline" },
  };
  const m = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-tinte/70" role="status">
      <span
        className="inline-block rounded-full"
        style={{ width: 9, height: 9, backgroundColor: m.punkt }}
        aria-hidden
      />
      {m.text}
    </span>
  );
}

// ---------- Schlichte Inline-SVG-Icons für die Tab-Bar ----------

function IconRahmen({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

export function IconStart() {
  return (
    <IconRahmen>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
    </IconRahmen>
  );
}

export function IconBauen() {
  return (
    <IconRahmen>
      <path d="M14.5 5.5a4 4 0 0 0-5.3 5L4 15.7V20h4.3l5.2-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.5-.7-.7-2.5 2.6-2.6z" />
    </IconRahmen>
  );
}

export function IconMessen() {
  return (
    <IconRahmen>
      <path d="M3 17 17 3l4 4L7 21z" />
      <path d="m8 12 1.5 1.5M11 9l1.5 1.5M14 6l1.5 1.5" />
    </IconRahmen>
  );
}

export function IconGewicht() {
  return (
    <IconRahmen>
      <path d="M12 4v3" />
      <path d="M6 7h12l2 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M9.5 13.5 12 11l2.5 2.5" />
    </IconRahmen>
  );
}

export function IconEinkauf() {
  return (
    <IconRahmen>
      <path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7z" />
      <path d="M8.5 9.5V6a3.5 3.5 0 0 1 7 0v3.5" />
    </IconRahmen>
  );
}

export function IconGrundriss() {
  return (
    <IconRahmen>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M3 12h5M16 12h5M11 6v12" />
    </IconRahmen>
  );
}
