import { NextResponse } from "next/server";
import { validateText } from "@/lib/skinstric";

const BASE =
  process.env.SKINSTRIC_API_BASE ?? "https://us-central1-frontend-simplified.cloudfunctions.net";

// Passes the name and location on to the Phase One API.
export async function POST(req: Request) {
  try {
    const { name, location } = (await req.json()) as { name?: string; location?: string };

    // Check again on the server, never trust the browser alone.
    const problem =
      validateText(String(name ?? ""), "Name") || validateText(String(location ?? ""), "Location");
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const res = await fetch(`${BASE}/skinstricPhaseOne`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(name).trim(), location: String(location).trim() }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "The service rejected your details." }, { status: 502 });
    }
    const json = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: true, result: json });
  } catch {
    return NextResponse.json({ error: "Could not reach the service." }, { status: 502 });
  }
}
