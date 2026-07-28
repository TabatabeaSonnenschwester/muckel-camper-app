import { useState } from "react";
import { useApp } from "@/lib/store";
import { BAU_SCHRITTE, SCHRITT_STATUS_LABEL } from "@/lib/data";
import type { SchrittStatus } from "@/lib/data";
import { Balken } from "@/components/bits";

const STATUS_REIHENFOLGE: SchrittStatus[] = ["offen", "in-arbeit", "erledigt", "blockiert"];

const STATUS_FARBE: Record<SchrittStatus, string> = {
  "offen": "bg-creme text-tinte/60 border border-tinte/20",
  "in-arbeit": "bg-senf/25 text-tinte border border-senf/50",
  "erledigt": "bg-salbei/30 text-tinte border border-salbei/60",
  "blockiert": "bg-rost/15 text-rost border border-rost/40",
};

export default function Bauen() {
  const { state, update } = useApp();
  const [offen, setOffen] = useState<number | null>(null);

  const erledigt = BAU_SCHRITTE.filter(
    (s) => state.schritte[String(s.nr)]?.status === "erledigt"
  ).length;
  const prozent = Math.round((erledigt / BAU_SCHRITTE.length) * 100);

  const statusSetzen = (nr: number, status: SchrittStatus) =>
    update((p) => ({
      ...p,
      schritte: { ...p.schritte, [String(nr)]: { ...p.schritte[String(nr)], status } },
    }));

  const notizSetzen = (nr: number, notiz: string) =>
    update((p) => ({
      ...p,
      schritte: { ...p.schritte, [String(nr)]: { status: p.schritte[String(nr)]?.status ?? "offen", notiz } },
    }));

  return (
    <div className="space-y-5">
      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-xl">Bau-Schritte</h2>
          <span className="text-sm text-tinte/70">
            {erledigt}/{BAU_SCHRITTE.length} erledigt · {prozent}%
          </span>
        </div>
        <Balken prozent={prozent} farbe="#C96F4A" />
      </section>

      <div className="divide-y divide-tinte/10">
        {BAU_SCHRITTE.map((s) => {
          const eintrag = state.schritte[String(s.nr)] ?? { status: "offen" as SchrittStatus, notiz: "" };
          const istOffen = offen === s.nr;
          return (
            <article key={s.nr} className="py-4">
              <button
                className="w-full flex items-start gap-3 text-left"
                onClick={() => setOffen(istOffen ? null : s.nr)}
                aria-expanded={istOffen}
              >
                <span
                  className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                    eintrag.status === "erledigt"
                      ? "bg-salbei border-salbei text-creme"
                      : "border-tinte/30 text-transparent"
                  }`}
                  aria-hidden
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12.5 9.5 18 20 6.5" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span
                    className={`block font-medium ${
                      eintrag.status === "erledigt" ? "line-through text-tinte/50" : ""
                    }`}
                  >
                    {s.nr}. {s.titel}
                  </span>
                  <span className="block text-xs text-tinte/60 mt-0.5">
                    Aktive Arbeitszeit: {s.zeit}
                  </span>
                </span>
                <span className={`badge shrink-0 ${STATUS_FARBE[eintrag.status]}`}>
                  {SCHRITT_STATUS_LABEL[eintrag.status]}
                </span>
              </button>

              {istOffen && (
                <div className="mt-3 ml-9 space-y-3">
                  {s.hinweis && <p className="text-xs text-tinte/60">{s.hinweis}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_REIHENFOLGE.map((st) => (
                      <button
                        key={st}
                        onClick={() => statusSetzen(s.nr, st)}
                        className={`pill text-xs ${
                          eintrag.status === st
                            ? STATUS_FARBE[st] + " font-semibold"
                            : "bg-creme text-tinte/50 border border-tinte/15"
                        }`}
                      >
                        {SCHRITT_STATUS_LABEL[st]}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={eintrag.notiz}
                    onChange={(e) => notizSetzen(s.nr, e.target.value)}
                    placeholder="Notiz zu diesem Schritt …"
                    rows={2}
                    className="w-full rounded-xl bg-creme border border-tinte/15 px-3 py-2 text-sm outline-none focus:border-terra resize-y"
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
