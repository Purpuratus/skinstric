import { NextResponse } from "next/server";

const BASE =
  process.env.SKINSTRIC_API_BASE ?? "https://us-central1-frontend-simplified.cloudfunctions.net";

type Attempt = { ok: boolean; data?: unknown; detail: string };

// One try at the Phase Two API with a given request body.
async function tryPhaseTwo(body: Record<string, string>): Promise<Attempt> {
  const res = await fetch(`${BASE}/skinstricPhaseTwo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  let json: { data?: unknown; race?: unknown } | null = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  // The predictions normally sit under "data"; accept them at the top level too.
  const data = json?.data ?? (json?.race ? json : undefined);
  return {
    ok: res.ok && !!data,
    data,
    detail: `HTTP ${res.status}: ${text.slice(0, 160)}`,
  };
}

// Sends the base64 picture to the Phase Two API and returns its predictions.
export async function POST(req: Request) {
  try {
    const { image } = (await req.json()) as { image?: string };
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image received." }, { status: 400 });
    }

    // The API's exact format isn't documented, so try the likely ones in turn.
    const variants: Record<string, string>[] = [
      { Image: image },
      { Image: `data:image/jpeg;base64,${image}` },
      { image },
    ];

    let last: Attempt = { ok: false, detail: "no attempt made" };
    for (const body of variants) {
      last = await tryPhaseTwo(body);
      if (last.ok) return NextResponse.json({ data: last.data });
    }

    console.error("phase-two failed:", last.detail);
    return NextResponse.json(
      { error: "The analysis service couldn’t read that picture.", detail: last.detail },
      { status: 502 }
    );
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    console.error("phase-two error:", err);
    return NextResponse.json(
      {
        error: timedOut
          ? "The analysis service took too long. Please try again."
          : "Could not reach the analysis service.",
      },
      { status: 502 }
    );
  }
}
