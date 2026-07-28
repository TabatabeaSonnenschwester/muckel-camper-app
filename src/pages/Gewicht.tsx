import { useApp } from "@/lib/store";
import { GEWICHT_LISTE, ZULADUNG_KG } from "@/lib/data";
import { Balken } from "@/components/bits";

export default function Gewicht() {
  const { state, update } = useApp();

  const summe = GEWICHT_LISTE.reduce(
    (acc, g) => acc + (Number(state.gewichte[g.id]) || 0),
    0
  );
  const prozent = (summe / ZULADUNG_KG) * 100;
  const rest = ZULADUNG_KG - summe;
  const warnung = prozent >= 80;

  const wertSetzen = (id: string, roh: string) => {
    const wert = parseFloat(roh.replace(",", "."));
    update((p) => ({
      ...p,
      gewichte: { ...p.gewichte, [id]: isNaN(wert) ? 0 : Math.max(0, wert) },
    }));
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-xl">Gewicht und Zuladung</h2>
        <p className="text-sm text-tinte/70 mt-1">
          Zulässige Gesamtmasse 2300 kg minus 1565 kg fahrbereit ergibt{" "}
          <b className="text-tinte">{ZULADUNG_KG} kg Zuladung</b>. Schätzung aus der SPEC,
          Fahrzeug noch nicht gewogen. Die ausgebauten Sitze (geschätzt 60–100 kg) erhöhen
          die Reserve zusätzlich.
        </p>
      </section>

      <section className="karte">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-serif text-2xl text-rost">{summe} kg</span>
          <span className="text-sm text-tinte/70">
            {rest >= 0 ? `noch ${rest} kg frei` : `${-rest} kg zu viel`}
          </span>
        </div>
        <Balken
          prozent={prozent}
          farbe={summe > ZULADUNG_KG ? "#9D3D2C" : warnung ? "#D9A441" : "#8A9B6E"}
        />
        <div className="flex justify-between text-[11px] text-tinte/50 mt-1">
          <span>0</span>
          <span>80% bei {Math.round(ZULADUNG_KG * 0.8)} kg</span>
          <span>{ZULADUNG_KG} kg</span>
        </div>
        {warnung && summe <= ZULADUNG_KG && (
          <p className="mt-3 text-sm font-medium text-rost">
            Achtung: über 80% der Zuladung ausgelastet. Schwere Teile tief und mittig laden,
            Kühlbox und Kanister ins Mittelfach hinter die Vordersitze.
          </p>
        )}
        {summe > ZULADUNG_KG && (
          <p className="mt-3 text-sm font-semibold text-rost">
            Zuladung überschritten — etwas muss raus oder das Fahrzeug muss gewogen werden.
          </p>
        )}
      </section>

      <div className="divide-y divide-tinte/10">
        {GEWICHT_LISTE.map((g) => (
          <div key={g.id} className="py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{g.name}</p>
              {g.notiz && <p className="text-xs text-tinte/60">{g.notiz}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                value={String(state.gewichte[g.id] ?? g.kg)}
                onChange={(e) => wertSetzen(g.id, e.target.value)}
                inputMode="decimal"
                className="w-20 rounded-full bg-beige border border-tinte/20 px-3 py-1.5 text-sm text-center outline-none focus:border-terra"
                aria-label={`Gewicht ${g.name} in Kilogramm`}
              />
              <span className="text-xs text-tinte/50 w-6">kg</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-tinte/50 pb-2">
        Ergebnis vorläufig: Fahrzeug wenn möglich nach der Probeladung wiegen,
        siehe Bau-Schritt 10.
      </p>
    </div>
  );
}
