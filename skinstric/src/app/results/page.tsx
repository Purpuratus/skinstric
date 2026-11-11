"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAnalysis, useUser } from "@/lib/storage";
import { percent, sortScores, titleCase } from "@/lib/skinstric";

const CATEGORIES = [
  { key: "race", label: "Race" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Sex" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ResultsPage() {
  const router = useRouter();
  const analysis = useAnalysis();
  const user = useUser();
  const [category, setCategory] = useState<CategoryKey>("race");
  // What the person says is really true, when they disagree with the A.I.
  const [actual, setActual] = useState<Partial<Record<CategoryKey, string>>>({});

  useEffect(() => {
    if (analysis === null) router.replace("/scan");
  }, [analysis, router]);

  if (!analysis) {
    return (
      <main className="page page--center">
        <div className="spinner" />
      </main>
    );
  }

  const ranked = sortScores(analysis[category]);
  const current = actual[category] ?? ranked[0][0];
  const currentScore = analysis[category][current] ?? 0;

  return (
    <main className="page results">
      <div className="eyebrow">A.I. analysis</div>
      <h1 className="title">Demographics{user ? ` for ${user.name}` : ""}</h1>
      <p className="hint">Predicted race &amp; age. Click an option to set your actual answer.</p>

      <div className="results__grid">
        <div className="sidebar" role="tablist" aria-label="Category">
          {CATEGORIES.map(({ key, label }) => {
            const value = actual[key] ?? sortScores(analysis[key])[0][0];
            return (
              <button
                key={key}
                role="tab"
                aria-selected={category === key}
                className={`sidebar__item${category === key ? " sidebar__item--on" : ""}`}
                onClick={() => setCategory(key)}
              >
                <span className="sidebar__value">{titleCase(value)}</span>
                <span className="sidebar__label">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="ring">
          <div className="ring__title">{titleCase(current)}</div>
          <div className="ring__dial">
            <svg viewBox="0 0 220 220" className="ring__svg" aria-hidden>
              <circle cx="110" cy="110" r={RADIUS} className="ring__track" />
              <circle
                cx="110"
                cy="110"
                r={RADIUS}
                className="ring__fill"
                strokeDasharray={`${currentScore * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                transform="rotate(-90 110 110)"
              />
            </svg>
            <div className="ring__value">{percent(currentScore)}</div>
          </div>
        </div>

        <div className="scores">
          <div className="scores__head">
            <span>{CATEGORIES.find((c) => c.key === category)?.label}</span>
            <span>A.I. confidence</span>
          </div>
          {ranked.map(([name, score]) => (
            <button
              key={name}
              className={`scores__row${name === current ? " scores__row--on" : ""}`}
              aria-pressed={name === current}
              onClick={() => setActual((prev) => ({ ...prev, [category]: name }))}
            >
              <span>
                <span className="scores__dot" />
                {titleCase(name)}
              </span>
              <span>{percent(score)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="actions">
        <Link href="/scan" className="btn btn--ghost">
          Back
        </Link>
        <Link href="/" className="btn">
          Home
        </Link>
      </div>
    </main>
  );
}
