import Link from "next/link";

const COPY =
  "Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.";

export default function Home() {
  return (
    <main className="landing">
      {/* Decorative dotted diamonds on both sides */}
      <div className="landing__diamond landing__diamond--left" aria-hidden />
      <div className="landing__diamond landing__diamond--right" aria-hidden />

      <span className="landing__discover">
        <span className="tri tri--left" aria-hidden />
        DISCOVER A.I.
      </span>

      <div className="landing__center">
        <h1 className="hero">
          Sophisticated
          <br />
          skincare
        </h1>
        {/* Phones and tablets: text and one button under the title */}
        <p className="landing__copy landing__copy--small">{COPY}</p>
        <Link href="/testing" className="btn landing__enter">
          Enter experience
        </Link>
      </div>

      <Link href="/testing" className="landing__test">
        TAKE TEST
        <span className="tri tri--right" aria-hidden />
      </Link>

      {/* Large screens: text sits bottom left */}
      <p className="landing__copy landing__copy--large">{COPY}</p>
    </main>
  );
}
