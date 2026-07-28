import { useState } from "react";
import { DEFAULT_PROJEKT_CODE } from "@/lib/data";

export function Onboarding({ onFertig }: { onFertig: (code: string) => void }) {
  const [code, setCode] = useState(DEFAULT_PROJEKT_CODE);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-senf text-sm tracking-wide mb-2">Renault Espace III · Umbauwoche</p>
        <h1 className="text-3xl text-center mb-2">Muckel-Camper Baubegleiter</h1>
        <p className="text-center text-tinte/70 text-sm mb-8">
          Alle Listen am Auto, ohne Papier. Auf beiden Handys synchron,
          sobald ihr denselben Projekt-Code eingebt.
        </p>

        <label htmlFor="projektcode" className="block text-sm font-medium mb-1.5">
          Projekt-Code
        </label>
        <input
          id="projektcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full rounded-full bg-beige border border-tinte/20 px-4 py-3 text-center text-lg outline-none focus:border-terra"
        />
        <p className="text-xs text-tinte/60 mt-2 text-center">
          Zum Beispiel „muckel-2026“. Einfach denselben Code auf beiden Geräten eingeben.
        </p>

        <button
          className="pill-primaer w-full mt-6 py-3 text-base"
          onClick={() => onFertig(code)}
        >
          Los geht’s
        </button>
      </div>
    </div>
  );
}
