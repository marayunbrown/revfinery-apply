import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Users, Star } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Apply | Revfinery Ecosystem</title>
        <meta name="description" content="Join the Revfinery ecosystem - Apply to the Talent Network or the Revfinery Bench" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.prod.website-files.com/68854e916991f33c6c47cd8c/69041aa4d9f017ce0c6842d8_ChatGPT%20Image%20Oct%2030%2C%202025%2C%2010_10_20%20PM.png" />
      </Head>

      <div className="landing-container">
        <header className="landing-header">
          <a href="https://www.revfinery.com/talent-network">
            <ArrowLeft size={16} />
            Back to Revfinery
          </a>
          <h1>Join the <span className="gradient-text">Revfinery Ecosystem</span></h1>
          <p>Choose the path that fits where you are in your sales career.</p>
        </header>

        <div className="landing-grid">
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
              <p className="card-note">Best for: 0-5 years in sales, skill-building focus</p>
            </div>
          </div>

          {/* Bench Card */}
          <div className="landing-card bench">
            <span className="badge">
              <Star size={14} />
              Invite-Level
            </span>
            <h2>The Revfinery Bench</h2>
            <p>For experienced sales leaders and consultants ready to work on real client engagements.</p>
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
      </div>
    </>
  );
}
