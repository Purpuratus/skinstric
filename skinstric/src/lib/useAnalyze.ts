import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAnalysis } from "./storage";
import type { Analysis } from "./skinstric";

// Sends a base64 picture for analysis, saves the answer, opens the results.
export function useAnalyze() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(
    async (image: string) => {
      setBusy(true);
      setError("");
      try {
        const res = await fetch("/api/phase-two", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.data) {
          const detail = json.detail ? ` (${json.detail})` : "";
          throw new Error(`${json.error || "Analysis failed."}${detail}`);
        }
        saveAnalysis(json.data as Analysis);
        router.push("/results");
      } catch (err) {
        console.error("analysis failed:", err);
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setBusy(false);
      }
    },
    [router]
  );

  return { analyze, busy, error };
}
