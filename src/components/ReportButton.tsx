"use client";

import { useState, useTransition, type MouseEvent } from "react";
import { reportContentAction } from "@/lib/actions";
import type { ReportReasonInput } from "@/lib/validators";

const REASONS: { value: ReportReasonInput; label: string }[] = [
  { value: "csam", label: "Çocuk istismarı / CSAM" },
  { value: "violence_threat", label: "Şiddet ya da tehdit" },
  { value: "hate_harassment", label: "Nefret söylemi / taciz" },
  { value: "self_harm", label: "Kendine zarar verme riski" },
  { value: "illegal_activity", label: "Yasa dışı faaliyet" },
  { value: "spam_scam", label: "Spam / dolandırıcılık" },
  { value: "personal_info", label: "Kişisel bilgi ifşası" },
  { value: "other", label: "Diğer" },
];

interface Props {
  targetType: "question" | "answer";
  targetId: string;
  className?: string;
}

export function ReportButton({ targetType, targetId, className }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReasonInput>("violence_threat");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [pending, startTransition] = useTransition();

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const submit = (e: MouseEvent) => {
    stop(e);
    startTransition(async () => {
      const res = await reportContentAction({ targetType, targetId, reason, details });
      if (res.ok) {
        setStatus("ok");
        setDetails("");
      } else {
        setStatus("err");
        setErrMsg(res.error);
      }
    });
  };

  return (
    <span className={`report-wrap ${className ?? ""}`}>
      <button
        type="button"
        className="micro-btn report-btn"
        onClick={(e) => {
          stop(e);
          setOpen((v) => !v);
          setStatus("idle");
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Raporla
      </button>
      {open && (
        <span className="report-pop" role="dialog" aria-label="İçeriği raporla" onClick={stop}>
          {status === "ok" ? (
            <span className="report-ok">
              Bildirimin alındı. İncelemeden sonra geri dönüş yapılacaktır.
              <button
                type="button"
                className="micro-btn"
                onClick={(e) => {
                  stop(e);
                  setOpen(false);
                }}
              >
                Kapat
              </button>
            </span>
          ) : (
            <>
              <label className="report-label" htmlFor={`r-reason-${targetId}`}>
                Sebep
              </label>
              <select
                id={`r-reason-${targetId}`}
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReasonInput)}
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <label className="report-label" htmlFor={`r-details-${targetId}`}>
                Detay (opsiyonel)
              </label>
              <textarea
                id={`r-details-${targetId}`}
                rows={3}
                maxLength={1000}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Kısa bir açıklama yardımcı olur."
              />
              {status === "err" && <span className="report-err">{errMsg}</span>}
              <span className="report-actions">
                <button
                  type="button"
                  className="micro-btn"
                  onClick={(e) => {
                    stop(e);
                    setOpen(false);
                  }}
                  disabled={pending}
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  className="micro-btn report-submit"
                  onClick={submit}
                  disabled={pending}
                >
                  {pending ? "Gönderiliyor…" : "Gönder"}
                </button>
              </span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
