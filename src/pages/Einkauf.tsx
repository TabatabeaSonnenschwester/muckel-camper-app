import { useApp } from "@/lib/store";
import { BUDGET_EURO, KAUF_STATUS_LABEL, MATERIAL_LISTE } from "@/lib/data";
import type { KaufStatus } from "@/lib/data";
import { Balken } from "@/components/bits";

const STATUS_LISTE: KaufStatus[] = ["offen", "bestellt", "angekommen", "vorhanden"];

const STATUS_FARBE: Record<KaufStatus, string> = {
  "offen": "bg-creme text-tinte/60 border border-tinte/20",
  "bestellt": "bg-senf/25 text-tinte border border-senf/50",
  "angekommen": "bg-salbei/30 text-tinte border border-salbei/60",
  "vorhanden": "bg-holz/25 text-tinte border border-holz/50",
};

export default function Einkauf() {
  const { state, update } = useApp();

  const eintrag = (nr: number) =>
    state.einkauf[String(nr)] ?? { status: "offen" as KaufStatus, preis: 0 };

  // Budget: alles, was nicht mehr offen ist, zählt als gebunden/ausgegeben
  const gebunden = MATERIAL_LISTE.reduce((acc, p) => {
    const e = eintrag(p.nr);
    return e.status === "offen" ? acc : acc + (Number(e.preis) || 0);
  }, 0);
  const prozent = (gebunden / BUDGET_EURO) * 100;
  const offen = MATERIAL_LISTE.filter((p) => eintrag(p.nr).status === "offen").length;

  const statusSetzen = (nr: number, status: KaufStatus) =>
    update((p) => ({
      ...p,
      einkauf: { ...p.einkauf, [String(nr)]: { ...eintrag(nr), status } },
    }));

  const preisSetzen = (nr: number, roh: string) => {
    const wert = parseFloat(roh.replace(",", "."));
    update((p) => ({
      ...p,
      einkauf: {
        ...p.einkauf,
        [String(nr)]: { ...eintrag(nr), preis: isNaN(wert) ? 0 : Math.max(0, wert) },
      },
    }));
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-xl">Einkaufsliste</h2>
        <p className="text-sm text-tinte/70 mt-1">
          {MATERIAL_LISTE.length} Positionen aus der SPEC, Preise sind Schätzwerte
          (Deutschland, Stand 28.07.2026). Empfohlene Summe ohne Bestand: ca. 848 €.
        </p>
      </section>

      <section className="karte">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-serif text-2xl text-rost">{gebunden} €</span>
          <span className="text-sm text-tinte/70">von {BUDGET_EURO} € Budget</span>
        </div>
        <Balken
          prozent={prozent}
          farbe={prozent > 100 ? "#9D3D2C" : prozent >= 80 ? "#D9A441" : "#C96F4A"}
        />
        <p className="text-xs text-tinte/60 mt-2">
          Gebunden oder ausgegeben für bestellte, angekommene und vorhandene Positionen.
          Noch {offen} {offen === 1 ? "Position" : "Positionen"} offen.
          Kaufpreise für Kühlbox, Powerstation und Heckzelt bitte eintragen.
        </p>
      </section>

      <div className="divide-y divide-tinte/10">
        {MATERIAL_LISTE.map((p) => {
          const e = eintrag(p.nr);
          return (
            <article key={p.nr} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base">
                    <span className="text-senf font-serif mr-1.5">{p.nr}</span>
                    {p.name}
                  </h3>
                  <p className="text-xs text-tinte/60 mt-0.5">
                    {p.zweck} · {p.menge}
                  </p>
                  {p.notiz && <p className="text-[11px] text-holz mt-1">{p.notiz}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    value={e.preis === 0 && !p.preisOffen ? "" : String(e.preis || "")}
                    onChange={(ev) => preisSetzen(p.nr, ev.target.value)}
                    placeholder={p.preisOffen ? "Preis" : "0"}
                    inputMode="decimal"
                    className="w-16 rounded-full bg-beige border border-tinte/20 px-2.5 py-1.5 text-sm text-center outline-none focus:border-terra"
                    aria-label={`Preis ${p.name} in Euro`}
                  />
                  <span className="text-xs text-tinte/50">€</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {STATUS_LISTE.map((st) => (
                  <button
                    key={st}
                    onClick={() => statusSetzen(p.nr, st)}
                    className={`pill text-xs ${
                      e.status === st
                        ? STATUS_FARBE[st] + " font-semibold"
                        : "bg-creme text-tinte/50 border border-tinte/15"
                    }`}
                  >
                    {KAUF_STATUS_LABEL[st]}
                  </button>
                ))}
                {p.prio !== "erledigt" && (
                  <span className="badge bg-creme text-tinte/50 border border-tinte/10 self-center ml-auto">
                    Prio {p.prio}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-xs text-tinte/50 pb-2">
        Nicht sparen bei: Verankerung und Ladungssicherung, Kompressorkühlbox,
        Matratzenqualität, CO-Warnmelder und Feuerlöscher, Hundesicherung.
      </p>
    </div>
  );
}
