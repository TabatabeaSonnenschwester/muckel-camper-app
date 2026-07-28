import { useApp } from "@/lib/store";
import { MESS_LISTE } from "@/lib/data";
import { AmpelPunkt, ampelFuer } from "@/components/bits";

export default function Messen() {
  const { state, update } = useApp();

  const wertSetzen = (id: string, wert: string) =>
    update((p) => ({ ...p, messungen: { ...p.messungen, [id]: wert } }));

  const offenKritisch = MESS_LISTE.filter(
    (m) => m.kritischVorKonzept && !(state.messungen[m.id] ?? "").trim()
  ).length;

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-xl">Messliste</h2>
        <p className="text-sm text-tinte/70 mt-1">
          Vor jedem Zuschnitt am echten Fahrzeug messen. Jedes kritische Maß zweimal messen,
          beide Seiten prüfen — der kleinere Wert gilt.
        </p>
        {offenKritisch > 0 && (
          <p className="mt-2 text-sm text-rost font-medium">
            Noch {offenKritisch} kritische {offenKritisch === 1 ? "Messung" : "Messungen"} offen.
          </p>
        )}
      </section>

      <div className="divide-y divide-tinte/10">
        {MESS_LISTE.map((m) => {
          const ist = state.messungen[m.id] ?? "";
          const ampel = ampelFuer(ist, m.min, m.max, m.tol);
          const numerisch = m.min !== undefined;
          return (
            <article key={m.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base">{m.mass}</h3>
                  <p className="text-xs text-tinte/60 mt-0.5">{m.messpunkte}</p>
                </div>
                <span className="flex flex-col items-end gap-1 shrink-0">
                  {m.kritischVorKonzept && (
                    <span className="badge bg-rost/15 text-rost">kritisch</span>
                  )}
                  <span className="badge bg-creme text-tinte/60 border border-tinte/15">
                    Priorität {m.prio}
                  </span>
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-tinte/60">
                    Erwartung: <b className="text-tinte">{m.erwartung}</b> · {m.bedeutung}
                  </p>
                  {m.vorbelegtStatus && ist === m.vorbelegt && (
                    <p className="text-[11px] text-holz mt-0.5">{m.vorbelegtStatus}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    value={ist}
                    onChange={(e) => wertSetzen(m.id, e.target.value)}
                    placeholder={numerisch ? "Ist" : "Notiz"}
                    inputMode={numerisch ? "decimal" : "text"}
                    className="w-20 rounded-full bg-beige border border-tinte/20 px-3 py-1.5 text-sm text-center outline-none focus:border-terra"
                    aria-label={`Ist-Wert ${m.mass}`}
                  />
                  {numerisch && <span className="text-xs text-tinte/50">cm</span>}
                </div>
              </div>

              <div className="mt-2">
                <AmpelPunkt ampel={ampel} />
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-xs text-tinte/50 pb-2">
        Ampel: salbei gleich innerhalb der Toleranz, senf gleich knapp daneben,
        rostrot gleich kritisch abweichend. Graue Punkte warten auf einen Wert.
      </p>
    </div>
  );
}
