import Link from "next/link";
import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const DOCS_TR = [
  { href: "/legal/terms", title: "Kullanım Koşulları", desc: "Hizmeti hangi şartlarla kullanırsın" },
  { href: "/legal/privacy", title: "Gizlilik Politikası", desc: "Ne saklıyoruz, ne saklamıyoruz" },
  { href: "/legal/kvkk", title: "KVKK Aydınlatma Metni", desc: "Kişisel veri işleme aydınlatması (6698)" },
  { href: "/legal/cookies", title: "Çerez Politikası", desc: "Hangi çerezi neden kullanıyoruz" },
  { href: "/legal/community", title: "Topluluk Kuralları", desc: "Burada konuşurken uyduğumuz şeyler" },
  {
    href: "/legal/notice-takedown",
    title: "Bildirim ve Kaldırma",
    desc: "5651 sayılı kanun çerçevesinde içerik bildirimi",
  },
];

const DOCS_EN = [
  { href: "/legal/terms", title: "Terms of Service", desc: "Conditions for using Anonim" },
  { href: "/legal/privacy", title: "Privacy Policy", desc: "What we keep and what we don't" },
  { href: "/legal/kvkk", title: "KVKK Disclosure", desc: "Personal data disclosure (Turkish DPA)" },
  { href: "/legal/cookies", title: "Cookie Policy", desc: "Which cookies we use, and why" },
  { href: "/legal/community", title: "Community Guidelines", desc: "How we behave in here" },
  {
    href: "/legal/notice-takedown",
    title: "Notice & Takedown",
    desc: "Content reporting under Turkish law nº 5651",
  },
];

export default async function LegalIndex({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  const docs = lang === "tr" ? DOCS_TR : DOCS_EN;
  return (
    <>
      <LangToggle basePath="/legal" active={lang} />
      <h1>{lang === "tr" ? "Hukuki Metinler" : "Legal"}</h1>
      <p className="legal-meta">
        {lang === "tr"
          ? "Anonim'in nasıl çalıştığını ve seninle nasıl bir sözleşme kurduğumuzu burada açıklıyoruz."
          : "How Anonim works and what you agree to when you use it."}
      </p>
      <ul className="legal-index">
        {docs.map((d) => (
          <li key={d.href}>
            <Link href={`${d.href}?lang=${lang}`}>
              <span className="li-title">{d.title}</span>
              <span className="li-desc">{d.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
