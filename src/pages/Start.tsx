import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/lib/store";
import { BAU_SCHRITTE, PROJEKT_START, SCHRITT_STATUS_LABEL } from "@/lib/data";
import type { AppState } from "@/lib/store";
import { FortschrittsRing, IconGrundriss } from "@/components/bits";

function tageBis(datumIso: string): number {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const ziel = new Date(datumIso + "T00:00:00");
  return Math.round((ziel.getTime() - heute.getTime()) / 86400000);
}

function datumSchön(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Start() {
  const { state, update, ersetzen, projektCode, projektWechseln } = useApp();
  const [datumOffen, setDatumOffen] = useState(false);
  const dateiRef = useRef<HTMLInputElement>(null);

  const fortschritt = useMemo(() => {
    let punkte = 0;
    for (const s of BAU_SCHRITTE) {
      const st = state.schritte[String(s.nr)]?.status ?? "offen";
      if (st === "erledigt") punkte += 1;
      else if (st === "in-arbeit") punkte += 0.5;
    }
    return Math.round((punkte / BAU_SCHRITTE.length) * 100);
  }, [state.schritte]);

  const tage = tageBis(state.abreiseDatum);
  const gesamtTage = Math.max(1, tageBis(state.abreiseDatum) - tageBis(PROJEKT_START));
  const vergangen = Math.max(0, gesamtTage - Math.max(0, tage));
  const countdownProzent = tage <= 0 ? 100 : Math.min(100, (vergangen / gesamtTage) * 100);

  const heuteDran = BAU_SCHRITTE.filter((s) => {
    const st = state.schritte[String(s.nr)]?.status ?? "offen";
    return st === "in-arbeit" || st === "blockiert" || st === "offen";
  }).slice(0, 3);

  const exportieren = () => {
    const paket = {
      app: "muckel-camper-baubegleiter",
      projektCode,
      exportiertAm: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(paket, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `muckel-camper-${projektCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importieren = (datei: File) => {
    const leser = new FileReader();
    leser.onload = () => {
      try {
        const roh = JSON.parse(String(leser.result));
        const neu = (roh && typeof roh === "object" && "state" in roh ? roh.state : roh) as AppState;
        if (!neu || typeof neu !== "object" || !neu.schritte) {
          alert("Diese Datei sieht nicht wie ein Muckel-Export aus.");
          return;
        }
        ersetzen(neu);
      } catch {
        alert("Die Datei konnte nicht gelesen werden.");
      }
    };
    leser.readAsText(datei);
  };

  return (
    <div className="space-y-6">
      {/* Countdown */}
      <section className="karte flex flex-col items-center py-6">
        <FortschrittsRing prozent={countdownProzent} groesse={190} dicke={12} farbe="#D9A441">
          <span className="font-serif text-5xl text-rost leading-none">
            {tage > 0 ? tage : 0}
          </span>
          <span className="text-sm text-tinte/70 mt-1">
            {tage === 1 ? "Tag bis" : "Tage bis"} zur Abreise
          </span>
        </FortschrittsRing>
        <button className="pill-hell mt-4" onClick={() => setDatumOffen(!datumOffen)}>
          Abreise: {datumSchön(state.abreiseDatum)}
        </button>
        {datumOffen && (
          <input
            type="date"
            value={state.abreiseDatum}
            onChange={(e) =>
              e.target.value && update((p) => ({ ...p, abreiseDatum: e.target.value }))
            }
            className="mt-3 rounded-full bg-creme border border-tinte/20 px-4 py-2 outline-none focus:border-terra"
          />
        )}
      </section>

      {/* Gesamtfortschritt */}
      <section className="karte flex items-center gap-5">
        <FortschrittsRing prozent={fortschritt} groesse={92} dicke={9} farbe="#C96F4A">
          <span className="font-serif text-xl text-rost">{fortschritt}%</span>
        </FortschrittsRing>
        <div>
          <h2 className="text-lg">Gesamtfortschritt</h2>
          <p className="text-sm text-tinte/70">
            {BAU_SCHRITTE.filter((s) => state.schritte[String(s.nr)]?.status === "erledigt").length}{" "}
            von {BAU_SCHRITTE.length} Bau-Schritten erledigt
          </p>
          <Link to="/bauen" className="pill-hell mt-3">Zu den Schritten</Link>
        </div>
      </section>

      {/* Heute dran */}
      <section>
        <h2 className="text-xl mb-2">Heute dran</h2>
        <div className="karte divide-y divide-tinte/10">
          {heuteDran.length === 0 && (
            <p className="py-3 text-sm text-tinte/70">Alles erledigt. Gute Reise!</p>
          )}
          {heuteDran.map((s) => {
            const st = state.schritte[String(s.nr)]?.status ?? "offen";
            return (
              <Link key={s.nr} to="/bauen" className="flex items-center gap-3 py-3">
                <span className="font-serif text-2xl text-senf w-7 shrink-0">{s.nr}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{s.titel}</span>
                  <span className="block text-xs text-tinte/60">{s.zeit}</span>
                </span>
                <span
                  className={`badge ${
                    st === "blockiert"
                      ? "bg-rost/15 text-rost"
                      : st === "in-arbeit"
                        ? "bg-senf/20 text-tinte"
                        : "bg-creme text-tinte/60"
                  }`}
                >
                  {SCHRITT_STATUS_LABEL[st]}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grundriss */}
      <section>
        <Link to="/grundriss" className="karte flex items-center gap-4 active:bg-creme">
          <span className="text-terra"><IconGrundriss /></span>
          <span className="flex-1">
            <span className="block font-serif text-rost text-lg">Grundriss ansehen</span>
            <span className="block text-xs text-tinte/60">
              Draufsicht des Ausbaus, Konzeptdarstellung
            </span>
          </span>
          <span className="text-tinte/40 text-xl" aria-hidden>›</span>
        </Link>
      </section>

      {/* Daten */}
      <section>
        <h2 className="text-xl mb-2">Projekt und Daten</h2>
        <div className="karte space-y-3">
          <p className="text-sm text-tinte/70">
            Projekt-Code: <b className="text-tinte">{projektCode}</b> — Stand wird auf allen
            Geräten mit diesem Code synchronisiert und liegt zusätzlich offline auf diesem Gerät.
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="pill-hell" onClick={exportieren}>Export als JSON</button>
            <button className="pill-hell" onClick={() => dateiRef.current?.click()}>
              JSON importieren
            </button>
            <button className="pill-hell" onClick={projektWechseln}>Projekt wechseln</button>
          </div>
          <input
            ref={dateiRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importieren(f);
              e.target.value = "";
            }}
          />
        </div>
      </section>
    </div>
  );
}
