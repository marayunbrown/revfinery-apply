import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Users, Star, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Apply | Revfinery Talent Network</title>
        <meta name="description" content="Join the Revfinery ecosystem - Apply to the University Cohort, Talent Network, or the Revfinery Bench" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.prod.website-files.com/68854e916991f33c6c47cd8c/69041aa4d9f017ce0c6842d8_ChatGPT%20Image%20Oct%2030%2C%202025%2C%2010_10_20%20PM.png" />
      </Head>

      <div className="landing-container">
        <header className="landing-header">
          <a href="https://www.revfinery.com/talent-network">
            <ArrowLeft size={16} />
            Back to Talent Network
          </a>
          <h1>Join the <span className="gradient-text">Revfinery Talent Network</span></h1>
          <p>Choose the path that fits where you are in your sales career.</p>
        </header>

        <div className="landing-grid three-col">
          {/* University Cohort Card */}
          <div className="landing-card cohort">
            <span className="badge cohort-badge">
              <GraduationCap size={14} />
              Students & Early Career
            </span>
            <h2>University Cohort</h2>
            <p>8-week virtual program for students and early-career professionals breaking into B2B sales.</p>
            <ul>
              <li>Self-paced AI Trainer curriculum</li>
              <li>Live kickoff + graduation sessions</li>
              <li>Private Slack community</li>
              <li>Certificate + job matching at 60%+</li>
            </ul>
            <div className="card-footer">
              <Link href="/cohort">
                Apply to Cohort
                <ArrowRight size={16} />
              </Link>
              <p className="card-note">Best for: Students, recent grads, 0-1 years</p>
            </div>
          </div>

          {/* Talent Network Card */}
          <div className="landing-card network">
            <span className="badge">
              <Users size={14} />
              Build & Grow
            </span>
            <h2>Talent Network</h2>
            <p>For sales professionals looking to build skills, get trained, and get matched to opportunities.</p>
            <ul>
              <li>Access training, playbooks, and live practice</li>
              <li>Get matched to BDR/SDR roles and projects</li>
              <li>Flexible: part-time, full-time, or project-based</li>
              <li>Grow within the Revfinery ecosystem</li>
            </ul>
            <div className="card-footer">
              <Link href="/network">
                Apply to the Network
                <ArrowRight size={16} />
              </Link>
              <p className="card-note">Best for: 1-5 years in sales, skill-building focus</p>
            </div>
          </div>

          {/* Bench Card */}
          <div className="landing-card bench">
            <span className="badge">
              <Star size={14} />
              Top Performers
            </span>
            <h2>The Revfinery Bench</h2>
            <p>For experienced sellers and consultants ready to work on real client engagements.</p>
            <ul>
              <li>Consult on Revfinery client projects</li>
              <li>Fractional leadership opportunities</li>
              <li>Strategic deal coaching and advisory</li>
              <li>Set your own rate and availability</li>
            </ul>
            <div className="card-footer">
              <Link href="/bench">
                Apply to the Bench
                <ArrowRight size={16} />
              </Link>
              <p className="card-note">Best for: 5+ years in sales, leadership experience</p>
            </div>
          </div>
        </div>

        <div className="landing-footer">
          <p>Not sure which path? <a href="https://revfinery-assessment.vercel.app">Take the free skills assessment</a> to see where you stand.</p>
        </div>
      </div>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fbf6f1 0%, #fff7e8 50%, #eaf6f7 100%);
          padding: 48px 24px;
        }
        .landing-header {
          max-width: 900px;
          margin: 0 auto 40px;
          text-align: center;
        }
        .landing-header a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #4c5f62;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .landing-header h1 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 900;
          color: #0e2a2d;
          margin: 0 0 12px;
        }
        .gradient-text {
          background: linear-gradient(90deg, #0c6b73, #f25025);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .landing-header p {
          color: #4c5f62;
          font-size: 16px;
          margin: 0;
        }
        .landing-grid {
          display: grid;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .landing-grid.three-col {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .landing-grid.three-col {
            grid-template-columns: 1fr;
          }
        }
        .landing-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .landing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
        }
        .landing-card.cohort {
          border-top: 4px solid #ffd166;
        }
        .landing-card.network {
          border-top: 4px solid #0c6b73;
        }
        .landing-card.bench {
          border-top: 4px solid #f25025;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
          margin-bottom: 16px;
        }
        .landing-card.cohort .badge {
          background: #fff7e8;
          color: #5b3e2a;
        }
        .landing-card.network .badge {
          background: #eaf6f7;
          color: #0c6b73;
        }
        .landing-card.bench .badge {
          background: #fff0eb;
          color: #c23d1a;
        }
        .landing-card h2 {
          font-size: 22px;
          font-weight: 900;
          color: #0e2a2d;
          margin: 0 0 10px;
        }
        .landing-card > p {
          color: #4c5f62;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 16px;
        }
        .landing-card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          flex: 1;
        }
        .landing-card li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #344b4e;
        }
        .landing-card li::before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        .landing-card.cohort li::before {
          color: #ffd166;
        }
        .landing-card.network li::before {
          color: #0c6b73;
        }
        .landing-card.bench li::before {
          color: #f25025;
        }
        .card-footer {
          border-top: 1px solid #f0f3f4;
          padding-top: 16px;
          margin-top: auto;
        }
        .card-footer a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.15s ease;
        }
        .card-footer a:hover {
          transform: translateX(4px);
        }
        .landing-card.cohort .card-footer a {
          background: #ffd166;
          color: #0e2a2d;
        }
        .landing-card.network .card-footer a {
          background: #0c6b73;
          color: white;
        }
        .landing-card.bench .card-footer a {
          background: #f25025;
          color: white;
        }
        .card-note {
          font-size: 12px;
          color: #6b7d80;
          margin: 12px 0 0;
        }
        .landing-footer {
          max-width: 900px;
          margin: 40px auto 0;
          text-align: center;
        }
        .landing-footer p {
          font-size: 14px;
          color: #4c5f62;
        }
        .landing-footer a {
          color: #0c6b73;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
}
