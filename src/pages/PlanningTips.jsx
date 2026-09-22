import React from "react";
import "../styles/PlanningTips.css";

const PlanningTips = () => {
  return (
    <main className="planning-page">
      <header className="planning-hero">
        <h1>Planning Tips</h1>
        <p>Practical tips and checklists to plan your perfect wedding.</p>
      </header>

      <section className="planning-grid">
        <article className="plan-card">
          <h3>Budgeting</h3>
          <p>Start with a clear budget and prioritize what matters most.</p>
        </article>

        <article className="plan-card">
          <h3>Vendors</h3>
          <p>Book high-demand vendors early and request samples.</p>
        </article>

        <article className="plan-card">
          <h3>Timeline</h3>
          <p>Create a day-of timeline and share it with vendors.</p>
        </article>

        <article className="plan-card">
          <h3>Guests</h3>
          <p>Keep a running RSVP list and plan for dietary needs.</p>
        </article>
      </section>
    </main>
  );
};

export default PlanningTips;
