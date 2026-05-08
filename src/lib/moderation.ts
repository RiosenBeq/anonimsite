// Moderation: keyword masking for content that depicts or proposes serious
// crimes (homicide, narcotics traffic, sexual violence, CSAM, terrorism,
// weapons procurement). Masking is applied both write-side (server actions)
// and read-side (query mappers) so historic rows are also covered when the
// list is updated.
//
// We deliberately do NOT mask self-harm / suicide vocabulary — Anonim is in
// part a place to ask those questions, and silencing them is harmful. Crisis
// resources are surfaced in the Topluluk Kuralları page instead.

const TR_WORD_CHAR = "[a-zA-ZçğıöşüÇĞİÖŞÜ]";
const NB_START = `(?<!${TR_WORD_CHAR})`;
const NB_END = `(?!${TR_WORD_CHAR})`;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stem = (s: string): RegExp =>
  new RegExp(`${NB_START}(?:${escapeRe(s)}${TR_WORD_CHAR}*)${NB_END}`, "giu");

const phrase = (...words: string[]): RegExp => {
  const parts = words.map(escapeRe);
  return new RegExp(`${NB_START}(?:${parts.join("\\s+")}${TR_WORD_CHAR}*)${NB_END}`, "giu");
};

interface BannedPattern {
  category: "violence" | "drugs" | "sexual_violence" | "csam" | "terror" | "weapons";
  label: string;
  pattern: RegExp;
}

// Stems are matched at Turkish-aware word boundaries with optional inflection
// suffixes (so "uyuşturucular", "uyuşturucuya" all hit "uyuşturucu"). Phrases
// must match the full sequence with whitespace between words.
const BANNED: BannedPattern[] = [
  // ---- Violence (concrete homicide vocabulary; "öldür" intentionally left
  // off because it's metaphorical in Turkish — "beni öldürüyor", "kendimi
  // öldürmek istiyorum") ----
  { category: "violence", label: "tr:cinayet", pattern: stem("cinayet") },
  { category: "violence", label: "tr:suikast", pattern: stem("suikast") },
  { category: "violence", label: "tr:katliam", pattern: stem("katliam") },
  { category: "violence", label: "en:murder", pattern: stem("murder") },
  { category: "violence", label: "en:homicide", pattern: stem("homicide") },
  { category: "violence", label: "en:assassinate", pattern: stem("assassinat") },
  { category: "violence", label: "en:massacre", pattern: stem("massacre") },

  // ---- Narcotics ("esrar" intentionally left off because in formal Turkish
  // it also means 'mystery' — too many false positives) ----
  { category: "drugs", label: "tr:uyusturucu", pattern: stem("uyuşturucu") },
  { category: "drugs", label: "tr:eroin", pattern: stem("eroin") },
  { category: "drugs", label: "tr:kokain", pattern: stem("kokain") },
  { category: "drugs", label: "tr:metamfetamin", pattern: stem("metamfetamin") },
  { category: "drugs", label: "tr:amfetamin", pattern: stem("amfetamin") },
  { category: "drugs", label: "tr:morfin", pattern: stem("morfin") },
  { category: "drugs", label: "tr:fentanil", pattern: stem("fentanil") },
  { category: "drugs", label: "en:heroin", pattern: stem("heroin") },
  { category: "drugs", label: "en:cocaine", pattern: stem("cocaine") },
  { category: "drugs", label: "en:methamphetamine", pattern: stem("methamphetamin") },
  { category: "drugs", label: "en:fentanyl", pattern: stem("fentanyl") },
  { category: "drugs", label: "en:meth", pattern: phrase("crystal", "meth") },

  // ---- Sexual violence ----
  { category: "sexual_violence", label: "tr:tecavuz", pattern: stem("tecavüz") },
  { category: "sexual_violence", label: "en:rape", pattern: stem("rape") },
  { category: "sexual_violence", label: "en:rapist", pattern: stem("rapist") },
  { category: "sexual_violence", label: "en:molest", pattern: stem("molest") },

  // ---- CSAM (no exceptions) ----
  { category: "csam", label: "tr:cocuk-porno", pattern: phrase("çocuk", "porno") },
  { category: "csam", label: "tr:cocuk-istismar", pattern: phrase("çocuk", "istismar") },
  { category: "csam", label: "tr:pedofil", pattern: stem("pedofil") },
  { category: "csam", label: "en:child-porn", pattern: phrase("child", "porn") },
  { category: "csam", label: "en:csam", pattern: stem("csam") },
  { category: "csam", label: "en:pedophile", pattern: stem("pedophil") },
  { category: "csam", label: "en:paedophile", pattern: stem("paedophil") },

  // ---- Terror ----
  { category: "terror", label: "tr:teror-orgut", pattern: phrase("terör", "örgüt") },
  { category: "terror", label: "tr:bombalama", pattern: stem("bombalama") },
  { category: "terror", label: "tr:bomba-yap", pattern: phrase("bomba", "yap") },
  { category: "terror", label: "en:terror-attack", pattern: phrase("terror", "attack") },
  { category: "terror", label: "en:terrorist", pattern: stem("terrorist") },
  { category: "terror", label: "en:bomb-make", pattern: phrase("bomb", "making") },
  { category: "terror", label: "en:make-bomb", pattern: phrase("make", "a", "bomb") },

  // ---- Weapons procurement ----
  { category: "weapons", label: "tr:silah-temin", pattern: phrase("silah", "temin") },
  { category: "weapons", label: "tr:silah-satin", pattern: phrase("silah", "satın") },
  { category: "weapons", label: "en:buy-gun-illegal", pattern: phrase("buy", "a", "gun", "illegally") },
  { category: "weapons", label: "en:untraceable-gun", pattern: phrase("untraceable", "gun") },
];

const maskWord = (w: string): string => {
  if (w.length <= 2) return w;
  if (w.length === 3) return `${w[0]}*${w[2]}`;
  return `${w[0]}${"*".repeat(w.length - 2)}${w[w.length - 1]}`;
};

// Mask each whitespace-separated piece while preserving the spacing between
// pieces, so a phrase like "child porn" becomes "c***d p**n" (sentence flow
// preserved).
const maskMatch = (match: string): string =>
  match.replace(/\S+/g, (token) => maskWord(token));

export interface MaskResult {
  masked: string;
  hits: { label: string; category: BannedPattern["category"] }[];
}

export function maskBannedWords(input: string): MaskResult {
  if (!input) return { masked: input, hits: [] };
  let masked = input;
  const hits: MaskResult["hits"] = [];
  for (const rule of BANNED) {
    masked = masked.replace(rule.pattern, (match) => {
      hits.push({ label: rule.label, category: rule.category });
      return maskMatch(match);
    });
  }
  return { masked, hits };
}

