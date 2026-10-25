"use client";

import type { ReactNode } from "react";
import {
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  type Project,
} from "./content";
import { useTerminal } from "./context";

export function Cmd({ cmd, label }: { cmd: string; label?: string }) {
  const { run } = useTerminal();
  return (
    <button type="button" className="cmd" onClick={() => run(cmd)}>
      {label ?? cmd}
    </button>
  );
}

export function Banner() {
  return (
    <>
      <h1 className="name">
        {PROFILE.short.toUpperCase()}
        <span className="cur" aria-hidden="true" />
      </h1>
      <p className="tag">{PROFILE.tagline}</p>
      <Neofetch />
      <p className="dim">
        Type <Cmd cmd="help" /> to see commands, or start with{" "}
        <Cmd cmd="about" /> and <Cmd cmd="projects" />.
      </p>
    </>
  );
}

export function Neofetch() {
  const rows: [string, string][] = [
    ["role", PROFILE.role],
    ["org", PROFILE.org],
    ["base", PROFILE.base],
    ["edu", PROFILE.edu],
    ["langs", PROFILE.langs],
    ["stack", PROFILE.stack],
    ["side", PROFILE.side],
  ];
  return (
    <dl className="sys">
      {rows.map(([k, v]) => (
        <div className="sys-row" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Help() {
  const rows: [string, string, string?][] = [
    ["about", "who I am"],
    ["experience", "where I have worked"],
    ["education", "where I studied"],
    ["projects", "things I have built"],
    ["demo", "watch a revenue assurance check run (try demo 5)", "demo"],
    ["skills", "tools I use"],
    ["resume", "open my CV (PDF)"],
    ["contact", "how to reach me"],
    ["contact --send", "write me a message from here", "contact --send"],
    ["ls", "list files (try ls projects)"],
    ["cat", "print a file, e.g. cat about.md", "cat about.md"],
    ["cd", "change directory, e.g. cd projects", "cd projects"],
    ["tree", "show the whole file tree"],
    ["neofetch", "system summary"],
    ["theme", "switch light and dark"],
    ["clear", "clear the screen (Ctrl+L)"],
  ];
  return (
    <>
      <p className="dim">
        Click a command or type it. Tab completes, the up arrow recalls history.
      </p>
      <div className="tbl">
        {rows.map(([c, d, run]) => (
          <div className="tbl-row" key={c}>
            <div>
              <Cmd cmd={run ?? c} label={c} />
            </div>
            <div>{d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function About() {
  return (
    <>
      <p>
        I am <span className="hl">{PROFILE.name}</span>, a data analyst and
        revenue assurance specialist at {PROFILE.org} in Dar es Salaam.
      </p>
      <p>
        I work with large transactional datasets in SQL and PL/SQL to find
        trends, revenue opportunities and performance gaps. I build the Power BI
        dashboards and recurring reports that business teams rely on, and I
        validate every report before it goes out. At the bank I designed a
        Z-score anomaly detection model in PL/SQL that flags irregular
        transactions for investigation.
      </p>
      <p>
        Before CRDB I worked in analytics and IT support at HUB Network and TTCL,
        and as a system and data analyst at Y4C HUB. I studied Business
        Information Technology at the University of Dar es Salaam.
      </p>
      <p>
        Outside the bank I run <span className="hl">Brain Growth System</span>,
        a social media agency, and I build web apps and games to keep my
        engineering sharp.
      </p>
      <p className="dim">
        Next: <Cmd cmd="projects" /> or <Cmd cmd="experience" />
      </p>
    </>
  );
}

export function Experience() {
  return (
    <>
      {EXPERIENCE.map((e) => (
        <div className="proj" key={e.title + e.where}>
          <h3>{e.title}</h3>
          <div className="meta">
            {e.where} · {e.dates}
          </div>
          {e.points.length > 0 && (
            <ul>
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export function Education() {
  return (
    <>
      {EDUCATION.map((e) => (
        <div className="proj" key={e.title}>
          <h3>{e.title}</h3>
          <div className="meta">
            {e.where} · {e.dates}
          </div>
        </div>
      ))}
      <p className="dim">Languages: {PROFILE.langs}</p>
    </>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const cls = p.status === "built" ? "live" : "wip";
  return (
    <div className="proj">
      <h3>{p.title}</h3>
      <div className="meta">
        <span className={`badge ${cls}`}>{p.status}</span>
        {p.stack}
      </div>
      <div>{p.blurb}</div>
      <ul>
        {p.points.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectList() {
  return (
    <>
      <p className="dim">
        {PROJECTS.length} projects. Open one with{" "}
        <Cmd cmd="open ra-pipeline" /> or any id below.
      </p>
      <div className="tbl">
        {PROJECTS.map((p) => (
          <div className="tbl-row" key={p.id}>
            <div>
              <Cmd cmd={`open ${p.id}`} label={p.id} />
            </div>
            <div>
              {p.title} <span className="dim">· {p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Skills() {
  return (
    <div className="tbl">
      {SKILL_GROUPS.map((g) => (
        <div className="tbl-row" key={g.label}>
          <div className="ok">{g.label}</div>
          <div>{g.items.join(" · ")}</div>
        </div>
      ))}
    </div>
  );
}

export function Contact() {
  return (
    <div className="tbl">
      <div className="tbl-row">
        <div className="ok">email</div>
        <div>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>
      {CONTACT.links.map((l) => (
        <div className="tbl-row" key={l.label}>
          <div className="ok">{l.label}</div>
          <div>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              {l.text}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Resume() {
  return (
    <>
      <p>
        My CV as a PDF (2 pages):{" "}
        <a
          href="/Elisha_Bariki_Mlay_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elisha_Bariki_Mlay_CV.pdf
        </a>
      </p>
      <p className="dim">Referees are available on request.</p>
    </>
  );
}

export function Line({ children, tone }: { children: ReactNode; tone?: "err" | "ok" | "dim" }) {
  return <p className={tone ?? undefined}>{children}</p>;
}
