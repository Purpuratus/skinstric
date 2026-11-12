"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/storage";
import { validateText } from "@/lib/skinstric";

export default function TestingPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0); // 0 = name, 1 = location
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false); // "Thank you" screen

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;

    // Step 1: check the name, then ask for the location.
    if (step === 0) {
      const problem = validateText(name, "Name");
      setError(problem);
      if (!problem) setStep(1);
      return;
    }

    // Step 2: check the location, send both to the API, save them.
    const problem = validateText(location, "Location");
    setError(problem);
    if (problem) return;

    setBusy(true);
    try {
      const res = await fetch("/api/phase-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), location: location.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      saveUser({ name: name.trim(), location: location.trim() });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    setError("");
    if (done) setDone(false);
    else if (step === 1) setStep(0);
    else router.push("/");
  };

  return (
    <main className="intro">
      <div className="intro__corner">TO START ANALYSIS</div>

      {/* Three nested dotted diamonds behind the form, light to dark */}
      <div className="intro__diamonds" aria-hidden>
        <div className="diamond diamond--lg" />
        <div className="diamond diamond--md" />
        <div className="diamond diamond--sm" />
      </div>

      {done ? (
        <div className="intro__form">
          <h1 className="intro__thanks">Thank you!</h1>
          <p className="intro__label">Proceed for the next step</p>
          <button
            type="button"
            className="scan__proceed intro__next"
            onClick={() => router.push("/result")}
          >
            PROCEED
            <span className="tri tri--right" aria-hidden />
          </button>
        </div>
      ) : (
        <form className="intro__form" onSubmit={handleSubmit} noValidate>
          <label className="intro__label" htmlFor="field">
            CLICK TO TYPE
          </label>
          {step === 0 ? (
            <input
              id="field"
              className="intro__input"
              placeholder="Introduce Yourself"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus
              key="name"
            />
          ) : (
            <input
              id="field"
              className="intro__input"
              placeholder="Where are you from?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete="address-level2"
              autoFocus
              key="location"
            />
          )}
          <div className="form__error" role="alert">
            {error}
          </div>
          <button type="submit" className="btn intro__submit" disabled={busy}>
            {busy ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      <button type="button" className="intro__back" onClick={goBack} disabled={busy}>
        <span className="tri tri--left" aria-hidden />
        BACK
      </button>
    </main>
  );
}
