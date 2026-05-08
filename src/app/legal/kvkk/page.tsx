import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "KVKK Aydınlatma Metni · Anonim",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma.",
};

export default async function KvkkPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/kvkk" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>KVKK Aydınlatma Metni</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, kişisel
        verilerinizin işleme süreçleri hakkında sizi aydınlatmak amacıyla hazırlanmıştır.
      </p>

      <h2>1. Veri Sorumlusunun Kimliği</h2>
      <p>
        Veri sorumlusu sıfatıyla, <strong>Anonim</strong> (yer tutucu unvan/adres yayına
        alınmadan önce eklenecektir). İletişim:{" "}
        <a href="mailto:kvkk@anonim.org">kvkk@anonim.org</a>.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>
          <strong>İşlem güvenliği verisi</strong>: <code>anonim_session</code> çerezindeki UUID, IP
          adresi, kullanıcı ajanı (Vercel/Supabase tarafından operasyonel kayıt amacıyla geçici
          olarak tutulur).
        </li>
        <li>
          <strong>Müşteri işlem verisi</strong>: tarafınızca yayınlanan soru, cevap, tepki,
          favori; sunucuda otomatik üretilen takma ad (pseudonym).
        </li>
      </ul>
      <p>
        Hiçbir koşulda; ad-soyad, T.C. kimlik no, e-posta, telefon, fotoğraf veya konum verisi
        alınmaz.
      </p>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Hizmetin teknik olarak sunulması ve işlevselliğinin sağlanması</li>
        <li>Kötüye kullanımın önlenmesi (rate-limit, otomatik içerik moderasyonu)</li>
        <li>5651 sayılı kanun ve sair mevzuat uyarınca ihbar/kaldırma süreçlerinin yönetilmesi</li>
        <li>Yetkili kurum/kuruluşlardan gelen taleplerin karşılanması</li>
      </ul>

      <h2>4. Hukuki Sebepler (KVKK m.5/2)</h2>
      <ul>
        <li>Bir sözleşmenin kurulması veya ifası için gerekli olması (m.5/2-c)</li>
        <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi (m.5/2-ç)</li>
        <li>Temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaat (m.5/2-f)</li>
      </ul>

      <h2>5. Aktarım Yapılan Taraflar (KVKK m.8 ve m.9)</h2>
      <ul>
        <li>Barındırma altyapısı (Vercel Inc., ABD/AB) — standart sözleşme maddeleri ile</li>
        <li>Yönetilen veritabanı (Supabase, ABD) — TLS şifreli aktarım</li>
        <li>Yetkili kamu kurum ve kuruluşları (yasal talep halinde)</li>
      </ul>

      <h2>6. İlgili Kişi Hakları (KVKK m.11)</h2>
      <p>Aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Kanunun 7. maddesi çerçevesinde silinmesini/yok edilmesini isteme</li>
        <li>Bu işlemlerin aktarım yapılmış üçüncü kişilere bildirilmesini isteme</li>
        <li>Otomatik sistemlerle yapılan analiz aleyhine sonuç doğurması halinde itiraz etme</li>
        <li>Kanuna aykırı işleme nedeniyle uğradığı zararın giderilmesini talep etme</li>
      </ul>

      <h2>7. Başvuru Yöntemi</h2>
      <p>
        Başvurularınızı, kimliğinizin doğrulanmasına yardımcı olacak bilgilerle birlikte{" "}
        <a href="mailto:kvkk@anonim.org">kvkk@anonim.org</a> adresine iletebilirsiniz.
        Anonim&apos;e özgü bir kimlik tutmadığımız için doğrulamada{" "}
        <code>anonim_session</code> çerezinizdeki UUID&apos;yi kullanmanızı isteyebiliriz.
      </p>
      <p>
        Talebiniz, niteliğine göre en geç <strong>30 gün</strong> içinde sonuçlandırılır.
        Sonuca itirazınız varsa Kişisel Verileri Koruma Kuruluna şikayet edebilirsiniz.
      </p>

      <h2>8. Güvenlik Tedbirleri</h2>
      <ul>
        <li>Tüm trafik HTTPS (TLS 1.2+) ile</li>
        <li>Veritabanında satır seviyesi güvenlik (RLS) politikaları</li>
        <li>Yazımlar yalnızca SECURITY DEFINER RPC katmanı üzerinden</li>
        <li>Sunucu tarafı yetki ayrımı (publishable/anon key vs. service-role key)</li>
      </ul>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>KVKK Disclosure (Turkish DPA Notice)</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        This notice fulfils the disclosure duty under Turkey&apos;s Personal Data Protection
        Law nº 6698 (&quot;KVKK&quot;). It mirrors the GDPR-style transparency obligation.
      </p>

      <h2>1. Data Controller</h2>
      <p>
        <strong>Anonim</strong> (placeholder operator details to be filled in). Contact:{" "}
        <a href="mailto:kvkk@anonim.org">kvkk@anonim.org</a>.
      </p>

      <h2>2. Categories of Data</h2>
      <ul>
        <li>
          <strong>Transaction security data</strong>: UUID stored in <code>anonim_session</code>{" "}
          cookie; IP address and User-Agent (kept briefly by Vercel/Supabase).
        </li>
        <li>
          <strong>User-generated content</strong>: questions, answers, reactions, saves;
          server-generated pseudonym.
        </li>
      </ul>
      <p>We never collect name, ID number, email, phone, photo, or location.</p>

      <h2>3. Purposes</h2>
      <ul>
        <li>Service delivery and functional integrity</li>
        <li>Abuse prevention (rate limits, content moderation)</li>
        <li>Compliance with Turkish law nº 5651 and related rules</li>
        <li>Responding to lawful requests by competent authorities</li>
      </ul>

      <h2>4. Legal Grounds (KVKK Art. 5)</h2>
      <ul>
        <li>Performance of contract (Art. 5/2-c)</li>
        <li>Legal obligation of the controller (Art. 5/2-ç)</li>
        <li>Legitimate interest, balanced against your rights (Art. 5/2-f)</li>
      </ul>

      <h2>5. Recipients (KVKK Art. 8 &amp; 9)</h2>
      <ul>
        <li>Hosting infrastructure (Vercel Inc., US/EU) — under SCCs</li>
        <li>Managed database (Supabase, US) — TLS-encrypted transfer</li>
        <li>Public authorities (upon lawful request)</li>
      </ul>

      <h2>6. Your Rights (KVKK Art. 11)</h2>
      <ul>
        <li>To learn whether your data is being processed</li>
        <li>To receive information on the processing</li>
        <li>To learn the purpose and whether the data is used in line with it</li>
        <li>To learn third parties (in country / abroad) it is transferred to</li>
        <li>To request correction of incomplete/inaccurate data</li>
        <li>To request erasure or destruction (Art. 7)</li>
        <li>To request notification of the above to recipients</li>
        <li>To object to outcomes of automated analysis</li>
        <li>To claim damages from unlawful processing</li>
      </ul>

      <h2>7. How to Apply</h2>
      <p>
        Send your request, with information enabling identification, to{" "}
        <a href="mailto:kvkk@anonim.org">kvkk@anonim.org</a>. Since we hold no
        Anonim-specific identifier, we may ask for the UUID in your <code>anonim_session</code>{" "}
        cookie to verify ownership. We respond within <strong>30 days</strong>. You may also
        complain to the Turkish DPA (KVKK).
      </p>

      <h2>8. Security Measures</h2>
      <ul>
        <li>HTTPS (TLS 1.2+) everywhere</li>
        <li>Row-level security (RLS) on every table</li>
        <li>Writes only via SECURITY DEFINER RPC functions</li>
        <li>Strict separation of publishable/anon keys vs. service-role keys</li>
      </ul>
    </article>
  );
}
