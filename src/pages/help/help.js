import React from 'react';

const helpFeatures = [
  {
    title: 'Multi-platform Ratings on Single Page',
    description: 'View all your competitive programming data in one place with a unified OneProfile leaderboard and aggregated rating snapshot.'
  },
  {
    title: 'OneProfile Aggregated Rating',
    description: 'See your combined rating score calculated across Codeforces, CodeChef, AtCoder, and LeetCode using OneProfile’s weighted formula.'
  },
  {
    title: 'Upcoming Contests',
    description: 'Get a quick peek at contests coming up across supported platforms so you can plan your training schedule better.'
  },
  {
    title: 'User Comparator',
    description: 'Compare your profile against other users to understand your position, growth, and relative performance.'
  },
  {
    title: 'AI Problem Recommendation',
    description: 'Get personalized problem suggestions based on your current skill level, weak points, and contest readiness.'
  },
  {
    title: 'AI CP Roadmap — 30/60/90 Days',
    description: 'Follow a guided training roadmap built around your goals and current rating, helping you improve steadily over time.'
  },
  {
    title: 'AI Contest Coach',
    description: 'Receive contest-focused strategy and preparation guidance tailored to your strengths and upcoming events.'
  },
  {
    title: 'AI Performance Analysis',
    description: 'Identify your strongest topics, recurring mistakes, and opportunities for improvement with a focused analysis layer.'
  },
  {
    title: 'AI “Why Am I Stuck?”',
    description: 'A guided explanation layer that highlights the common reasons behind plateauing performance and suggests next steps.'
  },
  {
    title: 'Achievements & Skill Badges',
    description: 'Unlock badges and visual milestones as you improve in problem-solving, contest consistency, and overall learning.'
  },
  {
    title: 'Rating & Progress Analytics',
    description: 'Track your rating change over time with progression charts and deeper metrics that make learning measurable.'
  },
  {
    title: 'Skill / Problem Heatmap',
    description: 'Understand where you spend effort and which problem patterns are helping you grow most efficiently.'
  },
  {
    title: 'Global CP Skill Map',
    description: 'Explore how your skills compare to a broader competitive programming landscape using a global benchmarking lens.'
  },
  {
    title: 'Find Your CP Twin',
    description: 'Discover similar users by solving patterns, platform strengths, and rating distribution to build better peer comparison.'
  },
  {
    title: 'Mentor Match',
    description: 'Connect with users or mentors whose trajectory matches your strengths, gaps, and learning style for more effective guidance.'
  }
];

function Help() {
  return (
    <div className="help-page">
      <section className="help-hero">
        <h1>OneProfile Help & Features</h1>
        <p>
          OneProfile brings together your competitive programming profile, ratings, contest planning,
          and AI-powered growth tools in one platform so you can improve with clarity and consistency.
        </p>
      </section>

      <div className="help-grid">
        {helpFeatures.map((feature) => (
          <div key={feature.title} className="help-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="help-banner">
        <strong>Pro tip:</strong> Keep your platform handles updated to ensure your aggregated rating and leaderboard stay accurate.
      </div>
    </div>
  );
}

export default Help;
