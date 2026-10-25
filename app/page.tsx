import Terminal from "@/components/Terminal";
import { CONTACT, EXPERIENCE, PROFILE, PROJECTS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Terminal />
      {/* Plain-text copy of the content for search engines and screen readers. */}
      <section className="sr-only" aria-label="About Elisha Mlay">
        <h2>{PROFILE.name}</h2>
        <p>
          {PROFILE.role} at {PROFILE.org}, {PROFILE.base}.
        </p>
        <h3>Experience</h3>
        <ul>
          {EXPERIENCE.map((e) => (
            <li key={e.title}>
              {e.title}, {e.where}, {e.dates}
            </li>
          ))}
        </ul>
        <h3>Projects</h3>
        <ul>
          {PROJECTS.map((p) => (
            <li key={p.id}>
              {p.title}: {p.blurb}
            </li>
          ))}
        </ul>
        <p>
          <a href="/Elisha_Bariki_Mlay_CV.pdf">Download CV (PDF)</a>
        </p>
        <h3>Contact</h3>
        <p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
        <ul>
          {CONTACT.links.map((l) => (
            <li key={l.label}>
              <a href={l.url}>{l.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
