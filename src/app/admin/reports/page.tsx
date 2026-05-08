import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REASON_LABELS: Record<string, string> = {
  csam: "CSAM",
  violence_threat: "Şiddet/Tehdit",
  hate_harassment: "Nefret/Taciz",
  self_harm: "Kendine zarar",
  illegal_activity: "Yasa dışı",
  spam_scam: "Spam/Dolandırıcılık",
  personal_info: "Kişisel bilgi",
  other: "Diğer",
};

interface ReportRow {
  id: string;
  target_type: "question" | "answer";
  target_id: string;
  reason: keyof typeof REASON_LABELS;
  details: string;
  status: "open" | "reviewed" | "actioned" | "dismissed";
  created_at: string;
}

interface PageProps {
  searchParams: Promise<{ token?: string; status?: string }>;
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const expected = process.env.ADMIN_TOKEN;
  const { token, status } = await searchParams;

  if (!expected || !token || token !== expected) {
    notFound();
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return (
      <main className="admin-page">
        <h1>Admin · Bildirimler</h1>
        <div className="admin-warn">
          <strong>Yapılandırma eksik.</strong>
          <p style={{ margin: "6px 0 0" }}>
            Bu sayfanın çalışması için sunucuya iki environment variable eklenmeli:
          </p>
          <ul>
            <li>
              <code>ADMIN_TOKEN</code> — bu sayfaya erişim parolası (URL&apos;de{" "}
              <code>?token=…</code> ile gelir)
            </li>
            <li>
              <code>SUPABASE_SERVICE_ROLE_KEY</code> — sadece sunucu tarafında, raporları okumak için
            </li>
          </ul>
        </div>
      </main>
    );
  }

  const query = admin
    .from("reports")
    .select("id, target_type, target_id, reason, details, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const filtered =
    status && ["open", "reviewed", "actioned", "dismissed"].includes(status)
      ? query.eq("status", status as ReportRow["status"])
      : query;

  const { data, error } = await filtered;
  const rows = (data ?? []) as ReportRow[];

  const snippets = await loadSnippets(rows);

  return (
    <main className="admin-page">
      <h1>Admin · Bildirimler</h1>

      <nav style={{ display: "flex", gap: 12, margin: "12px 0 22px", fontSize: 12.5 }}>
        {(["all", "open", "reviewed", "actioned", "dismissed"] as const).map((s) => {
          const active = (status ?? "all") === s;
          const href =
            s === "all"
              ? `?token=${encodeURIComponent(token)}`
              : `?token=${encodeURIComponent(token)}&status=${s}`;
          return (
            <a
              key={s}
              href={href}
              style={{
                color: active ? "var(--text)" : "var(--text-3)",
                textDecoration: "none",
                borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {s}
            </a>
          );
        })}
      </nav>

      {error ? (
        <div className="admin-warn">Sorgu hatası: {error.message}</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">Bu filtreyle hiç bildirim yok.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Tür</th>
              <th>Sebep</th>
              <th>İçerik</th>
              <th>Detay</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString("tr-TR")}</td>
                <td>{r.target_type === "question" ? "Soru" : "Cevap"}</td>
                <td>{REASON_LABELS[r.reason] ?? r.reason}</td>
                <td className="snippet">
                  <code style={{ fontSize: 11, color: "var(--text-3)" }}>{r.target_id}</code>
                  <div>{snippets.get(r.target_id) ?? "—"}</div>
                </td>
                <td className="snippet">{r.details || "—"}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

async function loadSnippets(rows: ReportRow[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (rows.length === 0) return map;

  const admin = createSupabaseAdminClient();
  if (!admin) return map;

  const qIds = rows.filter((r) => r.target_type === "question").map((r) => r.target_id);
  const aIds = rows.filter((r) => r.target_type === "answer").map((r) => r.target_id);

  if (qIds.length > 0) {
    const { data } = await admin
      .from("questions")
      .select("id, title, context")
      .in("id", qIds);
    for (const row of data ?? []) {
      map.set(
        row.id,
        `${row.title} — ${(row.context ?? "").slice(0, 200)}`.trim().slice(0, 240),
      );
    }
  }
  if (aIds.length > 0) {
    const { data } = await admin.from("answers").select("id, body").in("id", aIds);
    for (const row of data ?? []) {
      map.set(row.id, (row.body ?? "").slice(0, 240));
    }
  }
  return map;
}
