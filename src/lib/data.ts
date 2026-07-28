// Inhalte aus Muckel-Camper SPEC v0.1 (Abschnitte 5, 17, 18, 21)

export type SchrittStatus = "offen" | "in-arbeit" | "erledigt" | "blockiert";
export type KaufStatus = "offen" | "bestellt" | "angekommen" | "vorhanden";

export interface BauSchritt {
  nr: number;
  titel: string;
  zeit: string;
  hinweis?: string;
}

export const BAU_SCHRITTE: BauSchritt[] = [
  { nr: 1, titel: "Kontrollmessung am Fahrzeug", zeit: "60–90 Min", hinweis: "Blockiert alle weiteren Schritte, höchste Priorität" },
  { nr: 2, titel: "Zuschnittliste erstellen und Holz kaufen", zeit: "ca. 2 Std. inkl. Fahrt", hinweis: "Nach Schritt 1, 5 mm Luft pro Seite einplanen" },
  { nr: 3, titel: "Boxen links und rechts bauen", zeit: "5–6 Std. für beide Boxen", hinweis: "Zwei Boxen 200 × 32 × 40 cm mit Deckel" },
  { nr: 4, titel: "Bettplatten und klappbare Lehne", zeit: "3–4 Std.", hinweis: "Nach Schritt 3, Radkastenaussparung nicht vergessen" },
  { nr: 5, titel: "Verankerung über Arretierungsstäbe in den Sitzaufnahmen", zeit: "2–3 Std.", hinweis: "Parallel zu Schritt 4 möglich, Rütteltest, sicherheitsrelevant" },
  { nr: 6, titel: "Verdunkelung zuschneiden", zeit: "ca. 2 Std.", hinweis: "Nach Schritt 1, jederzeit parallel, immer Kartonschablone zuerst" },
  { nr: 7, titel: "Insektengitter nähen", zeit: "2–3 Std.", hinweis: "Parallel möglich, großzügig messen" },
  { nr: 8, titel: "Elektrik einrichten", zeit: "1–2 Std. plus Testlauf", hinweis: "Nach Schritt 3, Testlauf Kühlbox 24 Std. zu Hause" },
  { nr: 9, titel: "Textilien und Dekoration", zeit: "2–3 Std.", hinweis: "Nach Schritt 4, nichts lose im Fahrgastraum" },
  { nr: 10, titel: "Probeladung, Probefahrt, Gewichtskontrolle", zeit: "ca. 2 Std.", hinweis: "Alle vorherigen Schritte, danach Schrauben nachziehen" },
];

export interface MessEintrag {
  id: string;
  mass: string;
  messpunkte: string;
  erwartung: string;
  bedeutung: string;
  prio: 1 | 2 | 3 | 4;
  kritischVorKonzept: boolean;
  vorbelegt?: string;
  vorbelegtStatus?: string;
  // Ampel-Logik, nur wenn numerisch messbar
  min?: number; // Erwartungsbereich von, cm
  max?: number; // Erwartungsbereich bis, cm
  tol?: number; // Toleranz, cm
}

export const MESS_LISTE: MessEintrag[] = [
  {
    id: "innenlaenge-max",
    mass: "Innenlänge maximal",
    messpunkte: "Rückseite vorgeschobene Vordersitze bis innere Heckklappe",
    erwartung: "ca. 230–250 cm",
    bedeutung: "Bestimmt Bettlänge und Grundrissrichtung",
    prio: 1, kritischVorKonzept: true,
    min: 230, max: 250, tol: 3,
  },
  {
    id: "innenlaenge-reihe2",
    mass: "Innenlänge hinter Reihe 2 Restsitz",
    messpunkte: "Lehne Restsitz bis Heckklappe",
    erwartung: "ca. 210 cm",
    bedeutung: "Variante Schlafen neben Restsitz",
    prio: 2, kritischVorKonzept: false,
    min: 210, max: 210, tol: 3,
  },
  {
    id: "breite-radkaesten",
    mass: "Breite zwischen Radkästen",
    messpunkte: "Engste Stelle auf Bodenhöhe",
    erwartung: "ca. 100–115 cm",
    bedeutung: "Bestimmt Bettbreite und Modulbreite",
    prio: 1, kritischVorKonzept: true,
    min: 100, max: 115, tol: 2,
  },
  {
    id: "breite-liegehoehe",
    mass: "Nutzbare Breite auf Liegehöhe",
    messpunkte: "Engste Stelle auf ca. 40 cm Höhe",
    erwartung: "140 cm",
    bedeutung: "Bestätigt Lattenrostbreite",
    prio: 1, kritischVorKonzept: true,
    min: 140, max: 140, tol: 2,
    vorbelegt: "140", vorbelegtStatus: "Gemessen von Nutzerin, bestätigt",
  },
  {
    id: "innenhoehe",
    mass: "Lichte Innenhöhe",
    messpunkte: "Boden bis Dachhimmel, vorne, mitte, hinten",
    erwartung: "ca. 110 cm (Foto 3)",
    bedeutung: "Sitzhöhe auf Bett, Stauraumhöhe",
    prio: 1, kritischVorKonzept: true,
    min: 110, max: 110, tol: 2,
    vorbelegt: "110", vorbelegtStatus: "Aus Fotomessung, zu verifizieren",
  },
  {
    id: "fensterunterkante",
    mass: "Höhe Fensterunterkante",
    messpunkte: "Boden bis Unterkante Seitenfenster",
    erwartung: "ca. 46 cm (Foto 1)",
    bedeutung: "Höhe Liegefläche ohne Sicht nach innen",
    prio: 2, kritischVorKonzept: false,
    min: 46, max: 46, tol: 1,
    vorbelegt: "46", vorbelegtStatus: "Aus Fotomessung, zu verifizieren",
  },
  {
    id: "sitzschienen",
    mass: "Sitzschienen, Abstand und Länge",
    messpunkte: "Mitte Schiene zu Mitte Schiene, Länge der Metallführung",
    erwartung: "offen",
    bedeutung: "Verankerung der Module ohne Bohren, Notizskizze liegt vor",
    prio: 1, kritischVorKonzept: true,
  },
  {
    id: "bodenniveau",
    mass: "Bodenniveau",
    messpunkte: "Höhenprofil längs, Schienen und Teppich",
    erwartung: "offen",
    bedeutung: "Ebene Liegefläche, Keile oder Unterbau",
    prio: 2, kritischVorKonzept: false,
  },
  {
    id: "heckoeffnung",
    mass: "Hecköffnung",
    messpunkte: "Breite und Höhe der Klappenöffnung",
    erwartung: "115 × 105 cm",
    bedeutung: "Einbringen von Modulen und Matratze, hier Breite eintragen",
    prio: 3, kritischVorKonzept: false,
    min: 115, max: 115, tol: 2,
  },
  {
    id: "ladekante",
    mass: "Ladekantenhöhe",
    messpunkte: "Straße bis Ladeboden",
    erwartung: "offen",
    bedeutung: "Arbeitshöhe, Küchenmodul am Heck",
    prio: 4, kritischVorKonzept: false,
  },
  {
    id: "fenstermasse",
    mass: "Fenstermaße",
    messpunkte: "Je Seitenfenster und Heckscheibe, Breite × Höhe",
    erwartung: "offen",
    bedeutung: "Verdunkelung und Insektenschutz",
    prio: 2, kritischVorKonzept: false,
  },
  {
    id: "batterie",
    mass: "Batterieposition und 12-Volt-Punkte",
    messpunkte: "Motorraum oder Fond, Sicherungskasten",
    erwartung: "offen",
    bedeutung: "Stromkonzept, Sichtprüfung und Foto",
    prio: 3, kritischVorKonzept: false,
  },
];

export interface MaterialPosition {
  nr: number;
  name: string;
  zweck: string;
  menge: string;
  preis: number; // geschätzter Gesamtpreis Euro, 0 = offen/vorhanden
  preisOffen?: boolean;
  gewichtKg: number;
  prio: "hoch" | "mittel" | "niedrig" | "erledigt";
  startStatus: KaufStatus;
  notiz?: string;
}

export const MATERIAL_LISTE: MaterialPosition[] = [
  { nr: 1, name: "Sperrholzplatten", zweck: "Boxen und Bettplatten", menge: "3 Platten, 15 mm, 250 × 125 cm", preis: 135, gewichtKg: 55, prio: "hoch", startStatus: "offen", notiz: "Alternative 12 mm spart 8 kg" },
  { nr: 2, name: "Kantholz", zweck: "Gestell, Verankerung", menge: "4 Stück, 44 × 68 mm, 2 m", preis: 20, gewichtKg: 6, prio: "hoch", startStatus: "offen", notiz: "Vorhandene Leisten prüfen" },
  { nr: 3, name: "Schrauben, Winkel, Scharniere", zweck: "Korpus und Lehne", menge: "1 Sortiment, 4 × 40, Klavierband", preis: 35, gewichtKg: 2, prio: "hoch", startStatus: "offen" },
  { nr: 4, name: "Schlossschrauben M8", zweck: "Schienenverankerung", menge: "8 Stück, mit Scheiben und Muttern", preis: 15, gewichtKg: 1, prio: "hoch", startStatus: "offen" },
  { nr: 5, name: "Holzöl", zweck: "Oberfläche, lebensmittelecht", menge: "1 Dose Leinöl oder Hartöl", preis: 15, gewichtKg: 1, prio: "mittel", startStatus: "offen" },
  { nr: 6, name: "Kaltschaummatratze", zweck: "Bett", menge: "vorhanden, siehe Bestandsliste", preis: 0, gewichtKg: 12, prio: "erledigt", startStatus: "vorhanden" },
  { nr: 7, name: "Kompressorkühlbox", zweck: "Kühlung", menge: "1 Stück, Modellangabe ausstehend", preis: 0, preisOffen: true, gewichtKg: 12, prio: "erledigt", startStatus: "bestellt", notiz: "Gekauft am 28.07.2026, Kaufpreis eintragen" },
  { nr: 8, name: "Powerstation", zweck: "Strom", menge: "1 Stück, Modellangabe ausstehend", preis: 0, preisOffen: true, gewichtKg: 5, prio: "erledigt", startStatus: "bestellt", notiz: "Gekauft am 28.07.2026, Kaufpreis eintragen" },
  { nr: 9, name: "CEE-Adapter plus Kabel", zweck: "Campingplatzstrom", menge: "1 Set, CEE auf Schuko, 10 m", preis: 20, gewichtKg: 2, prio: "mittel", startStatus: "offen" },
  { nr: 10, name: "Gaskocher plus Kartuschen", zweck: "Kochen", menge: "1 Set, Einflamm, Gaskartusche", preis: 25, gewichtKg: 2, prio: "hoch", startStatus: "offen" },
  { nr: 11, name: "Kanister", zweck: "Wasser", menge: "2 Stück je 10 Liter, lebensmittelecht", preis: 20, gewichtKg: 1, prio: "hoch", startStatus: "offen" },
  { nr: 12, name: "Alu-Dämmmatte plus Saugnäpfe", zweck: "Verdunkelung", menge: "1 Rolle plus 20 Saugnäpfe, ca. 6 m²", preis: 50, gewichtKg: 3, prio: "hoch", startStatus: "offen" },
  { nr: 13, name: "Moskitonetz plus Magnetband", zweck: "Insektenschutz", menge: "1 Set, ca. 3 m² Netz", preis: 20, gewichtKg: 1, prio: "mittel", startStatus: "offen" },
  { nr: 14, name: "LED-Beleuchtung", zweck: "Licht", menge: "USB-Leiste, Lichterkette warmweiß, Klemmlampe", preis: 35, gewichtKg: 1, prio: "mittel", startStatus: "offen" },
  { nr: 15, name: "Textilien", zweck: "Bettwäsche, Kissen, Teppich", menge: "1 Set, Erdtöne, Baumwolle", preis: 80, gewichtKg: 5, prio: "mittel", startStatus: "offen", notiz: "Secondhand möglich" },
  { nr: 16, name: "Verzurrgurte", zweck: "Ladungssicherung", menge: "4 Stück mit Ratsche", preis: 15, gewichtKg: 1, prio: "hoch", startStatus: "offen" },
  { nr: 17, name: "CO-Warnmelder und Klein-Feuerlöscher", zweck: "Sicherheit", menge: "Je 1, EN 50291, Löscher 1 kg", preis: 40, gewichtKg: 2, prio: "hoch", startStatus: "offen" },
  { nr: 18, name: "Filz, Kabelkletten, Klett", zweck: "Antiklappern, Kabel", menge: "1 Set, Filzstreifen, Klettband", preis: 15, gewichtKg: 1, prio: "mittel", startStatus: "offen" },
  { nr: 19, name: "Hunde-Gurtgeschirr", zweck: "Hundesicherung", menge: "1 Stück, falls nicht vorhanden", preis: 25, gewichtKg: 1, prio: "hoch", startStatus: "offen", notiz: "Geschirr mit Gurtadapter laut Bestand vorhanden" },
  { nr: 20, name: "Dekoration", zweck: "Makramee, Wimpel", menge: "1 Set nach Geschmack", preis: 25, gewichtKg: 1, prio: "niedrig", startStatus: "offen", notiz: "Selbst knüpfen möglich" },
  { nr: 21, name: "Heckzelt", zweck: "Regenschutz und Wohnraum an der Heckklappe", menge: "1 Stück, Modellangabe ausstehend", preis: 0, preisOffen: true, gewichtKg: 6, prio: "erledigt", startStatus: "bestellt", notiz: "Gekauft am 28.07.2026, früher verfügbar als geplant, Kaufpreis eintragen" },
];

export interface GewichtsPosition {
  id: string;
  name: string;
  kg: number;
  notiz?: string;
}

// SPEC Abschnitt 21, Gewichtsschätzung, vorläufig
export const GEWICHT_LISTE: GewichtsPosition[] = [
  { id: "ausbau", name: "Ausbau komplett", kg: 115, notiz: "Matratze darin enthalten" },
  { id: "kuehlbox", name: "Kühlbox gefüllt", kg: 22, notiz: "leer ca. 12 kg" },
  { id: "kanister", name: "Kanister voll", kg: 21, notiz: "2 × 10 Liter plus Kanister" },
  { id: "powerstation", name: "Powerstation", kg: 5 },
  { id: "gepaeck", name: "Gepäck zwei Personen", kg: 60 },
  { id: "lebensmittel", name: "Lebensmittel", kg: 15 },
  { id: "hund", name: "Hund (Havapoo)", kg: 7 },
  { id: "personen", name: "Personen", kg: 160 },
];

export const ZULADUNG_KG = 735;
export const BUDGET_EURO = 1000;
export const DEFAULT_ABREISE = "2026-08-04";
export const PROJEKT_START = "2026-07-28";
export const DEFAULT_PROJEKT_CODE = "muckel-2026";

export const SCHRITT_STATUS_LABEL: Record<SchrittStatus, string> = {
  "offen": "offen",
  "in-arbeit": "in Arbeit",
  "erledigt": "erledigt",
  "blockiert": "blockiert",
};

export const KAUF_STATUS_LABEL: Record<KaufStatus, string> = {
  "offen": "offen",
  "bestellt": "bestellt",
  "angekommen": "angekommen",
  "vorhanden": "vorhanden",
};
