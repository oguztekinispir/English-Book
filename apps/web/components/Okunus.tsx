"use client";
import { useState } from "react";
import { ipaBul, ipaTurkce } from "@ti/icerik";

/**
 * Okunuş: IPA ana gösterim. Türkçe harflerle yaklaşık okunuş dokununca açılır
 * (IPA'dan kurallarla üretilir; asıl ölçü sestir).
 */
export function Okunus({ en, etiket = false }: { en: string; etiket?: boolean }) {
  const [tr, setTr] = useState(false);
  const ipa = ipaBul(en);
  if (!ipa) return null;
  return (
    <span className="okunus">
      <span className="okunus-ipa" lang="en" title="IPA: sözlüklerdeki okunuş yazısı">
        /{ipa}/
      </span>
      {tr ? (
        <span className="okunus-tr">yaklaşık: {ipaTurkce(ipa)}</span>
      ) : (
        <span
          role="button"
          tabIndex={0}
          className="okunus-ac"
          onClick={(e) => (e.stopPropagation(), setTr(true))}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), e.stopPropagation(), setTr(true))}
        >
          {etiket ? "Türkçe okunuş" : "TR"}
        </span>
      )}
    </span>
  );
}
