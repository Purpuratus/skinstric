"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fileToBase64 } from "@/lib/image";
import { useUser } from "@/lib/storage";
import { useAnalyze } from "@/lib/useAnalyze";

export default function ScanPage() {
  const router = useRouter();
  const user = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const { analyze, busy, error } = useAnalyze();
  const [fileError, setFileError] = useState("");

  // Nobody should reach this step without entering their details first.
  useEffect(() => {
    if (user === null) router.replace("/intro");
  }, [user, router]);

  const handleFile = async (file: File | undefined) => {
    setFileError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("Please choose a picture file (JPG, PNG, ...).");
      return;
    }
    try {
      await analyze(await fileToBase64(file));
    } catch {
      setFileError("That picture couldn’t be read. Try a different one.");
    }
  };

  return (
    <main className="page page--center">
      <div className="eyebrow">To start analysis</div>
      <h1 className="title">
        {user ? `${user.name}, allow` : "Allow"} A.I. to scan your face
      </h1>

      <div className="choices">
        <Link href="/camera" className="choice" aria-disabled={busy}>
          <span className="choice__icon" aria-hidden>
            ◎
          </span>
          <span className="choice__label">Take a selfie</span>
          <span className="choice__hint">Use your camera</span>
        </Link>

        <button
          type="button"
          className="choice"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          <span className="choice__icon" aria-hidden>
            ▢
          </span>
          <span className="choice__label">Upload a photo</span>
          <span className="choice__hint">From your gallery</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = ""; // lets you pick the same file again
          }}
        />
      </div>

      {(fileError || error) && (
        <div className="notice" role="alert">
          {fileError || error}
        </div>
      )}

      <div className="actions">
        <Link href="/intro" className="btn btn--ghost">
          Back
        </Link>
      </div>

      {busy && (
        <div className="overlay" role="status">
          <div className="spinner" />
          Preparing your analysis...
        </div>
      )}
    </main>
  );
}
