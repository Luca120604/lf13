// Symptom-basierter Mangel-Schnellcheck.
// WICHTIG: keine Diagnose. Nur grobe Orientierung.
// Quellen-Logik: typische Lehrbuch-Zuordnungen (DGE, "könnte sein"-Stil).

export const SYMPTOM_GROUPS = [
  {
    id: 'energy',
    label: 'Energie & Müdigkeit',
    icon: '🔋',
    symptoms: [
      { id: 'fatigue', label: 'Ständig müde', tags: ['eisen', 'b12', 'vit_d', 'dehydration'] },
      { id: 'breath', label: 'Schnell außer Atem', tags: ['eisen', 'fitness'] },
      { id: 'pale', label: 'Blasse Haut / Lippen', tags: ['eisen'] },
      { id: 'cold', label: 'Kalte Hände / Füße', tags: ['eisen', 'kreislauf'] },
      { id: 'dizzy', label: 'Schwindel beim Aufstehen', tags: ['eisen', 'dehydration', 'kreislauf'] },
    ],
  },
  {
    id: 'muscles',
    label: 'Muskeln & Krämpfe',
    icon: '💪',
    symptoms: [
      { id: 'cramps', label: 'Wadenkrämpfe', tags: ['magnesium', 'calcium', 'dehydration'] },
      { id: 'twitch', label: 'Muskelzucken', tags: ['magnesium', 'calcium'] },
      { id: 'tingling', label: 'Kribbeln in Händen / Füßen', tags: ['b12', 'calcium'] },
      { id: 'weakness', label: 'Allgemeine Muskelschwäche', tags: ['vit_d', 'magnesium', 'protein'] },
    ],
  },
  {
    id: 'mind',
    label: 'Kopf & Stimmung',
    icon: '🧠',
    symptoms: [
      { id: 'concentration', label: 'Konzentration fällt schwer', tags: ['eisen', 'b12', 'dehydration', 'schlaf'] },
      { id: 'irritable', label: 'Reizbar, kurzer Geduldsfaden', tags: ['magnesium', 'b12', 'vit_d'] },
      { id: 'mood_low', label: 'Stimmung dauerhaft mau', tags: ['vit_d', 'b12', 'omega3'] },
      { id: 'sleep', label: 'Schlafe schlecht', tags: ['magnesium', 'vit_d'] },
      { id: 'headache', label: 'Kopfschmerzen', tags: ['dehydration', 'magnesium'] },
    ],
  },
  {
    id: 'haut',
    label: 'Haut, Haare & Nägel',
    icon: '🪞',
    symptoms: [
      { id: 'hair_loss', label: 'Haarausfall', tags: ['eisen', 'zink', 'protein'] },
      { id: 'brittle_nails', label: 'Brüchige Nägel', tags: ['eisen', 'zink', 'calcium', 'protein'] },
      { id: 'wound_slow', label: 'Wunden heilen langsam', tags: ['zink', 'vit_c', 'protein'] },
      { id: 'gum_bleed', label: 'Zahnfleischbluten', tags: ['vit_c'] },
      { id: 'skin_dry', label: 'Sehr trockene Haut', tags: ['omega3', 'vit_a', 'dehydration'] },
      { id: 'breakouts', label: 'Hautprobleme / Ausschläge', tags: ['zink', 'vit_a'] },
    ],
  },
  {
    id: 'immune',
    label: 'Immunsystem & Sonstiges',
    icon: '🛡️',
    symptoms: [
      { id: 'infections', label: 'Häufige Erkältungen', tags: ['vit_d', 'zink', 'vit_c'] },
      { id: 'bones', label: 'Knochen- / Gelenkschmerzen', tags: ['vit_d', 'calcium'] },
      { id: 'tongue_burn', label: 'Zungenbrennen / glatte Zunge', tags: ['b12', 'eisen'] },
      { id: 'thirsty', label: 'Ständig durstig', tags: ['dehydration'] },
      { id: 'dark_urine', label: 'Dunkler Urin', tags: ['dehydration'] },
    ],
  },
]

export const DEFICIENCIES = {
  eisen: {
    label: 'Eisen',
    icon: '🩸',
    desc: 'Eisen brauchst du, damit dein Blut Sauerstoff durch den Körper trägt. Wenig Eisen → wenig Power.',
    foods: 'Rotes Fleisch, Linsen, Kichererbsen, Spinat, Haferflocken, Kürbiskerne. Tipp: mit Vitamin C (Orangensaft, Paprika) kombinieren — Eisen wird besser aufgenommen.',
    when: 'Bei 3+ passenden Symptomen oder anhaltender Müdigkeit: **Bluttest (Ferritin) beim Hausarzt**.',
  },
  magnesium: {
    label: 'Magnesium',
    icon: '⚡',
    desc: 'Wichtig für Muskeln, Nerven und Schlaf. Geht beim Schwitzen verloren — Sportler:innen oft betroffen.',
    foods: 'Nüsse (besonders Mandeln), Vollkorn, Bananen, dunkle Schokolade, Hülsenfrüchte, Mineralwasser.',
    when: 'Bei häufigen Krämpfen oder Muskelzucken: 1× am Tag Magnesium ausprobieren. Bleibt es: zum Arzt.',
  },
  vit_d: {
    label: 'Vitamin D',
    icon: '☀️',
    desc: 'Wird über Sonne auf der Haut gebildet. Im Winter und bei viel Drinnen-Sein oft zu wenig.',
    foods: 'Fetter Fisch (Lachs, Hering), Eigelb, Pilze. Im Winter ggf. Tropfen.',
    when: 'Im Schwarzwald-Winter ohne viel Tageslicht ist Mangel häufig — **Bluttest beim Arzt** ist sinnvoll.',
  },
  b12: {
    label: 'Vitamin B12',
    icon: '🌱',
    desc: 'Wichtig fürs Nervensystem und die Blutbildung. Hauptsächlich in tierischen Produkten — Vegetarier:innen / Veganer:innen besonders im Auge behalten.',
    foods: 'Fleisch, Fisch, Eier, Milchprodukte. Vegan: Nahrungsergänzung empfehlenswert.',
    when: 'Bei Kribbeln, Zungenbrennen oder anhaltender Erschöpfung: Bluttest beim Arzt.',
  },
  calcium: {
    label: 'Calcium',
    icon: '🦴',
    desc: 'Knochen, Zähne, Muskelarbeit. Bei Milchverzicht schnell mal zu wenig.',
    foods: 'Milchprodukte, Brokkoli, Grünkohl, Mandeln, calciumreiches Mineralwasser.',
    when: 'Brüchige Zähne / Nägel + Krämpfe: zum Arzt.',
  },
  zink: {
    label: 'Zink',
    icon: '🛡️',
    desc: 'Hilft Immunsystem und Wundheilung. Schnell mal aufgebraucht bei viel Stress oder Sport.',
    foods: 'Fleisch, Käse, Haferflocken, Kürbiskerne, Linsen.',
    when: 'Bei häufigen Infekten + langsamer Wundheilung: Hausarzt fragen.',
  },
  vit_c: {
    label: 'Vitamin C',
    icon: '🍊',
    desc: 'Stärkt Bindegewebe und Immunsystem. Geht beim Kochen schnell kaputt.',
    foods: 'Paprika, Brokkoli, Zitrusfrüchte, Beeren, Hagebutten.',
    when: 'Zahnfleischbluten + viele Erkältungen: einfach mehr frisches Obst & Gemüse.',
  },
  protein: {
    label: 'Eiweiß',
    icon: '🥚',
    desc: 'Ohne genug Eiweiß baut der Körper Muskeln, Haare und Nägel ab.',
    foods: 'Eier, Quark, Hülsenfrüchte, Tofu, Fleisch, Fisch, Nüsse.',
    when: 'Bei Haarausfall + Muskelschwäche + brüchigen Nägeln: Mahlzeiten checken.',
  },
  omega3: {
    label: 'Omega-3',
    icon: '🐟',
    desc: 'Wichtig fürs Herz, Hirn und Stimmung.',
    foods: 'Fetter Fisch (Lachs, Makrele), Leinöl, Walnüsse, Chiasamen.',
    when: 'Bei trockener Haut + niedriger Stimmung: 2× pro Woche fetter Fisch — oder Algenöl-Kapseln.',
  },
  vit_a: {
    label: 'Vitamin A',
    icon: '🥕',
    desc: 'Augen, Haut, Schleimhäute.',
    foods: 'Karotten, Süßkartoffeln, Spinat, Eigelb, Leber.',
    when: 'Selten reiner Mangel — meist mit anderen Themen kombiniert.',
  },
  dehydration: {
    label: 'Zu wenig Wasser',
    icon: '💧',
    desc: 'Häufigste Ursache für viele kleine Symptome. Easy zu beheben.',
    foods: 'Mindestens **1,5–2 L Wasser** pro Tag, mehr bei Sport oder Hitze.',
    when: 'Sofort behebbar: heute mehr trinken und morgen nochmal checken.',
  },
  schlaf: {
    label: 'Zu wenig Schlaf',
    icon: '😴',
    desc: 'Vieles davon ist einfach Schlafmangel — bevor du an Mineralien denkst.',
    foods: '7–8 h pro Nacht, Bildschirme weg vor dem Schlafen.',
    when: 'Anhaltende Schlafprobleme: Schlafhygiene checken, sonst Hausarzt.',
  },
  fitness: {
    label: 'Trainingsstand',
    icon: '🚴',
    desc: 'Manches gibt sich mit ein paar Wochen regelmäßiger Bewegung.',
    foods: '—',
    when: 'Erst dranbleiben, dann anders denken.',
  },
  kreislauf: {
    label: 'Kreislauf',
    icon: '🌀',
    desc: 'Niedriger Blutdruck oder schwacher Kreislauf — oft harmlos, aber kontrollierbar.',
    foods: 'Genug trinken, Wechselduschen, regelmäßige Bewegung.',
    when: 'Wenn Schwindel öfter auftritt: Blutdruck messen lassen.',
  },
}

// Score-basierte Auswertung. Zählt wie oft jede Defizit-Tag in den
// gewählten Symptomen vorkommt und sortiert. Gibt Top-3 zurück.
export function analyzeSymptoms(selectedIds) {
  const all = SYMPTOM_GROUPS.flatMap((g) => g.symptoms)
  const counts = {}
  for (const id of selectedIds) {
    const sym = all.find((s) => s.id === id)
    if (!sym) continue
    for (const tag of sym.tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }

  const sorted = Object.entries(counts)
    .map(([tag, count]) => ({ tag, count, ...DEFICIENCIES[tag] }))
    .filter((d) => d.label) // nur die mit Eintrag in DEFICIENCIES
    .sort((a, b) => b.count - a.count)

  return sorted
}
