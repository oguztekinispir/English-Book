"use client";
import { Fragment, useEffect, useState } from "react";
import { isaretParcala } from "@ti/motor";
import { konus, sesVar } from "@/lib/ses";

export function SesDugmesi({ metin, etiket }: { metin: string; etiket?: string }) {
  const [var_, setVar] = useState(false);
  useEffect(() => setVar(sesVar()), []);
  if (!var_) return null;
  return (
    <button type="button" className="ses" onClick={() => konus(metin)} aria-label={etiket || `Dinle: ${metin}`} title="Dinle">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
        <path d="M10.5 5.2a3.8 3.8 0 0 1 0 5.6M12.4 3.4a6.3 6.3 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Motorun [[vurgu]] ve **kalın** işaretlerini gösterir. Metin React tarafından kaçırılır. */
export function Isaretli({ metin }: { metin: string }) {
  return (
    <>
      {isaretParcala(metin).map((p, i) =>
        p.vurgu ? (
          <mark key={i}>{p.t === "i" ? "I" : p.t}</mark>
        ) : (
          <Fragment key={i}>
            {p.t.split(/\*\*(.+?)\*\*/g).map((x, j) => (j % 2 ? <b key={j}>{x}</b> : x))}
          </Fragment>
        ),
      )}
    </>
  );
}
