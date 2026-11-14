import type { Yer } from "@ti/icerik";

/** Sahne çizimleri: sade, bize ait. */
export function SahneCizimi({ yer }: { yer?: Yer }) {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className="sahne-cizim">
      <rect width="320" height="180" fill="#e8edff" />
      {yer === "apartman" && (
        <>
          <rect x="60" y="20" width="120" height="150" fill="#ffffff" stroke="#c9d3f5" strokeWidth="3" />
          {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={78 + c * 50} y={36 + r * 38} width="34" height="24" rx="3" fill={r === 1 && c === 0 ? "#ffe34d" : "#d7dff9"} />))}
          <rect x="102" y="140" width="36" height="30" rx="3" fill="#2f55e4" />
          <path d="M200 170 L200 120 L230 120 L230 95 L260 95 L260 70 L290 70" stroke="#9fb4f5" strokeWidth="6" fill="none" />
          <circle cx="282" cy="40" r="14" fill="#ffe34d" />
        </>
      )}
      {yer === "kafe" && (
        <>
          <rect x="0" y="140" width="320" height="40" fill="#d7dff9" />
          <rect x="30" y="24" width="120" height="70" rx="8" fill="#ffffff" stroke="#c9d3f5" strokeWidth="3" />
          <text x="90" y="66" textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="22" fill="#2f55e4">
            Hello!
          </text>
          <rect x="180" y="104" width="110" height="10" rx="5" fill="#9fb4f5" />
          <rect x="230" y="114" width="10" height="30" fill="#9fb4f5" />
          <path d="M200 86 h22 v16 a11 11 0 0 1 -22 0 z" fill="#ffffff" stroke="#1b2340" strokeWidth="2.5" />
          <path d="M222 92 a6 6 0 0 1 0 10" stroke="#1b2340" strokeWidth="2.5" fill="none" />
          <path d="M206 78 q4 -6 0 -12 M214 78 q4 -6 0 -12" stroke="#9fb4f5" strokeWidth="2.5" fill="none" />
          <rect x="250" y="80" width="24" height="24" rx="4" fill="#ffe34d" />
        </>
      )}
      {yer === "sinif" && (
        <>
          <rect x="40" y="22" width="170" height="96" rx="6" fill="#1b2340" />
          <text x="60" y="58" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="20" fill="#ffffff">
            anne-m
          </text>
          <text x="60" y="92" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="20" fill="#ffe34d">
            my mother
          </text>
          <rect x="0" y="150" width="320" height="30" fill="#d7dff9" />
          <rect x="236" y="30" width="60" height="80" rx="4" fill="#ffffff" stroke="#c9d3f5" strokeWidth="3" />
          <line x1="266" y1="30" x2="266" y2="110" stroke="#c9d3f5" strokeWidth="3" />
          <rect x="70" y="126" width="140" height="10" rx="5" fill="#9fb4f5" />
        </>
      )}
      {yer === "okul" && (
        <>
          <rect x="70" y="40" width="180" height="130" fill="#ffffff" stroke="#c9d3f5" strokeWidth="3" />
          <path d="M60 44 L160 10 L260 44 z" fill="#e86a5c" />
          <circle cx="160" cy="70" r="14" fill="#ffffff" stroke="#1b2340" strokeWidth="2.5" />
          <path d="M160 62 v8 l6 4" stroke="#1b2340" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((c) => <rect key={c} x={92 + c * 50} y="100" width="34" height="26" rx="3" fill={c === 1 ? "#ffe34d" : "#d7dff9"} />)}
          <rect x="146" y="140" width="28" height="30" rx="3" fill="#2f55e4" />
        </>
      )}
      {yer === "telefon" && (
        <>
          <rect x="54" y="30" width="72" height="130" rx="14" fill="#1b2340" />
          <rect x="62" y="44" width="56" height="96" rx="6" fill="#ffffff" />
          <rect x="70" y="56" width="34" height="12" rx="6" fill="#d7dff9" />
          <rect x="78" y="76" width="34" height="12" rx="6" fill="#ffe34d" />
          <rect x="194" y="30" width="72" height="130" rx="14" fill="#1b2340" />
          <rect x="202" y="44" width="56" height="96" rx="6" fill="#ffffff" />
          <path d="M140 80 q20 -16 40 0 M146 92 q14 -10 28 0" stroke="#2f55e4" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {yer === "dugun" && (
        <>
          <rect x="0" y="150" width="320" height="30" fill="#d7dff9" />
          {[40, 100, 160, 220, 280].map((x, i) => (
            <circle key={x} cx={x} cy={30 + (i % 2) * 10} r="8" fill={["#ffe34d", "#e86a5c", "#9fb4f5", "#10845a", "#ffe34d"][i]} />
          ))}
          <path d="M20 30 Q100 60 160 36 T300 36" stroke="#c9d3f5" strokeWidth="2" fill="none" />
          <rect x="130" y="80" width="60" height="50" rx="4" fill="#ffffff" stroke="#1b2340" strokeWidth="2.5" />
          <rect x="140" y="62" width="40" height="20" rx="3" fill="#ffffff" stroke="#1b2340" strokeWidth="2.5" />
          <rect x="152" y="50" width="16" height="12" rx="2" fill="#e86a5c" />
          <rect x="100" y="128" width="120" height="10" rx="5" fill="#9fb4f5" />
        </>
      )}
      {!yer && <rect x="40" y="40" width="240" height="100" rx="12" fill="#ffffff" />}
    </svg>
  );
}
