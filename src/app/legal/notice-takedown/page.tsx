import { LangToggle, pickLang } from "@/components/legal/LangToggle";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const EFFECTIVE = "8 Mayıs 2026";

export const metadata = {
  title: "Bildirim ve Kaldırma · Anonim",
};

export default async function NoticeTakedownPage({ searchParams }: PageProps) {
  const lang = pickLang((await searchParams).lang);
  return (
    <>
      <LangToggle basePath="/legal/notice-takedown" active={lang} />
      {lang === "tr" ? <TR /> : <EN />}
    </>
  );
}

function TR() {
  return (
    <article>
      <h1>Bildirim ve Kaldırma</h1>
      <p className="legal-meta">Yürürlük tarihi: {EFFECTIVE}</p>

      <p>
        Anonim, 5651 sayılı &quot;İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar
        Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun&quot; kapsamında <em>içerik
        sağlayıcı/yer sağlayıcı</em> olarak hareket eder. Bir içeriğin haklarını ihlal ettiğini
        düşünüyorsan aşağıdaki yollardan başvurabilirsin.
      </p>

      <h2>1. Hızlı Yol — Raporla Butonu</h2>
      <p>
        Her sorunun ve cevabın yanında <strong>Raporla</strong> butonu var. Sebep seçtiğinde
        bildirim sistemimize 72 saat içinde incelenmek üzere düşer. Bu, çoğu durumda en hızlı
        yoldur.
      </p>

      <h2>2. Resmi Bildirim (5651 m.9 ve m.9/A)</h2>
      <p>
        Kişilik haklarının ya da özel hayatın ihlal edildiği durumlarda, içeriğin URL&apos;si,
        ihlal gerekçesi ve kimliğinizi doğrulayan bilgilerle birlikte aşağıdaki adrese yazılı
        başvuru iletilebilir:
      </p>
      <ul>
        <li>
          E-posta: <a href="mailto:legal@anonim.org">legal@anonim.org</a>
        </li>
      </ul>
      <p>Başvurunun şunları içermesi sürecin hızlanmasını sağlar:</p>
      <ul>
        <li>İçeriğin tam URL&apos;si</li>
        <li>İhlal edilen hak ve hukuki dayanak (KVKK, TCK, Fikir ve Sanat Eserleri Kanunu, vb.)</li>
        <li>Başvurucunun kimlik bilgisi ve iletişim adresi (e-posta yeterlidir)</li>
        <li>Beyanname: bilgilerin doğruluğunun ve hak sahibi olduğunuzun beyanı</li>
      </ul>

      <h2>3. İnceleme Süreci</h2>
      <ol>
        <li>Başvurun en geç <strong>24 saat</strong> içinde alındı bilgisiyle yanıtlanır.</li>
        <li>
          Talep, mevzuat ve Topluluk Kuralları çerçevesinde değerlendirilir; gerekirse hukuk
          danışmanına yönlendirilir.
        </li>
        <li>
          5651 m.9 kapsamında haklı bulunan başvurular için içerik <strong>en geç 24 saat</strong>{" "}
          içinde kaldırılır veya erişime engellenir. Sınır vakalarda mahkeme/BTK kararına göre
          hareket edilir.
        </li>
        <li>Başvurucuya ve mümkünse içeriği yayınlayan oturuma sonuç bildirilir.</li>
      </ol>

      <h2>4. Mahkeme ve BTK Kararları</h2>
      <p>
        Yetkili sulh ceza hâkimliği ya da BTK (Bilgi Teknolojileri ve İletişim Kurumu) tarafından
        verilen kararlar, alındığı andan itibaren <strong>24 saat</strong> içinde uygulanır. Karar
        no, dosya esas no ve karar metni ile birlikte iletilmelidir.
      </p>

      <h2>5. Karşı Bildirim (Counter-notice)</h2>
      <p>
        İçeriği yayınlayan oturum, kaldırma kararına karşı 14 gün içinde karşı bildirim
        gönderebilir; bu durumda dosya yeniden değerlendirilir. Karşı bildirim, içeriğin gerçek
        sahibinin başvurması koşuluyla işleme alınır.
      </p>

      <h2>6. Sahte/Kötü Niyetli Bildirim</h2>
      <p>
        Sahte bildirimler suç teşkil edebilir (TCK m.267 ve devamı). Tekrarlayan kötü niyetli
        bildirimler için ilgili oturum kalıcı olarak askıya alınır.
      </p>
    </article>
  );
}

function EN() {
  return (
    <article>
      <h1>Notice &amp; Takedown</h1>
      <p className="legal-meta">Effective: {EFFECTIVE}</p>

      <p>
        Anonim acts as a content/hosting provider under Turkish law nº 5651. If you believe a
        piece of content infringes your rights, use one of the paths below.
      </p>

      <h2>1. Quick Path — Report Button</h2>
      <p>
        Every question and answer has a <strong>Report</strong> button. Select a reason; the
        report enters our queue and is reviewed within 72 hours. This is the fastest path for
        most cases.
      </p>

      <h2>2. Formal Notice (5651 Art. 9 / 9-A)</h2>
      <p>
        For violations of personality rights or privacy, send a written notice with the
        content URL, the grounds for the alleged infringement, and identifying information to:
      </p>
      <ul>
        <li>
          Email: <a href="mailto:legal@anonim.org">legal@anonim.org</a>
        </li>
      </ul>
      <p>To accelerate review, include:</p>
      <ul>
        <li>The full URL of the content</li>
        <li>The right asserted and legal basis</li>
        <li>Your identity and a contact email</li>
        <li>A statement of good-faith belief and right ownership</li>
      </ul>

      <h2>3. Review Process</h2>
      <ol>
        <li>Acknowledgement within <strong>24 hours</strong>.</li>
        <li>Review against the law and our Community Guidelines.</li>
        <li>
          For valid 5651 Art. 9 requests, removal or access blocking within{" "}
          <strong>24 hours</strong>. Edge cases may await a court / BTK decision.
        </li>
        <li>Outcome notified to the requester and, where possible, to the posting session.</li>
      </ol>

      <h2>4. Court / BTK Orders</h2>
      <p>
        Decisions from a competent magistrate&apos;s court or BTK are implemented within{" "}
        <strong>24 hours</strong> of receipt. Provide the case number and the decision text.
      </p>

      <h2>5. Counter-notice</h2>
      <p>
        The posting session may submit a counter-notice within 14 days; the case is then
        re-evaluated.
      </p>

      <h2>6. Bad-faith Notices</h2>
      <p>
        False notices may constitute an offence under the Turkish Penal Code (Art. 267 and
        following). Repeat bad-faith reporters will be suspended.
      </p>
    </article>
  );
}
