"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/storage";
import { validateText } from "@/lib/skinstric";

export default function IntroPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0); // 0 = name, 1 = location
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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

    // Step 2: check the location, send both to the API, save them, move on.
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
      router.push("/scan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const goBack = () => {
    setError("");
    if (step === 1) setStep(0);
    else router.push("/");
  };

  return (
    <main className="page page--center">
      <div className="eyebrow">To start analysis</div>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label className="form__label" htmlFor="field">
          {step === 0 ? "Introduce yourself" : "Where are you from?"}
        </label>
        {step === 0 ? (
          <input
            id="field"
            className="input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            autoFocus
            key="name"
          />
        ) : (
          <input
            id="field"
            className="input"
            placeholder="Your city"
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

        <div className="actions">
          <button type="button" className="btn btn--ghost" onClick={goBack} disabled={busy}>
            Back
          </button>
          <button type="submit" className="btn" disabled={busy}>
            {busy ? "Sending..." : "Proceed"}
          </button>
        </div>
      </form>
    </main>
  );
}
