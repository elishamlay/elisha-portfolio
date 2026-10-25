"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { COMMANDS, COMMAND_NAMES, displayPath, entriesIn } from "@/lib/commands";
import { CONTACT, PROFILE, PROJECTS } from "@/lib/content";
import { TerminalContext } from "@/lib/context";
import { Banner } from "@/lib/views";

type Entry = {
  id: number;
  prompt?: { path: string; cmd: string; label?: string };
  node?: ReactNode;
};

type FormStep = "name" | "email" | "message" | "confirm";
type FormState = {
  step: FormStep;
  data: { name: string; email: string; message: string };
};

const FORM_LABEL: Record<FormStep, string> = {
  name: "your name",
  email: "your email",
  message: "message",
  confirm: "send it? (y/n)",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CHIPS = [
  "about",
  "experience",
  "projects",
  "demo",
  "skills",
  "education",
  "resume",
  "contact",
  "help",
];

function currentTheme(): "dark" | "light" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, node: <Banner /> },
  ]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(1);
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cwdRef = useRef(cwd);
  cwdRef.current = cwd;

  useEffect(() => {
    setLastLogin(
      new Date().toLocaleString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const push = useCallback((e: Omit<Entry, "id">) => {
    setEntries((prev) => [...prev, { id: nextId.current++, ...e }]);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage can be blocked, the theme still applies for this visit */
    }
    return next;
  }, []);

  const run = useCallback(
    (raw: string) => {
      const text = raw.trim();
      const path = displayPath(cwdRef.current);
      if (!text) {
        push({ prompt: { path, cmd: "" } });
        return;
      }
      history.current.push(text);
      cursor.current = history.current.length;

      const [name, ...args] = text.split(/\s+/);
      const fn = COMMANDS[name.toLowerCase()];
      let node: ReactNode = null;
      let cleared = false;

      if (!fn) {
        node = (
          <p className="err">
            zsh: command not found: {name}. Type help.
          </p>
        );
      } else {
        node = fn({
          args,
          cwd: cwdRef.current,
          setCwd: (p) => {
            cwdRef.current = p;
            setCwd(p);
          },
          clear: () => {
            cleared = true;
          },
          toggleTheme,
          history: history.current,
          startForm: () =>
            setForm({
              step: "name",
              data: { name: "", email: "", message: "" },
            }),
        }) as ReactNode;
      }

      if (cleared) {
        setEntries([]);
        return;
      }
      push({ prompt: { path, cmd: text }, node });
      inputRef.current?.focus({ preventScroll: true });
    },
    [push, toggleTheme],
  );

  const ctx = useMemo(() => ({ run }), [run]);

  const cancelForm = () => {
    setForm(null);
    push({ node: <p className="dim">Cancelled.</p> });
  };

  const sendMessage = async (data: FormState["data"]) => {
    setBusy(true);
    push({ node: <p className="dim">Sending...</p> });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (res.ok && json.ok) {
        push({
          node: (
            <p className="ok">
              Sent. Thanks {data.name.split(" ")[0]}, I will reply to {data.email}.
            </p>
          ),
        });
      } else {
        push({
          node: (
            <>
              <p className="err">{json.error ?? "The message could not be sent."}</p>
              <p className="dim">
                You can email me directly:{" "}
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </p>
            </>
          ),
        });
      }
    } catch {
      push({
        node: (
          <>
            <p className="err">Network error, the message was not sent.</p>
            <p className="dim">
              You can email me directly:{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </>
        ),
      });
    } finally {
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
    }
  };

  const handleForm = (raw: string) => {
    if (!form || busy) return;
    const text = raw.trim();
    push({ prompt: { path: "", label: FORM_LABEL[form.step], cmd: text } });

    if (form.step === "name") {
      if (!text || text.length > 80) {
        push({ node: <p className="err">Enter a name, up to 80 characters.</p> });
        return;
      }
      setForm({ step: "email", data: { ...form.data, name: text } });
    } else if (form.step === "email") {
      if (!EMAIL_RE.test(text) || text.length > 120) {
        push({ node: <p className="err">That does not look like an email address.</p> });
        return;
      }
      setForm({ step: "message", data: { ...form.data, email: text } });
    } else if (form.step === "message") {
      if (!text || text.length > 2000) {
        push({ node: <p className="err">Write a message, up to 2000 characters.</p> });
        return;
      }
      setForm({ step: "confirm", data: { ...form.data, message: text } });
      push({
        node: (
          <div className="demo">
            {`to:      ${CONTACT.email}\nfrom:    ${form.data.name} <${form.data.email}>\nmessage: ${text}`}
          </div>
        ),
      });
    } else {
      const a = text.toLowerCase();
      if (a === "y" || a === "yes") {
        const data = form.data;
        setForm(null);
        void sendMessage(data);
      } else if (a === "n" || a === "no") {
        cancelForm();
      } else {
        push({ node: <p className="err">Type y to send or n to cancel.</p> });
      }
    }
  };

  const complete = () => {
    const parts = value.split(/\s+/);
    const last = parts[parts.length - 1];
    const first = parts.length === 1;
    const hits = first
      ? COMMAND_NAMES.filter((n) => n.startsWith(last.toLowerCase()))
      : parts[0] === "open"
        ? PROJECTS.map((p) => p.id).filter((id) => id.startsWith(last))
        : parts[0] === "sudo"
          ? ["hire-me"].filter((n) => n.startsWith(last))
          : parts[0] === "contact"
            ? ["--send"].filter((n) => n.startsWith(last))
            : entriesIn(cwdRef.current, last);
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      setValue(parts.join(" ") + (hits[0].endsWith("/") ? "" : " "));
    } else if (hits.length > 1) {
      push({
        prompt: { path: displayPath(cwdRef.current), cmd: value },
        node: <div className="dim hits">{hits.join("   ")}</div>,
      });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (form) handleForm(value);
      else run(value);
      setValue("");
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      if (!window.getSelection()?.toString()) {
        e.preventDefault();
        if (form) {
          cancelForm();
        } else {
          push({ prompt: { path: displayPath(cwdRef.current), cmd: `${value}^C` } });
        }
        setValue("");
      }
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      setValue("");
      return;
    }
    if (form) return; // history, completion and clear are off while a form is open
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cursor.current > 0) {
        cursor.current -= 1;
        setValue(history.current[cursor.current] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor.current < history.current.length - 1) {
        cursor.current += 1;
        setValue(history.current[cursor.current]);
      } else {
        cursor.current = history.current.length;
        setValue("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    }
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <TerminalContext.Provider value={ctx}>
      <div className="shell">
        <header className="bar">
          <span className="bar-title">
            <b>
              {PROFILE.handle}@{PROFILE.host}
            </b>
            <span className="bar-sep"> · </span>
            <span className="bar-shell">zsh</span>
          </span>
          <button
            type="button"
            className="bar-btn"
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
          >
            theme
          </button>
        </header>

        <div
          className="screen"
          ref={screenRef}
          onClick={focusInput}
          role="log"
          aria-live="polite"
        >
          <div className="screen-inner">
            {lastLogin && <p className="dim">Last login: {lastLogin} on ttys001</p>}
            {entries.map((e) => (
              <div className="entry" key={e.id}>
                {e.prompt && (
                  <div className="echo">
                    {e.prompt.label ? (
                      <span className="ps">
                        {e.prompt.label}
                        <i>&gt;</i>
                      </span>
                    ) : (
                      <span className="ps">
                        {PROFILE.handle}@{PROFILE.host}
                        <i>:</i>
                        {e.prompt.path}
                        <i>$</i>
                      </span>
                    )}{" "}
                    {e.prompt.cmd}
                  </div>
                )}
                {e.node && <div className="out">{e.node}</div>}
              </div>
            ))}

            <div className="prompt">
              <label htmlFor="cmd-input" className="ps">
                {form ? (
                  <>
                    {FORM_LABEL[form.step]}
                    <i>&gt;</i>
                  </>
                ) : (
                  <>
                    <span className="host">
                      {PROFILE.handle}@{PROFILE.host}
                      <i>:</i>
                    </span>
                    {displayPath(cwd)}
                    <i>$</i>
                  </>
                )}
              </label>
              <input
                id="cmd-input"
                ref={inputRef}
                type={form?.step === "email" ? "email" : "text"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint={form ? "next" : "go"}
                maxLength={form ? 2000 : 200}
                aria-label={form ? FORM_LABEL[form.step] : "Terminal command"}
              />
            </div>
          </div>
        </div>

        <nav className="dock" aria-label="Quick commands">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              disabled={busy || !!form}
              onClick={() => run(c)}
            >
              {c}
            </button>
          ))}
        </nav>
      </div>
    </TerminalContext.Provider>
  );
}
