import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "Gizlilik Politikası · Anonim",
  description: "Anonim'de hangi veriyi neden işliyoruz.",
};

export default async function PrivacyPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/privacy" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>Gizlilik Politikası</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        Anonim, &quot;mümkün olan en az veri&quot; ilkesiyle çalışır. Hiçbir e-posta, telefon,
        ad-soyad veya profil fotoğrafı toplamıyoruz. Bu sayfa hangi minimum veriyi neden
        topladığımızı, nasıl koruduğumuzu ve haklarını anlatır.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        Anonim — yer tutucu unvan ve adres yayına alınmadan önce burada yer alacak. İletişim:{" "}
        <a href="mailto:privacy@anonim.example">privacy@anonim.example</a>.
      </p>

      <h2>2. İşlediğimiz Veriler</h2>
      <h3>2.1 Oturum çerezi</h3>
      <p>
        İlk ziyaretinde tarayıcına <code>anonim_session</code> adıyla, HttpOnly ve SameSite=Lax
        özellikli, rastgele üretilmiş bir UUID yazıyoruz. Bu UUID seni{" "}
        <em>kişisel olarak tanımlamaz</em>; sadece &quot;senin yazdığın soru sensin&quot; demeye yarar
        (örn. kendi sorunu silebilmen için). 365 gün saklanır; tarayıcı çerezini silersen kaybolur,
        bu da hesabın yokmuş gibi davranmamızla aynı şeydir.
      </p>

      <h3>2.2 İçerik</h3>
      <p>
        Yayınladığın soru, cevap, tepki ve favori. Yayın anında oturum UUID&apos;n ile birleştirilir;
        ekranda görünmeyen takma adın (pseudonym) sunucuda otomatik üretilir.
      </p>

      <h3>2.3 Teknik kayıtlar</h3>
      <p>
        Vercel ve Supabase, Hizmet&apos;in çalışması için zorunlu olarak IP adresi ve
        User-Agent gibi teknik bilgileri sınırlı süre tutar. Anonim, bu kayıtları doğrudan
        kullanıcı içerikleriyle eşleştirmez. Operasyonel hata ayıklama dışında okumayız.
      </p>

      <h3>2.4 Toplamadıklarımız</h3>
      <ul>
        <li>E-posta, telefon, ad-soyad, kimlik bilgisi</li>
        <li>Konum (GPS), reklam ID&apos;si</li>
        <li>Üçüncü parti analiz / pazarlama çerezi</li>
        <li>Profil fotoğrafı veya biyografi</li>
      </ul>

      <h2>3. İşleme Amaçları ve Hukuki Dayanak (KVKK m.5)</h2>
      <ul>
        <li>
          <strong>Hizmetin sunulması</strong> (oturum yönetimi, içeriğin sahibi olduğunu
          doğrulama) — sözleşmenin ifası için gereklidir.
        </li>
        <li>
          <strong>Hukuki yükümlülüklerin yerine getirilmesi</strong> (5651 ihbar/kaldırma,
          mahkeme kararıyla içerik kaldırma) — kanunda öngörülmüş olması.
        </li>
        <li>
          <strong>Güvenlik ve kötüye kullanımın önlenmesi</strong> (rate-limit, otomatik
          moderasyon) — meşru menfaat.
        </li>
      </ul>

      <h2>4. Aktarımlar</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — barındırma, edge ağı (ABD/AB). Standart
          sözleşme maddeleri (SCC) ile aktarım.
        </li>
        <li>
          <strong>Supabase</strong> — yönetilen Postgres veritabanı (Hizmet bölgesi: us-east-1).
          Veriler şifreli (TLS in-transit, AES-at-rest) tutulur.
        </li>
      </ul>
      <p>Türkiye dışında bir aktarım yapılması durumunda KVKK m.9 hükümlerine uyulur.</p>

      <h2>5. Saklama Süreleri</h2>
      <ul>
        <li>Oturum çerezi: 365 gün</li>
        <li>Yayınlanan içerik: silinene veya hesap aktivitesi bitene kadar</li>
        <li>Teknik kayıtlar (Vercel/Supabase): operatör politikalarınca, tipik 30–90 gün</li>
        <li>Bildirim/raporlar: işlem kapatıldıktan sonra 1 yıl</li>
      </ul>

      <h2>6. Haklarınız (KVKK m.11)</h2>
      <p>
        İşlenen kişisel verilerinizi sorgulayabilir; düzeltme, silme, işlemenin sınırlandırılması
        ve aktarımın engellenmesini isteyebilirsiniz. Kimliğin doğrulanması için makul bir yol
        (ör. ilgili oturum çerezinden gönderilen bir doğrulama kodu) talep edebiliriz.
      </p>
      <p>
        Başvuru: <a href="mailto:privacy@anonim.example">privacy@anonim.example</a>. Yanıt süremiz
        en geç <strong>30 gündür</strong>. Cevabımızı yetersiz bulursanız Kişisel Verileri Koruma
        Kuruluna şikayet hakkınız saklıdır (<a href="https://www.kvkk.gov.tr/">kvkk.gov.tr</a>).
      </p>

      <h2>7. Çocukların Verisi</h2>
      <p>
        Hizmet 13 yaş altına yöneltilmemiştir. 13 yaş altı kullanıcıdan gelmiş olduğunu bildiğimiz
        her veriyi haber alındığı an siler ve içerikleri kaldırırız.
      </p>

      <h2>8. Değişiklikler</h2>
      <p>
        Bu politikayı güncellediğimizde &quot;Yürürlük tarihi&quot; alanı güncellenir; geriye
        dönük etki içeren bir değişiklik için ana sayfada özel bir bildirim yayınlarız.
      </p>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        Anonim is built on the &quot;collect as little as possible&quot; principle. We do not
        collect email, phone, name, or profile photo. This page lists what minimum data we do
        collect, why, and your rights.
      </p>

      <h2>1. Controller</h2>
      <p>
        Anonim — placeholder operator details to be filled in before launch. Contact:{" "}
        <a href="mailto:privacy@anonim.example">privacy@anonim.example</a>.
      </p>

      <h2>2. Data we process</h2>
      <h3>2.1 Session cookie</h3>
      <p>
        On first visit we set <code>anonim_session</code>, an HttpOnly, SameSite=Lax cookie
        containing a randomly generated UUID. The UUID does not identify you personally; it lets
        you delete your own posts and see your saves. It expires in 365 days; clearing the
        cookie effectively resets the session.
      </p>

      <h3>2.2 Content</h3>
      <p>
        Questions, answers, reactions, saves you post. They are tied to your session UUID; the
        public-facing pseudonym is generated server-side.
      </p>

      <h3>2.3 Technical logs</h3>
      <p>
        Vercel and Supabase keep operational logs (IP, User-Agent) for short windows.
        Anonim does not join these to your content; we read them only for operational
        debugging.
      </p>

      <h3>2.4 What we don&apos;t collect</h3>
      <ul>
        <li>Email, phone, name, government ID</li>
        <li>GPS location, advertising IDs</li>
        <li>Third-party analytics or marketing cookies</li>
        <li>Profile photo or bio</li>
      </ul>

      <h2>3. Purposes &amp; legal bases</h2>
      <ul>
        <li>
          <strong>Service provision</strong> (session, content ownership) — performance of contract.
        </li>
        <li>
          <strong>Legal compliance</strong> (5651 takedowns, court orders) — legal obligation.
        </li>
        <li>
          <strong>Safety &amp; abuse prevention</strong> (rate limits, auto-moderation) — legitimate interest.
        </li>
      </ul>

      <h2>4. Transfers</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — hosting and edge network. Cross-border transfer governed by SCCs.
        </li>
        <li>
          <strong>Supabase</strong> — managed Postgres (us-east-1). Data encrypted in transit and at rest.
        </li>
      </ul>

      <h2>5. Retention</h2>
      <ul>
        <li>Session cookie: 365 days</li>
        <li>Posted content: until deleted or session inactive</li>
        <li>Technical logs (Vercel/Supabase): typically 30–90 days</li>
        <li>Reports: 1 year after the case is closed</li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        You may ask us to confirm what we process, correct, delete, restrict processing, or
        oppose transfer. We may ask for a verification step using your existing session cookie.
      </p>
      <p>
        Requests: <a href="mailto:privacy@anonim.example">privacy@anonim.example</a>. We respond
        within <strong>30 days</strong>. If you find our response insufficient, you may complain
        to the Turkish DPA (KVKK) at <a href="https://www.kvkk.gov.tr/">kvkk.gov.tr</a>.
      </p>

      <h2>7. Children</h2>
      <p>
        The Service is not directed to anyone under 13. If we learn we have received data from
        a child under 13, we delete it.
      </p>

      <h2>8. Changes</h2>
      <p>
        Updates change the &quot;Effective&quot; date. Material changes are announced on the
        landing page.
      </p>
    </article>
  );
}
