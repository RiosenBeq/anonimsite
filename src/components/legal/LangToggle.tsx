import Link from "next/link";

interface Props {
  basePath: string;
  active: "tr" | "en";
}

export function LangToggle({ basePath, active }: Props) {
  return (
    <div className="legal-lang" aria-label="Dil seçimi">
      <Link href={`${basePath}?lang=tr`} className={active === "tr" ? "on" : ""}>
        Türkçe
      </Link>
      <Link href={`${basePath}?lang=en`} className={active === "en" ? "on" : ""}>
        English
      </Link>
    </div>
  );
}

export function pickLang(value: string | string[] | undefined): "tr" | "en" {
  const v = Array.isArray(value) ? value[0] : value;
  return v === "en" ? "en" : "tr";
}
