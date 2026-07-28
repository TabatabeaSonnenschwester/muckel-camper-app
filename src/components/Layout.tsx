import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "@/lib/store";
import {
  IconBauen,
  IconEinkauf,
  IconGewicht,
  IconMessen,
  IconStart,
  SyncBadge,
} from "./bits";

const TABS = [
  { pfad: "/", label: "Start", icon: <IconStart />, ende: true },
  { pfad: "/bauen", label: "Bauen", icon: <IconBauen />, ende: false },
  { pfad: "/messen", label: "Messen", icon: <IconMessen />, ende: false },
  { pfad: "/gewicht", label: "Gewicht", icon: <IconGewicht />, ende: false },
  { pfad: "/einkauf", label: "Einkauf", icon: <IconEinkauf />, ende: false },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { syncStatus, projektCode } = useApp();
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="sticky top-0 z-50 bg-creme/95 border-b linie">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg leading-6">Muckel-Camper</h1>
            <p className="text-[11px] text-tinte/60">Baubegleiter · {projektCode}</p>
          </div>
          <SyncBadge status={syncStatus} />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 pt-4 pb-28">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-beige border-t linie">
        <div className="mx-auto max-w-lg grid grid-cols-5">
          {TABS.map((t) => (
            <NavLink
              key={t.pfad}
              to={t.pfad}
              end={t.ende}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                  isActive ? "text-rost font-semibold" : "text-tinte/60"
                }`
              }
            >
              {t.icon}
              {t.label}
            </NavLink>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
