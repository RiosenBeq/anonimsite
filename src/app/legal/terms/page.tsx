import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "Kullanım Koşulları · Anonim",
  description: "Anonim'i kullanırken kabul ettiğin sözleşme.",
};

export default async function TermsPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/terms" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>Kullanım Koşulları</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        Bu sayfa, <strong>Anonim</strong> (&quot;Hizmet&quot;) ile sen (&quot;Kullanıcı&quot;)
        arasındaki sözleşmedir. Hizmeti kullanarak bu koşulları kabul etmiş sayılırsın. Kabul
        etmiyorsan Hizmet&apos;i kullanma.
      </p>

      <h2>1. Hizmet Tanımı</h2>
      <p>
        Anonim; gerçek isim, fotoğraf veya iletişim bilgisi istemeden anonim soru sorulup
        cevaplanmasını sağlayan bir Soru-Cevap platformudur. Hesap oluşturmadan, sadece tarayıcı
        oturumu üzerinden çalışır.
      </p>

      <h2>2. Yaş ve Yetki</h2>
      <ul>
        <li>Hizmet, en az 13 yaşındaki kullanıcılar içindir.</li>
        <li>
          Türkiye Cumhuriyeti yasalarına göre velinin/vasinin onayı gerekiyorsa, Hizmet&apos;i
          kullanmadan önce bu onayı almak senin sorumluluğundadır.
        </li>
        <li>Hesabını üçüncü kişilerle paylaşmamak ve oturum çerezini korumak senin sorumluluğundadır.</li>
      </ul>

      <h2>3. Yasak İçerik</h2>
      <p>Aşağıdakileri yayınlamayacağını kabul ediyorsun:</p>
      <ul>
        <li>Türk Ceza Kanunu kapsamındaki suçlara teşvik, yardım veya talimat içeren paylaşımlar</li>
        <li>Çocukların cinsel istismarına ilişkin her türlü içerik (CSAM); bu kategori sıfır toleranslıdır</li>
        <li>Şiddet, terör eylemi, intihar talimatı, silah/uyuşturucu temin yönlendirmesi</li>
        <li>Nefret söylemi, kişisel veri ifşası (doxxing), tehdit, taciz</li>
        <li>Telif hakkı ihlali, marka hakkı ihlali, ticari sır ifşası</li>
        <li>Spam, dolandırıcılık, kötü amaçlı yazılım bağlantıları</li>
      </ul>
      <p>
        Hizmet, otomatik bir filtreyle (
        <a href="/legal/community?lang=tr">Topluluk Kuralları</a>) bazı kelime kategorilerini hem
        kayıt sırasında hem okunurken maskeler. Maskelenmek bir içeriğin yayınlanmasını
        engellemez; ihlal halinde içerik kaldırılır.
      </p>

      <h2>4. Senin Yükümlülüklerin</h2>
      <ul>
        <li>Yayınladığın içeriğin doğruluğundan ve hukuki sonuçlarından sen sorumlusun.</li>
        <li>
          Bir başkasının kişisel verisini, ses kaydını veya fotoğrafını rızası olmaksızın
          paylaşmayacaksın.
        </li>
        <li>
          Hizmet&apos;in altyapısını otomatik araçlarla, scraping ile veya herhangi bir denial-of-service
          yöntemiyle kötüye kullanmayacaksın.
        </li>
      </ul>

      <h2>5. İçerik Lisansı</h2>
      <p>
        Yayınladığın içeriğin telif hakkı sende kalır. Ancak, içeriği Hizmet üzerinden barındırıp
        görüntüleyebilmemiz için Anonim&apos;e <em>geri alınabilir, dünya genelinde geçerli,
        sub-lisanslanabilir, ücretsiz</em> bir kullanım lisansı verirsin. İçeriğini sildiğinde bu
        lisans, bizdeki yedek/önbellek nüshalarının doğal yenilenme süresi kadar daha geçerli
        kalır.
      </p>

      <h2>6. Bildirim ve Kaldırma (5651)</h2>
      <p>
        Bir içeriğin senin haklarını ihlal ettiğini düşünüyorsan, içerik kartındaki{" "}
        <strong>Raporla</strong> butonunu kullanabilirsin. Resmi bildirim için{" "}
        <a href="/legal/notice-takedown?lang=tr">Bildirim ve Kaldırma</a> sayfasındaki sürece
        başvurabilirsin.
      </p>

      <h2>7. Hizmet Değişiklikleri ve Sona Erdirme</h2>
      <p>
        Anonim, Hizmet&apos;i geliştirmek, askıya almak veya sonlandırmak; bu Koşulları
        güncellemek hakkını saklı tutar. Önemli değişiklikler için ana sayfada veya bu sayfada
        bilgilendirme yaparız. Yeni sürüm yayımlandıktan sonra Hizmet&apos;i kullanmaya devam
        etmen, güncellemeyi kabul ettiğin anlamına gelir.
      </p>

      <h2>8. Sorumluluk Sınırı</h2>
      <p>
        Hizmet &quot;olduğu gibi&quot; sunulur. Anonim, açık veya zımni hiçbir garanti vermez;
        kesintisizlik, hatasızlık veya belli bir amaca uygunluk taahhüt etmez. Yürürlükteki
        emredici hukukun izin verdiği azami ölçüde, dolaylı zararlardan, kâr kaybından, veri
        kaybından sorumlu değildir.
      </p>

      <h2>9. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
      <p>
        Bu Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda{" "}
        <strong>İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
        Tüketicinin korunmasına dair emredici hükümler saklıdır.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Hukuki bildirimler için: <a href="mailto:legal@anonim.example">legal@anonim.example</a>{" "}
        (yer tutucu — yayına alınmadan önce gerçek adresle güncellenmelidir).
      </p>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>Terms of Service</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        These Terms govern your use of <strong>Anonim</strong> (&quot;Service&quot;). By using
        the Service, you accept them. If you don&apos;t agree, don&apos;t use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Anonim is an anonymous Q&amp;A platform that does not require a real name, photo, or
        contact details. It runs on a per-browser session, with no account.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>You must be at least 13 years old to use the Service.</li>
        <li>If your local law requires parental consent, getting it is your responsibility.</li>
        <li>You are responsible for protecting your session cookie and for what is posted from it.</li>
      </ul>

      <h2>3. Prohibited Content</h2>
      <p>You agree not to post:</p>
      <ul>
        <li>Content that incites, aids, or instructs criminal acts under Turkish Penal Code</li>
        <li>Any form of child sexual abuse material (CSAM); zero tolerance</li>
        <li>Violence, terrorism, suicide instructions, weapon/drug procurement guidance</li>
        <li>Hate speech, doxxing, threats, harassment</li>
        <li>Copyright, trademark, or trade-secret infringement</li>
        <li>Spam, scams, or malware links</li>
      </ul>
      <p>
        The Service applies an automatic filter (see{" "}
        <a href="/legal/community?lang=en">Community Guidelines</a>) that masks certain word
        categories on write and on read. Masking does not exempt the post from removal — repeat
        violations will be removed.
      </p>

      <h2>4. Your Responsibilities</h2>
      <ul>
        <li>You are solely responsible for the content you post and its legal consequences.</li>
        <li>You will not share another person&apos;s personal data, voice, or image without consent.</li>
        <li>
          You will not abuse the infrastructure with automated tools, scraping, or denial-of-service.
        </li>
      </ul>

      <h2>5. Content License</h2>
      <p>
        You retain copyright in your content. You grant Anonim a <em>revocable, worldwide,
        sublicensable, royalty-free</em> license to host and display your content via the Service.
        After deletion the license persists only for the natural rotation of backup/cache copies.
      </p>

      <h2>6. Notice &amp; Takedown</h2>
      <p>
        If you believe a piece of content infringes your rights, use the <strong>Report</strong>{" "}
        button on the content. For formal notices see the{" "}
        <a href="/legal/notice-takedown?lang=en">Notice &amp; Takedown</a> page.
      </p>

      <h2>7. Changes &amp; Termination</h2>
      <p>
        Anonim may modify, suspend, or terminate the Service, and may update these Terms.
        Material changes will be posted on this page. Continued use after a change means you
        accept the update.
      </p>

      <h2>8. Disclaimer &amp; Limitation of Liability</h2>
      <p>
        The Service is provided &quot;as is&quot;, without warranties of any kind. To the
        maximum extent permitted by mandatory law, Anonim is not liable for indirect damages,
        lost profits, or lost data.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Türkiye. Disputes are subject
        to the <strong>Istanbul Çağlayan Courts and Enforcement Offices</strong>, without
        prejudice to mandatory consumer-protection rules.
      </p>

      <h2>10. Contact</h2>
      <p>
        Legal notices: <a href="mailto:legal@anonim.example">legal@anonim.example</a>{" "}
        (placeholder — replace with the real address before going public).
      </p>
    </article>
  );
}
