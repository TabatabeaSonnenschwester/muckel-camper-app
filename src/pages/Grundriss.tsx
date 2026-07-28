import { Link } from "react-router-dom";

export default function Grundriss() {
  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-xl">Grundriss, Draufsicht</h2>
        <p className="text-sm text-tinte/70 mt-1">
          Renault Espace III JE, Schlafmodus, Fahrtrichtung nach links.
          Maßstab: 1 Einheit gleich 10 mm, Außenmaß 452 × 181 Einheiten.
        </p>
      </section>

      <section className="karte">
        <svg viewBox="0 0 480 244" role="img" aria-label="Draufsicht Muckel-Camper" className="w-full h-auto block">
          {/* Fahrzeugkontur, außen 4517 × 1810 mm */}
          <rect x="8" y="20" width="452" height="181" rx="28"
            fill="#F4EDE0" stroke="#4A3728" strokeWidth="3" />

          {/* Windschutzscheibe vorne */}
          <path d="M 78 34 L 100 50 L 100 171 L 78 187 Z"
            fill="#EFE6CF" stroke="#A67C52" strokeWidth="1.5" />

          {/* Vordersitze */}
          <rect x="115" y="48" width="52" height="52" rx="10"
            fill="#8A9B6E" stroke="#4A3728" strokeWidth="1.5" />
          <rect x="115" y="121" width="52" height="52" rx="10"
            fill="#8A9B6E" stroke="#4A3728" strokeWidth="1.5" />
          <text x="141" y="77" textAnchor="middle" fontSize="10" fill="#F4EDE0">Fahrer</text>
          <text x="141" y="150" textAnchor="middle" fontSize="10" fill="#F4EDE0">Beifahrer</text>

          {/* Hundeplatz, Fußraum zweite Reihe */}
          <rect x="176" y="76" width="34" height="70" rx="8"
            fill="#EFE6CF" stroke="#A67C52" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="193" y="106" textAnchor="middle" fontSize="9" fill="#9D3D2C">Hund</text>
          <text x="193" y="118" textAnchor="middle" fontSize="8" fill="#A67C52">Fußraum</text>

          {/* Bettfläche 200 × 140 cm, Erwartungswert */}
          <rect x="218" y="41" width="200" height="140" rx="6"
            fill="#F4EDE0" stroke="#9D3D2C" strokeWidth="2" strokeDasharray="7 4" />
          <text x="318" y="36" textAnchor="middle" fontSize="9" fill="#9D3D2C">
            Bett 200 × 140, Erwartungswert
          </text>

          {/* Box links (oben in der Zeichnung) */}
          <rect x="218" y="44" width="200" height="32" rx="4"
            fill="#A67C52" stroke="#4A3728" strokeWidth="1.5" />
          <text x="318" y="64" textAnchor="middle" fontSize="9" fill="#F4EDE0">Box links, Technik + Kleidung</text>

          {/* Box rechts (unten in der Zeichnung) */}
          <rect x="218" y="146" width="200" height="32" rx="4"
            fill="#A67C52" stroke="#4A3728" strokeWidth="1.5" />
          <text x="318" y="166" textAnchor="middle" fontSize="9" fill="#F4EDE0">Box rechts, Küche + Vorräte</text>

          {/* Mittelfach mit Kühlbox und Kanistern */}
          <rect x="218" y="79" width="200" height="64" rx="4"
            fill="#EFE6CF" stroke="#D9A441" strokeWidth="1.5" />
          <rect x="336" y="89" width="58" height="44" rx="5"
            fill="#C96F4A" stroke="#4A3728" strokeWidth="1.5" />
          <text x="365" y="108" textAnchor="middle" fontSize="9" fill="#F4EDE0">Kühlbox</text>
          <text x="365" y="120" textAnchor="middle" fontSize="8" fill="#F4EDE0">12 V</text>
          <circle cx="252" cy="101" r="12" fill="#D9A441" stroke="#4A3728" strokeWidth="1.5" />
          <circle cx="252" cy="125" r="12" fill="#D9A441" stroke="#4A3728" strokeWidth="1.5" />
          <text x="252" y="141" textAnchor="middle" fontSize="8" fill="#4A3728" opacity="0.6">Kanister 2×10 l</text>

          {/* LED-Leiste Kopfseite */}
          <rect x="212" y="48" width="4" height="125" rx="2" fill="#D9A441" opacity="0.9" />
          <text x="204" y="112" textAnchor="end" fontSize="8" fill="#4A3728" opacity="0.6">LED Kopfseite</text>

          {/* Heckklappe hinten */}
          <line x1="452" y1="30" x2="452" y2="191" stroke="#4A3728" strokeWidth="4" />
          <text x="452" y="214" textAnchor="end" fontSize="9" fill="#4A3728" opacity="0.6">
            Heckklappe, Kochbereich bei geöffneter Klappe
          </text>

          {/* Maßangaben */}
          <text x="14" y="14" fontSize="10" fill="#4A3728">Länge 4517 mm, bestätigt</text>
          <text x="14" y="236" fontSize="10" fill="#4A3728">Breite 1810 mm, bestätigt</text>
        </svg>

        {/* Legende */}
        <div className="mt-4 pt-3 border-t linie grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-tinte/80">
          <span className="flex items-center gap-2">
            <svg width="26" height="12" aria-hidden><line x1="0" y1="6" x2="26" y2="6" stroke="#4A3728" strokeWidth="2.5" /></svg>
            bestätigtes Maß (Fahrzeugschein)
          </span>
          <span className="flex items-center gap-2">
            <svg width="26" height="12" aria-hidden><line x1="0" y1="6" x2="26" y2="6" stroke="#9D3D2C" strokeWidth="2.5" strokeDasharray="6 4" /></svg>
            Erwartungswert, Kontrolle offen
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#A67C52" }} aria-hidden />
            Stauraumboxen 200 × 32 × 40
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#C96F4A" }} aria-hidden />
            Kompressorkühlbox im Mittelfach
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: "#D9A441" }} aria-hidden />
            Kanister, LED-Licht
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: "#8A9B6E" }} aria-hidden />
            Vordersitze, im Stand vorgeschoben
          </span>
        </div>
      </section>

      <p className="text-xs text-tinte/50">
        Konzeptdarstellung, keine Bauzeichnung. Alle Innenmaße sind Erwartungswerte
        und werden vor dem Zuschnitt am Fahrzeug kontrolliert, siehe{" "}
        <Link to="/messen" className="underline text-rost">Messliste</Link>.
        Mittelfach ca. 70 cm breit, Bettfläche auf ca. 40 cm Höhe,
        Stauraum unter dem Bett ca. 35 cm hoch.
      </p>
    </div>
  );
}
