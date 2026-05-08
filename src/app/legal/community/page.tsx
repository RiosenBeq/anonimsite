import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "Topluluk Kuralları · Anonim",
};

export default async function CommunityPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/community" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>Topluluk Kuralları</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        Anonim&apos;in tek anayasası şu: <strong>başkasının yumuşak yerine değme.</strong>{" "}
        Bunun pratiği aşağıda.
      </p>

      <h2>1. Yapma Listesi</h2>
      <ul>
        <li>
          <strong>Şiddet talimatı, suç planlaması</strong>: Cinayet, suikast, bombalama,
          uyuşturucu temin, silah temin gibi konularda &quot;nasıl yapılır&quot; içeriği. Tıbbi
          veya akademik tartışma kabuldür; <em>nasıl</em> uygulayacağına dair adım-adım rehber
          değildir.
        </li>
        <li>
          <strong>Cinsel istismar materyali (CSAM)</strong>: Sıfır tolerans. İlgili kanunlar
          uyarınca derhal kaldırılır ve gereken makamlara bildirilir.
        </li>
        <li>
          <strong>Tehdit, taciz, doxxing</strong>: Bir kimseyi belirleyebilecek özel hayat
          ifşası, fiziksel tehdit, sürekli rahatsız etme.
        </li>
        <li>
          <strong>Nefret söylemi</strong>: Etnik köken, din, cinsiyet kimliği, cinsel yönelim,
          engel durumu üzerinden aşağılama.
        </li>
        <li>
          <strong>Spam ve dolandırıcılık</strong>: Reklam, sahte bağlantılar, kripto pump-and-dump,
          phishing.
        </li>
        <li>
          <strong>Telif/marka ihlali</strong>: Başkasının yazı, görsel, ses kaydını izinsiz tam
          olarak yapıştırma.
        </li>
      </ul>

      <h2>2. Otomatik Kelime Maskeleme</h2>
      <p>
        Cinayet, uyuşturucu maddeler, terör, cinsel şiddet, CSAM ve silah tedariği gibi
        kategorilerde geçen anahtar kelimeler hem yazma anında hem de okuma anında otomatik
        olarak <em>maskelenir</em> (örn. <code>c*****t</code>). Maskeleme:
      </p>
      <ul>
        <li>Cümlenin akışını koruyarak sadece belirli harfleri yıldıza çevirir.</li>
        <li>İçeriğin yayınlanmasına engel <em>değildir</em>; bir uyarı kutusunda bilgilendirme yapılır.</li>
        <li>
          Hukuki sorumluluğunu kaldırmaz. İçerik gerçekten suç oluşturuyorsa rapor süreciyle
          kaldırılır ve gereken yerlere bildirilir.
        </li>
        <li>
          Kapsama yanlışlıkla giren kelimeler için: bu sayfanın altındaki iletişim adresine yaz,
          beyaz listeye alalım.
        </li>
      </ul>

      <h2>3. İntihar / Kendine Zarar</h2>
      <p>
        Anonim, tam olarak başka yere sormaktan çekindiğin sorulara da yer açıyor — bu yüzden
        intihar/kendine zarar kelime dağarcığını <em>otomatik olarak maskelemiyoruz</em>.
        Bunun yerine kriz hattı bilgisi:
      </p>
      <ul>
        <li>
          Türkiye: <strong>İntihari Önleme Derneği</strong> · 0850 455 0 183 ·{" "}
          <a href="https://intiharinionleme.org/" rel="noreferrer">intiharinionleme.org</a>
        </li>
        <li>
          Türkiye Kızılay Psikososyal Destek hattı: <strong>168</strong>
        </li>
        <li>Acil sağlık: <strong>112</strong></li>
      </ul>

      <h2>4. Bildirim ve Yaptırım</h2>
      <p>
        Her soru ve cevabın altında <strong>Raporla</strong> butonu var. Sebep seç, isteğe
        bağlı detay ekle, gönder. Bildirimleri operasyon ekibimiz <em>72 saat</em> içinde
        inceler. Sonuç: kaldırma, oturum kapatma, gerekirse yetkili makamlara bildirim. Bir
        oturum saatte en fazla 5 rapor gönderebilir (kötüye kullanıma karşı).
      </p>
      <p>
        Resmi 5651 başvurusu için{" "}
        <a href="/legal/notice-takedown?lang=tr">Bildirim ve Kaldırma</a> sayfasına bak.
      </p>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>Community Guidelines</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        The single rule of Anonim: <strong>don&apos;t hurt someone&apos;s soft places.</strong>{" "}
        Specifics below.
      </p>

      <h2>1. The Don&apos;ts</h2>
      <ul>
        <li>
          <strong>Violence / crime instructions</strong>: how-to content on murder, bombing,
          drug procurement, weapon procurement. Discussion is fine; step-by-step manuals are not.
        </li>
        <li>
          <strong>Child sexual abuse material (CSAM)</strong>: zero tolerance. Removed
          immediately and reported to authorities.
        </li>
        <li>
          <strong>Threats, harassment, doxxing</strong>: identifying private info, threats,
          repeated unwanted contact.
        </li>
        <li>
          <strong>Hate speech</strong>: degrading content based on ethnicity, religion, gender
          identity, sexual orientation, disability.
        </li>
        <li>
          <strong>Spam and scams</strong>: ads, phishing links, crypto pump schemes.
        </li>
        <li>
          <strong>Copyright / trademark infringement</strong>: pasting another&apos;s full work
          without permission.
        </li>
      </ul>

      <h2>2. Automatic Word Masking</h2>
      <p>
        Keywords associated with homicide, illegal narcotics, terrorism, sexual violence, CSAM,
        and weapons procurement are <em>masked</em> on write and on read (e.g.{" "}
        <code>m****r</code>). The masker:
      </p>
      <ul>
        <li>Replaces some letters with asterisks while preserving sentence flow.</li>
        <li>Does not block publication; users see a notice that masking was applied.</li>
        <li>
          Does not waive liability. If content truly constitutes a crime, the report process
          removes it and notifies authorities as required.
        </li>
        <li>
          False positive? Email us — we&apos;ll allow-list the term.
        </li>
      </ul>

      <h2>3. Suicide / Self-harm</h2>
      <p>
        Anonim is partly a place to ask exactly the questions you can&apos;t ask anywhere else,
        so we deliberately <em>do not</em> auto-mask suicide / self-harm vocabulary. Crisis
        resources instead:
      </p>
      <ul>
        <li>
          Türkiye: <strong>İntihari Önleme Derneği</strong> · 0850 455 0 183 ·{" "}
          <a href="https://intiharinionleme.org/" rel="noreferrer">intiharinionleme.org</a>
        </li>
        <li>Turkish Red Crescent psychosocial line: <strong>168</strong></li>
        <li>Emergency: <strong>112</strong></li>
      </ul>

      <h2>4. Reports &amp; Enforcement</h2>
      <p>
        A <strong>Report</strong> button sits on every question and answer. Pick a reason, add
        optional detail, send. Reports are reviewed within <em>72 hours</em>. Outcomes: removal,
        session ban, escalation to authorities. A single session can file up to 5 reports per
        hour (anti-abuse).
      </p>
      <p>
        For a formal Turkish-law-5651 notice, see{" "}
        <a href="/legal/notice-takedown?lang=en">Notice &amp; Takedown</a>.
      </p>
    </article>
  );
}
