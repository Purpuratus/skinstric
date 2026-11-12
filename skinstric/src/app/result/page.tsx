"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CameraIcon, GalleryIcon } from "@/components/Icons";
import { fileToBase64 } from "@/lib/image";
import { useUser } from "@/lib/storage";
import { useAnalyze } from "@/lib/useAnalyze";

function Diamonds() {
  return (
    <div className="opt__diamonds" aria-hidden>
      <div className="diamond diamond--lg" />
      <div className="diamond diamond--md" />
      <div className="diamond diamond--sm" />
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const user = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const { analyze, busy, error } = useAnalyze();
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  // Nobody should reach this step without entering their details first.
  useEffect(() => {
    if (user === null) router.replace("/testing");
  }, [user, router]);

  // Free the preview picture from memory when it is replaced or the page closes.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = async (file: File | undefined) => {
    setFileError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("Please choose a picture file (JPG, PNG, ...).");
      return;
    }
    try {
      setBase64(await fileToBase64(file));
      setPreview(URL.createObjectURL(file));
    } catch {
      setFileError("That picture couldn’t be read. Try a different one.");
    }
  };

  return (
    <main className="scan">
      <div className="intro__corner">TO START ANALYSIS</div>

      <div className="scan__preview">
        <div className="scan__preview-title">Preview</div>
        <div className="scan__preview-box">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your chosen photo" />
          ) : (
            <span>No photo yet</span>
          )}
        </div>
      </div>

      <div className="scan__options">
        <div className="opt">
          <Diamonds />
          <Link href="/camera" className="opt__btn" aria-label="Take a selfie with your camera">
            <CameraIcon />
          </Link>
          <div className="opt__line" aria-hidden />
          <div className="opt__label">
            ALLOW A.I.
            <br />
            TO SCAN YOUR FACE
          </div>
        </div>

        <div className="opt">
          <Diamonds />
          <button
            type="button"
            className="opt__btn"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label="Choose a photo from your gallery"
          >
            <GalleryIcon />
          </button>
          <div className="opt__line" aria-hidden />
          <div className="opt__label">
            ALLOW A.I.
            <br />
            ACCESS GALLERY
          </div>
        </div>
      </div>

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

      {(fileError || error) && (
        <div className="notice scan__notice" role="alert">
          {fileError || error}
        </div>
      )}

      <Link href="/testing" className="intro__back">
        <span className="tri tri--left" aria-hidden />
        BACK
      </Link>

      <button
        type="button"
        className="scan__proceed"
        onClick={() => base64 && analyze(base64)}
        disabled={!base64 || busy}
      >
        PROCEED
        <span className="tri tri--right" aria-hidden />
      </button>

      {busy && (
        <div className="overlay" role="status">
          <div className="spinner" />
          Preparing your analysis...
        </div>
      )}
    </main>
  );
}
