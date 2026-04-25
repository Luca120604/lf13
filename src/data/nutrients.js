export const NUTRIENTS = [
  {
    k: 'eisen',
    name: 'Eisen',
    emoji: '🩸',
    short: 'Sauerstoff im Blut, Ausdauer',
    why:
      'Ohne genug Eisen wird der Sauerstofftransport müde — und du auf den Anstiegen auch. Bei Männern über 50 kommt das selten vor, ist aber bei dauernder Erschöpfung einen Bluttest wert.',
    sources: ['Rotes Fleisch (mager)', 'Linsen, Kichererbsen', 'Haferflocken', 'Kürbiskerne'],
    tip: 'Mit Vitamin C kombinieren (Paprika, Zitrone) — die Aufnahme verdoppelt sich fast.',
  },
  {
    k: 'magnesium',
    name: 'Magnesium',
    emoji: '⚡',
    short: 'Krämpfe, Schlaf, Nerven',
    why:
      'Wenn die Wade nachts ziept oder du nach langen Touren schlecht schläfst, ist Magnesium oft der Hebel. Schweiß zieht es zusätzlich raus.',
    sources: ['Vollkornbrot', 'Mandeln, Cashews', 'Bitterschokolade (>70 %)', 'Bananen'],
    tip: 'Eine Hand voll Nüsse am Nachmittag deckt rund ein Drittel des Tagesbedarfs.',
  },
  {
    k: 'vitd',
    name: 'Vitamin D',
    emoji: '☀️',
    short: 'Knochen, Immunsystem, Stimmung',
    why:
      'Im Schwarzwald-Winter wird die Haut zu wenig Sonne sehen, um genug Vitamin D zu bilden. Bei vielen über 60 ist der Spiegel im Frühjahr im Keller.',
    sources: ['Lachs, Hering, Makrele', 'Eigelb', 'Pilze (mit Tageslicht)', 'Supplement im Winter'],
    tip: 'Lass den Spiegel einmal beim Hausarzt messen — dann weißt du, ob du ergänzen musst.',
  },
  {
    k: 'b12',
    name: 'Vitamin B12',
    emoji: '🧠',
    short: 'Nerven, Konzentration, Blutbildung',
    why:
      'Die Aufnahme von B12 wird ab 60 schlechter, ganz unabhängig davon, wie viel du isst. Müdigkeit oder Kribbeln in den Füßen können Hinweise sein.',
    sources: ['Fleisch, Fisch', 'Eier', 'Milchprodukte', 'B12-angereicherte Hafer-/Sojadrinks'],
    tip: 'Wenn du wenig tierische Produkte isst, lohnt sich eine kleine Tagesdosis als Tablette.',
  },
  {
    k: 'omega3',
    name: 'Omega-3',
    emoji: '🐟',
    short: 'Herz, Gefäße, Entzündung runter',
    why:
      'Omega-3 hält die Gefäße geschmeidig — gerade nach Jahren mit Bluthochdruck oder erhöhten Blutfetten ein stiller Verbündeter.',
    sources: ['Lachs, Hering, Makrele (2× pro Woche)', 'Walnüsse', 'Leinöl, Rapsöl', 'Chia-, Leinsamen'],
    tip: 'Ein Esslöffel Leinöl im Quark zum Frühstück bringt dich schon weit.',
  },
  {
    k: 'kalium',
    name: 'Kalium',
    emoji: '🍌',
    short: 'Blutdruck, Muskelkontraktion',
    why:
      'Kalium ist der Gegenspieler von zu viel Salz. Wer den Blutdruck im Blick hat, profitiert von kaliumreicher Kost — besonders bei langen Touren mit viel Schwitzen.',
    sources: ['Bananen', 'Kartoffeln (mit Schale)', 'Spinat, Mangold', 'Aprikosen (auch getrocknet)'],
    tip: 'Eine Banane vor dem Anstieg — alter Trick, wirkt wirklich.',
  },
  {
    k: 'protein',
    name: 'Eiweiß',
    emoji: '💪',
    short: 'Muskeln halten, Regeneration',
    why:
      'Ab 60 baut der Körper Muskeln schneller ab als auf — außer du gibst ihm regelmäßig Eiweiß. Auf dem Rad merkst du das an der Kraft auf den letzten Kilometern.',
    sources: ['Quark, Skyr, Joghurt', 'Eier', 'Hülsenfrüchte', 'Geflügel, Fisch'],
    tip: 'Faustregel: zu jeder Hauptmahlzeit eine Portion Eiweiß so groß wie deine Handfläche.',
  },
]

export const TIPS = [
  {
    title: 'Erst trinken, dann losfahren',
    body:
      'Ein großes Glas Wasser zehn Minuten vor Tour-Start spart dir die erste Trinkpause — und beugt dem Mittagstief auf dem Rad vor.',
  },
  {
    title: 'Kinzigtal-Wind ernst nehmen',
    body:
      'Hin mit Rückenwind ist verlockend, zurück gegen den Wind brutal. Plan die Tour so, dass der Gegenwind in die ersten 60 % fällt.',
  },
  {
    title: 'Eiweiß zum Frühstück',
    body:
      'Quark mit Beeren oder ein Ei zum Brot hält länger satt als Marmelade allein — gut, wenn du erst nach 11 Uhr losfährst.',
  },
  {
    title: 'Ohne Helm geht gar nicht',
    body: 'Klingt banal, ist aber das größte Sicherheitsplus pro Gramm Material — und kostet dich keine Watt.',
  },
  {
    title: 'Die 80/20-Regel auf dem Rad',
    body:
      '80 % der Zeit locker fahren („du könntest noch reden"), 20 % zügig. Das hält Herz und Knie gesund — und macht erstaunlich schnell.',
  },
  {
    title: 'Kettenpflege rettet Watt',
    body: 'Eine saubere, geölte Kette spart real 5–10 Watt. Einmal pro Woche reicht im Sommer, alle 3 Tage im Regen.',
  },
  {
    title: 'Mittagshitze meiden',
    body:
      'Im Hochsommer lieber 7–10 Uhr fahren oder nach 17 Uhr. Bei über 28 °C steigt der Puls bei gleicher Leistung deutlich.',
  },
]

export function pickTipOfDay(tips, date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date - start) / 86400000)
  return tips[day % tips.length]
}
