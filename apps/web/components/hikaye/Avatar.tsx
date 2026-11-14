import { karakterBul } from "@ti/icerik";

/** Hikâye karakterinin avatarı (kendi çizimimiz). Kadroda olmayan kişi için baş harfli daire. */
export function Avatar({ ad, boyut = 44 }: { ad: string; boyut?: number }) {
  const k = karakterBul(ad);
  if (!k)
    return (
      <span className="avatar-harf" style={{ width: boyut, height: boyut, fontSize: boyut * 0.42 }} aria-hidden="true">
        {ad.slice(0, 1)}
      </span>
    );
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 48 48" aria-hidden="true" className="avatar">
      <circle cx="24" cy="24" r="24" fill={k.zemin} />
      {k.uzunSac && <path d="M11 25c0-10 6-15 13-15s13 5 13 15v10h-5v-9h-16v9h-5z" fill={k.sac} />}
      <circle cx="24" cy="25" r="9.5" fill={k.ten} />
      <path d="M14 22c0-7 5-10 10-10s11 3 10 10c-3-3-6-4-10-4s-7 1-10 4z" fill={k.sac} />
      <circle cx="20.5" cy="26" r="1.3" fill="#1b2340" />
      <circle cx="27.5" cy="26" r="1.3" fill="#1b2340" />
      <path d="M21 30.5c2 1.3 4 1.3 6 0" stroke="#1b2340" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M11 48c1-7 6-10 13-10s12 3 13 10z" fill={k.giysi} />
    </svg>
  );
}
