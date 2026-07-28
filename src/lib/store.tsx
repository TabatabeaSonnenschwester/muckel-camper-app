/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { supabase } from "./supabase";
import { Onboarding } from "../pages/Onboarding";
import {
  BAU_SCHRITTE,
  DEFAULT_ABREISE,
  DEFAULT_PROJEKT_CODE,
  GEWICHT_LISTE,
  MATERIAL_LISTE,
  MESS_LISTE,
} from "./data";
import type { KaufStatus, SchrittStatus } from "./data";

// ---------- State-Typen ----------

export interface SchrittState {
  status: SchrittStatus;
  notiz: string;
}

export interface EinkaufState {
  status: KaufStatus;
  preis: number; // tatsächlicher bzw. geschätzter Preis in Euro
}

export interface AppState {
  abreiseDatum: string; // ISO yyyy-mm-dd
  schritte: Record<string, SchrittState>;
  messungen: Record<string, string>; // Ist-Werte als Text
  gewichte: Record<string, number>;
  einkauf: Record<string, EinkaufState>;
}

export type SyncStatus = "offline" | "verbunden" | "synchronisiert";

function defaultState(): AppState {
  const schritte: Record<string, SchrittState> = {};
  for (const s of BAU_SCHRITTE) schritte[String(s.nr)] = { status: "offen", notiz: "" };

  const messungen: Record<string, string> = {};
  for (const m of MESS_LISTE) messungen[m.id] = m.vorbelegt ?? "";

  const gewichte: Record<string, number> = {};
  for (const g of GEWICHT_LISTE) gewichte[g.id] = g.kg;

  const einkauf: Record<string, EinkaufState> = {};
  for (const p of MATERIAL_LISTE)
    einkauf[String(p.nr)] = { status: p.startStatus, preis: p.preis };

  return { abreiseDatum: DEFAULT_ABREISE, schritte, messungen, gewichte, einkauf };
}

function mergeWithDefaults(roh: unknown): AppState {
  const basis = defaultState();
  if (!roh || typeof roh !== "object") return basis;
  const r = roh as Partial<AppState>;
  return {
    abreiseDatum: typeof r.abreiseDatum === "string" ? r.abreiseDatum : basis.abreiseDatum,
    schritte: { ...basis.schritte, ...(r.schritte ?? {}) },
    messungen: { ...basis.messungen, ...(r.messungen ?? {}) },
    gewichte: { ...basis.gewichte, ...(r.gewichte ?? {}) },
    einkauf: { ...basis.einkauf, ...(r.einkauf ?? {}) },
  };
}

// ---------- Projekt-Code (Onboarding) ----------

const CODE_KEY = "muckel:projektcode";

export function gespeicherterCode(): string | null {
  return localStorage.getItem(CODE_KEY);
}

// ---------- Context ----------

interface AppKontext {
  state: AppState;
  update: (fn: (prev: AppState) => AppState) => void;
  ersetzen: (neu: AppState) => void;
  syncStatus: SyncStatus;
  projektCode: string;
  projektWechseln: () => void;
  bereit: boolean;
}

const Ctx = createContext<AppKontext | null>(null);

export function useApp(): AppKontext {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp außerhalb des Providers");
  return v;
}

// ---------- Provider ----------

export function AppProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string | null>(gespeicherterCode());

  const codeSetzen = (neu: string) => {
    const bereinigt = neu.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || DEFAULT_PROJEKT_CODE;
    localStorage.setItem(CODE_KEY, bereinigt);
    setCode(bereinigt);
  };

  if (!code) {
    return <OnboardingGate onFertig={codeSetzen} />;
  }
  return <StateSyncer key={code} code={code} onWechsel={() => setCode(null)}>{children}</StateSyncer>;
}

function OnboardingGate({ onFertig }: { onFertig: (code: string) => void }) {
  return <Onboarding onFertig={onFertig} />;
}

function StateSyncer({
  code,
  onWechsel,
  children,
}: {
  code: string;
  onWechsel: () => void;
  children: ReactNode;
}) {
  const cacheKey = `muckel:state:${code}`;
  const tsKey = `muckel:updated:${code}`;

  const [state, setState] = useState<AppState>(() => {
    try {
      const roh = localStorage.getItem(cacheKey);
      if (roh) return mergeWithDefaults(JSON.parse(roh));
    } catch {
      // Cache kaputt, Standard verwenden
    }
    return defaultState();
  });
  const [bereit, setBereit] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    navigator.onLine ? "verbunden" : "offline"
  );

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const zuletztUebernommen = useRef<string>(localStorage.getItem(tsKey) ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ausstehend = useRef(false);

  const pushen = useCallback(async () => {
    ausstehend.current = false;
    const jetzt = new Date().toISOString();
    zuletztUebernommen.current = jetzt;
    localStorage.setItem(tsKey, jetzt);
    const { error } = await supabase.from("muckel_state").upsert({
      id: code,
      data: stateRef.current,
      updated_at: jetzt,
    });
    setSyncStatus(error ? (navigator.onLine ? "verbunden" : "offline") : "synchronisiert");
  }, [code, tsKey]);

  const planPush = useCallback(() => {
    ausstehend.current = true;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void pushen();
    }, 800);
  }, [pushen]);

  const update = useCallback(
    (fn: (prev: AppState) => AppState) => {
      setState((prev) => {
        const neu = fn(prev);
        localStorage.setItem(cacheKey, JSON.stringify(neu));
        return neu;
      });
      planPush();
    },
    [cacheKey, planPush]
  );

  const ersetzen = useCallback(
    (neu: AppState) => {
      localStorage.setItem(cacheKey, JSON.stringify(neu));
      setState(neu);
      planPush();
    },
    [cacheKey, planPush]
  );

  // Initial laden + Realtime
  useEffect(() => {
    let aktiv = true;

    async function laden() {
      const { data, error } = await supabase
        .from("muckel_state")
        .select("data, updated_at")
        .eq("id", code)
        .maybeSingle();
      if (!aktiv) return;
      if (!error && data) {
        const fremdTs = String(data.updated_at ?? "");
        if (fremdTs > zuletztUebernommen.current) {
          const neu = mergeWithDefaults(data.data);
          zuletztUebernommen.current = fremdTs;
          localStorage.setItem(cacheKey, JSON.stringify(neu));
          localStorage.setItem(tsKey, fremdTs);
          setState(neu);
        }
        setSyncStatus("synchronisiert");
      } else if (!error && !data) {
        // Zeile existiert noch nicht: aktuellen Stand hochladen
        void pushen();
      }
      setBereit(true);
    }
    void laden();

    const kanal = supabase
      .channel(`muckel-${code}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "muckel_state", filter: `id=eq.${code}` },
        (payload) => {
          const zeile = payload.new as { data?: unknown; updated_at?: string };
          const fremdTs = String(zeile.updated_at ?? "");
          if (fremdTs && fremdTs > zuletztUebernommen.current) {
            const neu = mergeWithDefaults(zeile.data);
            zuletztUebernommen.current = fremdTs;
            localStorage.setItem(cacheKey, JSON.stringify(neu));
            localStorage.setItem(tsKey, fremdTs);
            setState(neu);
            setSyncStatus("synchronisiert");
          }
        }
      )
      .subscribe((status) => {
        if (!aktiv) return;
        if (status === "SUBSCRIBED") {
          setSyncStatus((s) => (s === "offline" ? s : "verbunden"));
        }
      });

    const offline = () => setSyncStatus("offline");
    const online = () => {
      setSyncStatus("verbunden");
      if (ausstehend.current) void pushen();
      else void laden();
    };
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);

    return () => {
      aktiv = false;
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        void pushen();
      }
      void supabase.removeChannel(kanal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const wert = useMemo<AppKontext>(
    () => ({
      state,
      update,
      ersetzen,
      syncStatus,
      projektCode: code,
      projektWechseln: onWechsel,
      bereit,
    }),
    [state, update, ersetzen, syncStatus, code, onWechsel, bereit]
  );

  return <Ctx.Provider value={wert}>{children}</Ctx.Provider>;
}
