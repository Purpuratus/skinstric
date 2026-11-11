import Link from "next/link";

export default function Home() {
  return (
    <main className="page page--center">
      <div className="brand">SKINSTRIC</div>
      <h1 className="hero">
        Sophisticated
        <br />
        skincare
      </h1>
      <p className="lead">
        Skinstric developed an A.I. that creates a highly-personalized routine tailored to what
        your skin needs.
      </p>
      <Link href="/intro" className="btn">
        Take test
      </Link>
    </main>
  );
}
