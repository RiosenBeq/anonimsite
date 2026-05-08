"use client";

import { useState, useTransition } from "react";
import { IconBookmark } from "@/components/icons";
import { toggleSaveAction } from "@/lib/actions";

interface SaveButtonProps {
  questionId: string;
  initialSaved: boolean;
  initialCount: number;
}

export function SaveButton({ questionId, initialSaved, initialCount }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    if (pending) return;
    const prev = saved;
    setSaved(!prev);
    setCount((c) => c + (prev ? -1 : 1));
    startTransition(async () => {
      const res = await toggleSaveAction({ questionId });
      if (!res.ok) {
        setSaved(prev);
        setCount(initialCount);
      } else {
        setSaved(res.data.saved);
      }
    });
  };

  return (
    <button
      type="button"
      className={`btn btn-pill-dark ${saved ? "btn-primary" : ""}`}
      onClick={toggle}
      disabled={pending}
      style={saved ? { fontWeight: 600 } : undefined}
      aria-pressed={saved}
    >
      <IconBookmark size={13} /> {saved ? "Saved" : "Save"} · {count}
    </button>
  );
}
