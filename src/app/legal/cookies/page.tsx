import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "Çerez Politikası · Anonim",
};

export default async function CookiesPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/cookies" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>Çerez Politikası</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        Anonim, üçüncü taraf izleme veya reklam çerezi <strong>kullanmaz</strong>. Aşağıdaki
        listede gördüklerin tamamı, Hizmet&apos;in çalışması için gerekli olan zorunlu
        çerezlerdir.
      </p>

      <h2>1. Kullanılan Çerezler</h2>
      <table className="admin-table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Türü</th>
            <th>Süre</th>
            <th>Amaç</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>anonim_session</code></td>
            <td>Birinci taraf · zorunlu</td>
            <td>365 gün</td>
            <td>
              Soru/cevap sahipliğini doğrulamak, kullanıcı deneyimi için (ör. kendi sorunu silmek).
              HttpOnly &amp; SameSite=Lax. Hiçbir kişisel veri içermez.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>2. Üçüncü Taraf Çerezler</h2>
      <p>
        Hizmet, Vercel ve Supabase altyapılarında çalışır. Bu sağlayıcılar yalnızca operasyonel
        nedenlerle (DDoS koruması, fonksiyonel yönlendirme) kısa süreli teknik çerez yazabilir.
        İzleme/analiz/reklam çerezi entegrasyonumuz <strong>yoktur</strong>.
      </p>

      <h2>3. Çerez Yönetimi</h2>
      <p>
        Tarayıcının çerez ayarlarından <code>anonim_session</code> çerezini istediğin zaman
        silebilirsin. Sildiğinde sonraki ziyarette yeni bir UUID üretilir; eski içeriklerine
        bağlı &quot;benim sorularım&quot; görünümü kaybolur ama içeriklerin yayında kalır.
      </p>

      <h2>4. Yasal Çerçeve</h2>
      <p>
        Bu çerez 5651 sayılı kanun uyarınca işlevsel/zorunlu sayılır; KVKK m.5/2-c kapsamında
        sözleşmenin ifası için işlenir, ayrı bir &quot;açık rıza&quot; aranmaz.
      </p>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>Cookie Policy</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        Anonim does <strong>not</strong> use third-party tracking or advertising cookies. The
        only cookie listed below is strictly necessary for the Service to work.
      </p>

      <h2>1. Cookies Used</h2>
      <table className="admin-table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Duration</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>anonim_session</code></td>
            <td>First-party · strictly necessary</td>
            <td>365 days</td>
            <td>
              Confirms ownership of your posts. HttpOnly &amp; SameSite=Lax. Contains no personal data.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>2. Third-Party Cookies</h2>
      <p>
        The Service runs on Vercel and Supabase. Those providers may set short-lived
        operational cookies (DDoS protection, functional routing). We do <strong>not</strong>{" "}
        integrate analytics or advertising trackers.
      </p>

      <h2>3. Managing Cookies</h2>
      <p>
        You can delete <code>anonim_session</code> from your browser at any time. A new UUID
        will be generated on your next visit; your &quot;my saves&quot; view resets but your
        public posts remain.
      </p>

      <h2>4. Legal Basis</h2>
      <p>
        This cookie is strictly necessary; processed under contract performance (KVKK Art.
        5/2-c). No separate consent is required.
      </p>
    </article>
  );
}
