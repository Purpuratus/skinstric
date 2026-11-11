import { useMemo, useSyncExternalStore } from "react";
import type { Analysis, UserInfo } from "./skinstric";

const USER_KEY = "skinstric:user";
const ANALYSIS_KEY = "skinstric:analysis";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// undefined = still loading in the browser, null = nothing saved, string = saved.
function useStored(key: string) {
  return useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => localStorage.getItem(key),
    () => undefined
  );
}

function parse<T>(raw: string | null | undefined): T | null | undefined {
  if (raw === undefined || raw === null) return raw;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useUser() {
  const raw = useStored(USER_KEY);
  return useMemo(() => parse<UserInfo>(raw), [raw]);
}

export function useAnalysis() {
  const raw = useStored(ANALYSIS_KEY);
  return useMemo(() => parse<Analysis>(raw), [raw]);
}

export function saveUser(user: UserInfo) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveAnalysis(analysis: Analysis) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
}
