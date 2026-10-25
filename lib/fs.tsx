import type { ReactNode } from "react";
import { PROJECTS } from "./content";
import {
  About,
  Contact,
  Education,
  Experience,
  ProjectCard,
  Skills,
} from "./views";

export type FsNode =
  | { type: "dir"; children: Record<string, FsNode> }
  | { type: "file"; render: () => ReactNode };

const projectFiles: Record<string, FsNode> = {};
for (const p of PROJECTS) {
  projectFiles[`${p.id}.md`] = {
    type: "file",
    render: () => <ProjectCard p={p} />,
  };
}

export const ROOT: FsNode = {
  type: "dir",
  children: {
    "about.md": { type: "file", render: () => <About /> },
    "experience.md": { type: "file", render: () => <Experience /> },
    "education.md": { type: "file", render: () => <Education /> },
    "skills.txt": { type: "file", render: () => <Skills /> },
    "contact.txt": { type: "file", render: () => <Contact /> },
    projects: { type: "dir", children: projectFiles },
  },
};

/** Resolve a path (absolute with ~ or relative to cwd) to a list of segments, or null. */
export function resolvePath(cwd: string[], input: string): string[] | null {
  let parts: string[];
  if (!input || input === "~") parts = [];
  else if (input.startsWith("~/")) parts = input.slice(2).split("/");
  else if (input.startsWith("/")) parts = input.slice(1).split("/");
  else parts = [...cwd, ...input.split("/")];

  const out: string[] = [];
  for (const seg of parts) {
    if (!seg || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return out;
}

export function getNode(path: string[]): FsNode | null {
  let node: FsNode = ROOT;
  for (const seg of path) {
    if (node.type !== "dir" || !(seg in node.children)) return null;
    node = node.children[seg];
  }
  return node;
}

export const displayPath = (cwd: string[]) =>
  cwd.length ? `~/${cwd.join("/")}` : "~";
