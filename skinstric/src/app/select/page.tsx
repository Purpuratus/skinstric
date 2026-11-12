"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/lib/storage";

export default function SelectPage() {
  const router = useRouter();
  const analysis = useAnalysis();

  // This page is only useful once an analysis exists.
  useEffect(() => {
    if (analysis === null) router.replace("/result");
  }, [analysis, router]);

  return (
    <main className="select">
      <div className="select__intro">
        <h1 className="select__title">A.I. ANALYSIS</h1>
        <p className="select__text">
          A.I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <div className="select__diamonds" aria-hidden>
        <div className="diamond diamond--lg" />
        <div className="diamond diamond--md" />
      </div>

      {/* Four tiles that together form one diamond */}
      <div className="menu">
        <Link href="/summary" className="menu__tile menu__tile--on">
          <span>Demographics</span>
        </Link>
        <div className="menu__tile menu__tile--off" aria-disabled title="Coming soon">
          <span>Skin Type Details</span>
        </div>
        <div className="menu__tile menu__tile--off" aria-disabled title="Coming soon">
          <span>Cosmetic Concerns</span>
        </div>
        <div className="menu__tile menu__tile--off" aria-disabled title="Coming soon">
          <span>Weather</span>
        </div>
      </div>

      <Link href="/result" className="intro__back">
        <span className="tri tri--left" aria-hidden />
        BACK
      </Link>
      <Link href="/summary" className="select__sum">
        SUM
        <span className="tri tri--right" aria-hidden />
      </Link>
    </main>
  );
}
