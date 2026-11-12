"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { videoFrameToBase64 } from "@/lib/image";
import { useUser } from "@/lib/storage";
import { useAnalyze } from "@/lib/useAnalyze";

type Status = "ask" | "starting" | "ready" | "declined" | "error";

export default function CameraPage() {
  const router = useRouter();
  const user = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("ask");
  const [message, setMessage] = useState("");
  const [captureError, setCaptureError] = useState("");
  const { analyze, busy, error } = useAnalyze();

  useEffect(() => {
    if (user === null) router.replace("/testing");
  }, [user, router]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Switch the camera off when leaving the page.
  useEffect(() => stopCamera, [stopCamera]);

  // Runs only after the person presses "Allow".
  const startCamera = async () => {
    setStatus("starting");
    setMessage("");
    setCaptureError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser can’t use the camera. Try uploading a photo instead.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }
      setStatus("ready");
    } catch (err) {
      const blocked =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "SecurityError");
      if (blocked) {
        setMessage(
          "Camera access is blocked. Allow it in your browser’s site settings, or upload a photo instead."
        );
        setStatus("declined");
      } else {
        setMessage(
          err instanceof DOMException && err.name === "NotFoundError"
            ? "No camera was found on this device. Try uploading a photo instead."
            : err instanceof Error && err.message
            ? err.message
            : "The camera couldn’t be started."
        );
        setStatus("error");
      }
    }
  };

  const decline = () => {
    setMessage("No problem. Your camera stays off. You can upload a photo instead.");
    setStatus("declined");
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCaptureError("The camera isn’t ready yet. Wait a second and try again.");
      return;
    }
    setCaptureError("");
    analyze(videoFrameToBase64(video));
  };

  const problem = error || captureError;

  return (
    <main className="page page--center">
      <div className="eyebrow">To start analysis</div>

      {/* Step 1: ask before touching the camera */}
      {status === "ask" && (
        <div className="gate">
          <h1 className="title">Allow A.I. to access your camera</h1>
          <p className="lead">
            Skinstric needs your camera to take a selfie for the analysis. The photo is only used
            for this analysis. You can decline and upload a photo instead.
          </p>
          <div className="actions">
            <button className="btn btn--ghost" onClick={decline}>
              Decline
            </button>
            <button className="btn" onClick={startCamera}>
              Allow
            </button>
          </div>
        </div>
      )}

      {(status === "declined" || status === "error") && (
        <div className="gate">
          <h1 className="title">
            {status === "declined" ? "Camera is off" : "Camera problem"}
          </h1>
          <p className="lead">{message}</p>
          <div className="actions">
            <button className="btn btn--ghost" onClick={() => setStatus("ask")}>
              Try again
            </button>
            <Link href="/result" className="btn">
              Upload a photo
            </Link>
          </div>
        </div>
      )}

      {status === "starting" && <p className="hint">Starting the camera...</p>}

      {/* Step 2: the live camera (always on the page so the stream can attach) */}
      <div className="camera" hidden={status !== "ready"}>
        <video ref={videoRef} className="camera__video" autoPlay playsInline muted />
        <div className="camera__guide" aria-hidden />
      </div>

      {status === "ready" && (
        <>
          <h1 className="title">Take a selfie</h1>
          <div className="shutter">
            <button
              className="shutter__btn"
              onClick={capture}
              disabled={busy}
              aria-label="Take photo"
            >
              <span />
            </button>
            <div className="shutter__label">Take photo</div>
            <div className="shutter__hint">
              Center your face in the oval, in good light, then press the button.
            </div>
          </div>
        </>
      )}

      {problem && (
        <div className="notice" role="alert">
          {problem}
        </div>
      )}

      <div className="actions">
        <Link href="/result" className="btn btn--ghost">
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
