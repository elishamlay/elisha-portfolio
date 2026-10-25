import type { ReactNode } from "react";
import { PROFILE, PROJECTS } from "./content";
import { displayPath, getNode, resolvePath, ROOT, type FsNode } from "./fs";
import { DemoRun } from "./DemoView";
import {
  About,
  Banner,
  Cmd,
  Contact,
  Education,
  Experience,
  Help,
  Line,
  Neofetch,
  ProjectCard,
  ProjectList,
  Resume,
  Skills,
} from "./views";

export type CommandCtx = {
  args: string[];
  cwd: string[];
  setCwd: (p: string[]) => void;
  clear: () => void;
  toggleTheme: () => string;
  history: string[];
  startForm: () => void;
};

type Command = (ctx: CommandCtx) => ReactNode | void;

const notFound = (cmd: string, arg: string) => (
  <Line tone="err">
    {cmd}: {arg}: No such file or directory
  </Line>
);

function listDir(node: FsNode, dirPath: string[]) {
  if (node.type !== "dir") return null;
  const names = Object.keys(node.children).sort((a, b) => {
    const ad = node.children[a].type === "dir" ? 0 : 1;
    const bd = node.children[b].type === "dir" ? 0 : 1;
    return ad - bd || a.localeCompare(b);
  });
  return (
    <div className="ls">
      {names.map((n) => {
        const isDir = node.children[n].type === "dir";
        const full = [...dirPath, n].join("/");
        return isDir ? (
          <span className="ok" key={n}>
            <Cmd cmd={`cd ~/${full}`} label={`${n}/`} />
          </span>
        ) : (
          <Cmd key={n} cmd={`cat ~/${full}`} label={n} />
        );
      })}
    </div>
  );
}

function tree(node: FsNode, prefix = ""): ReactNode[] {
  if (node.type !== "dir") return [];
  const names = Object.keys(node.children);
  return names.flatMap((n, i) => {
    const last = i === names.length - 1;
    const child = node.children[n];
    const row = (
      <div key={prefix + n}>
        {prefix}
        {last ? "└── " : "├── "}
        {child.type === "dir" ? <span className="ok">{n}/</span> : n}
      </div>
    );
    return [row, ...tree(child, prefix + (last ? "    " : "│   "))];
  });
}

export const COMMANDS: Record<string, Command> = {
  help: () => <Help />,
  about: () => <About />,
  whoami: () => <Line>{PROFILE.handle}</Line>,
  experience: () => <Experience />,
  education: () => <Education />,
  skills: () => <Skills />,
  contact: ({ args, startForm }) => {
    if (args[0] === "--send" || args[0] === "send") {
      startForm();
      return (
        <p className="dim">
          Write me a message. I will ask three questions. Ctrl+C cancels.
        </p>
      );
    }
    return (
      <>
        <Contact />
        <p className="dim">
          Or write to me from here: <Cmd cmd="contact --send" />
        </p>
      </>
    );
  },
  resume: () => <Resume />,
  neofetch: () => <Neofetch />,
  banner: () => <Banner />,
  projects: () => <ProjectList />,

  demo: ({ args }) => {
    const n = Number.parseInt(args[0] ?? "1", 10);
    return <DemoRun seed={Number.isFinite(n) && n > 0 ? n : 1} />;
  },

  open: ({ args }) => {
    const id = (args[0] ?? "").replace(/^.*projects\//, "").replace(/\.md$/, "");
    const p = PROJECTS.find((x) => x.id === id);
    if (!p)
      return (
        <Line tone="err">
          open: no project &quot;{args[0] ?? ""}&quot;. Try <Cmd cmd="projects" />.
        </Line>
      );
    return <ProjectCard p={p} />;
  },

  ls: ({ args, cwd }) => {
    const target = resolvePath(cwd, args[0] ?? "");
    const node = target && getNode(target);
    if (!target || !node) return notFound("ls", args[0] ?? "");
    if (node.type === "file") return <Line>{target[target.length - 1]}</Line>;
    return listDir(node, target);
  },

  cd: ({ args, cwd, setCwd }) => {
    const target = resolvePath(cwd, args[0] ?? "");
    const node = target && getNode(target);
    if (!target || !node) return notFound("cd", args[0] ?? "");
    if (node.type !== "dir")
      return <Line tone="err">cd: {args[0]}: Not a directory</Line>;
    setCwd(target);
  },

  pwd: ({ cwd }) => (
    <Line>/home/{PROFILE.handle}{cwd.length ? `/${cwd.join("/")}` : ""}</Line>
  ),

  cat: ({ args, cwd }) => {
    if (!args[0]) return <Line tone="err">cat: missing file operand</Line>;
    const target = resolvePath(cwd, args[0]);
    const node = target && getNode(target);
    if (!target || !node) return notFound("cat", args[0]);
    if (node.type === "dir")
      return <Line tone="err">cat: {args[0]}: Is a directory</Line>;
    return node.render();
  },

  tree: () => (
    <div className="tree">
      <div>~</div>
      {tree(ROOT)}
    </div>
  ),

  echo: ({ args }) => <Line>{args.join(" ")}</Line>,
  date: () => <Line>{new Date().toString()}</Line>,
  clear: ({ clear }) => {
    clear();
  },
  theme: ({ toggleTheme }) => <Line tone="dim">Switched to {toggleTheme()} theme.</Line>,
  history: ({ history }) =>
    history.length ? (
      <div className="dim">
        {history.map((h, i) => (
          <div key={i}>
            {String(i + 1).padStart(3, " ")}  {h}
          </div>
        ))}
      </div>
    ) : (
      <Line tone="dim">No history yet.</Line>
    ),

  sudo: ({ args }) =>
    args[0] === "hire-me" ? (
      <>
        <Line tone="ok">Permission granted. Here is how to reach me:</Line>
        <Contact />
      </>
    ) : (
      <>
        <Line tone="err">
          {PROFILE.handle} is not in the sudoers file. This incident will be reported.
        </Line>
        <Line tone="dim">Hint: try sudo hire-me</Line>
      </>
    ),

  exit: () => <Line tone="dim">logout: there is nowhere to go, this is a portfolio.</Line>,
};

export const COMMAND_NAMES = Object.keys(COMMANDS);

/** Names of entries inside a directory, with a trailing slash on directories. */
export function entriesIn(cwd: string[], typed: string): string[] {
  const slash = typed.lastIndexOf("/");
  const dirPart = slash >= 0 ? typed.slice(0, slash + 1) : "";
  const base = typed.slice(slash + 1);
  const dir = resolvePath(cwd, dirPart || "");
  const node = dir && getNode(dir);
  if (!node || node.type !== "dir") return [];
  return Object.keys(node.children)
    .filter((n) => n.startsWith(base))
    .map((n) => dirPart + n + (node.children[n].type === "dir" ? "/" : ""));
}

export { displayPath };
