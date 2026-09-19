import { toast } from "sonner";
import {
  Braces,
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  Copy,
  Download,
  FileJson,
  Github,
  Hash,
  Info,
  Keyboard,
  Moon,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Action = "format" | "repair" | "minify" | "validate";
type ResultState = "idle" | "valid" | "error" | "repaired";

const SAMPLE_JSON = `{
  "project": "json-repair-studio",
  "version": 1,
  "features": [
    "format",
    "repair",
  ],
  owner: "open source"
}`;

const cleanCodeFence = (value: string) =>
  value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const repairJson = (value: string) => {
  let repaired = cleanCodeFence(value)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_$][\w$-]*)(\s*:)/g, '$1"$2"$3');

  repaired = repaired.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_match, text: string) =>
    `"${text.replace(/"/g, '\\"')}"`,
  );

  return repaired;
};

const getErrorDetails = (message: string, source: string) => {
  const positionMatch = message.match(/position\s+(\d+)/i);
  const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  let line = lineColumnMatch ? Number(lineColumnMatch[1]) : 1;
  let column = lineColumnMatch ? Number(lineColumnMatch[2]) : 1;

  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const before = source.slice(0, position);
    line = before.split("\n").length;
    column = position - before.lastIndexOf("\n");
  }

  return { message: message.replace(/^JSON\.parse:\s*/i, ""), line, column };
};

const parseJson = (source: string) => {
  const candidate = cleanCodeFence(source);
  try {
    return { value: JSON.parse(candidate) as unknown, candidate };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { error: getErrorDetails(message, candidate), candidate };
  }
};

function LineNumbers({ text }: { text: string }) {
  const lines = Math.max(1, text.split("\n").length);
  return (
    <div className="select-none border-r border-white/[0.06] px-3 py-4 text-right font-mono text-[11px] leading-[1.72rem] text-slate-600">
      {Array.from({ length: lines }, (_, index) => (
        <div key={index}>{String(index + 1).padStart(2, "0")}</div>
      ))}
    </div>
  );
}

function ActionButton({
  active,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 active:scale-[0.98] ${
        active
          ? "bg-mint/10 text-mint shadow-[inset_3px_0_0_#8ef0c1]"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={active ? "text-mint" : "text-slate-500 group-hover:text-slate-300"}>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Home() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [action, setAction] = useState<Action>("repair");
  const [resultState, setResultState] = useState<ResultState>("idle");
  const [error, setError] = useState<{ message: string; line: number; column: number } | null>(null);
  const [indent, setIndent] = useState("2");
  const [history, setHistory] = useState<string[]>([]);

  const stats = useMemo(() => {
    const bytes = new TextEncoder().encode(input).length;
    const lines = input.split("\n").length;
    return { bytes, lines };
  }, [input]);

  const run = (selectedAction: Action = action) => {
    setAction(selectedAction);
    setError(null);

    if (!input.trim()) {
      setOutput("");
      setResultState("idle");
      toast.error("Paste some JSON first");
      return;
    }

    const isRepair = selectedAction === "repair";
    const source = isRepair ? repairJson(input) : input;
    const parsed = parseJson(source);

    if (parsed.error) {
      setOutput("");
      setResultState("error");
      setError(parsed.error);
      toast.error("JSON needs a little cleanup", { description: `Line ${parsed.error.line}, column ${parsed.error.column}` });
      return;
    }

    const spacing = selectedAction === "minify" ? 0 : Number(indent);
    const formatted = JSON.stringify(parsed.value, null, spacing);
    setOutput(formatted);
    setResultState(isRepair && source !== cleanCodeFence(input) ? "repaired" : "valid");
    setHistory((items) => [selectedAction, ...items.filter((item) => item !== selectedAction)].slice(0, 3));
    toast.success(selectedAction === "validate" ? "Valid JSON" : `${selectedAction[0].toUpperCase()}${selectedAction.slice(1)} complete`, {
      description: "Everything stayed in your browser.",
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        run("repair");
      }
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        run("format");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const copyOutput = async () => {
    if (!output) {
      toast.error("There is no output to copy");
      return;
    }
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadOutput = () => {
    if (!output) {
      toast.error("Run an action before downloading");
      return;
    }
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "repaired.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded");
  };

  const reset = () => {
    setInput("");
    setOutput("");
    setError(null);
    setResultState("idle");
    toast.success("Workspace cleared");
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-100 selection:bg-mint/30 selection:text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080b10]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-[#07100d] shadow-[0_0_24px_rgba(142,240,193,0.22)]">
              <Braces size={19} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[15px] font-bold tracking-tight text-white">JSON Repair Studio</span>
                <span className="rounded-full border border-mint/20 bg-mint/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-mint">Open source</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">Format, repair & inspect JSON locally</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden items-center gap-2 text-[11px] text-slate-500 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_9px_#8ef0c1]" />
              No uploads · privacy first
            </div>
            <a className="hidden items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white sm:flex" href="#how-it-works">
              <Info size={15} /> How it works
            </a>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-500 transition hover:border-white/20 hover:text-white" type="button" title="Dark mode">
              <Moon size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-white/[0.07] px-5 py-5 lg:min-h-[calc(100vh-70px)] lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
          <div className="mb-5 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Actions</div>
          <nav className="grid grid-cols-2 gap-1 lg:block lg:space-y-1">
            <ActionButton active={action === "format"} icon={<Code2 size={17} />} label="Format" onClick={() => run("format")} />
            <ActionButton active={action === "repair"} icon={<WandSparkles size={17} />} label="Repair JSON" onClick={() => run("repair")} />
            <ActionButton active={action === "minify"} icon={<Zap size={17} />} label="Minify" onClick={() => run("minify")} />
            <ActionButton active={action === "validate"} icon={<ShieldCheck size={17} />} label="Validate" onClick={() => run("validate")} />
          </nav>

          <div className="mt-8 hidden lg:block">
            <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Recent</div>
            {history.length ? history.map((item) => (
              <div className="flex items-center gap-2 px-2 py-2 text-xs capitalize text-slate-500" key={item}>
                <Check size={13} className="text-mint" /> {item}
              </div>
            )) : <div className="px-2 text-xs leading-5 text-slate-600">Your recent runs will appear here.</div>}
          </div>

          <div className="mt-auto hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 lg:block lg:translate-y-24">
            <div className="mb-2 flex items-center gap-2 text-mint"><ShieldCheck size={15} /><span className="text-[11px] font-semibold">100% client-side</span></div>
            <p className="text-[11px] leading-5 text-slate-500">Your JSON never leaves this tab. No account, API key or tracking required.</p>
          </div>
        </aside>

        <section className="min-w-0 px-5 py-7 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-mint"><Sparkles size={14} /> Developer utility / 01</div>
              <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Make messy JSON useful again.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">A focused workspace for cleaning, validating, and shaping JSON without sending sensitive data to a server.</p>
            </div>
            <div className="flex items-center gap-2 self-start xl:self-auto">
              <button className="btn-ghost" onClick={() => setInput(SAMPLE_JSON)} type="button"><FileJson size={15} /> Load sample</button>
              <button className="btn-ghost" onClick={reset} type="button"><RotateCcw size={15} /> Clear</button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500"><Keyboard size={14} /> <span><kbd>⌘</kbd><kbd>↵</kbd> repair <span className="mx-1 text-slate-700">·</span> <kbd>⌘</kbd><kbd>⇧</kbd><kbd>F</kbd> format</span></div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600">Indent</span>
              <div className="relative">
                <select className="h-8 appearance-none rounded-lg border border-white/10 bg-white/[0.04] py-0 pl-3 pr-7 text-xs text-slate-300 outline-none focus:border-mint/50" onChange={(event) => setIndent(event.target.value)} value={indent}>
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="1">1 space</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2" size={13} />
              </div>
            </div>
          </div>

          <div className="workspace-grid grid min-h-[540px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c1118] shadow-[0_22px_70px_rgba(0,0,0,0.28)] xl:grid-cols-2">
            <div className="flex min-h-[500px] min-w-0 flex-col border-b border-white/[0.08] xl:border-b-0 xl:border-r">
              <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-4">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" /><span className="text-xs font-semibold text-slate-300">Input</span><span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-600">JSON</span></div>
                <span className="text-[11px] text-slate-600">{stats.lines} lines · {stats.bytes} bytes</span>
              </div>
              <div className="flex flex-1 overflow-auto">
                <LineNumbers text={input} />
                <textarea aria-label="JSON input" className="min-h-[420px] flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[13px] leading-[1.72rem] text-slate-300 outline-none placeholder:text-slate-700" onChange={(event) => { setInput(event.target.value); setResultState("idle"); setError(null); }} placeholder="Paste your JSON here..." spellCheck={false} value={input} />
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3">
                <span className="flex items-center gap-2 text-[11px] text-slate-600"><Clipboard size={13} /> Paste or type JSON</span>
                <button className="text-[11px] text-slate-500 transition hover:text-mint" onClick={() => navigator.clipboard.readText().then(setInput)} type="button">Paste from clipboard</button>
              </div>
            </div>

            <div className="flex min-h-[500px] min-w-0 flex-col">
              <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-4">
                <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${resultState === "error" ? "bg-rose-400" : resultState === "idle" ? "bg-slate-600" : "bg-mint"}`} /><span className="text-xs font-semibold text-slate-300">Output</span><span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-600">{output ? "READY" : "WAITING"}</span></div>
                <div className="flex items-center gap-1">
                  <button aria-label="Copy output" className="icon-button" onClick={copyOutput} title="Copy output" type="button"><Copy size={15} /></button>
                  <button aria-label="Download JSON" className="icon-button" onClick={downloadOutput} title="Download JSON" type="button"><Download size={15} /></button>
                </div>
              </div>
              <div className="relative flex-1 overflow-auto">
                {output ? <pre className="whitespace-pre-wrap break-words px-5 py-4 font-mono text-[13px] leading-[1.72rem] text-mint/90">{output}</pre> : <div className="absolute inset-0 grid place-items-center px-8 text-center"><div><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-slate-600"><Hash size={21} /></div><p className="text-sm text-slate-500">Your clean JSON will appear here.</p><p className="mt-1 text-xs text-slate-700">Choose an action from the sidebar to begin.</p></div></div>}
              </div>
              <div className="border-t border-white/[0.07] px-4 py-3">
                {error ? <div className="flex items-start gap-2 text-[11px] text-rose-300"><X className="mt-0.5 shrink-0" size={13} /><span><strong className="font-semibold">Line {error.line}, column {error.column}:</strong> {error.message}</span></div> : <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check size={13} className={resultState === "idle" ? "text-slate-700" : "text-mint"} />{resultState === "repaired" ? "Repaired safely with local heuristics" : resultState === "valid" ? "Valid JSON structure" : "Run an action to inspect this input"}</div>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] leading-5 text-slate-600">Repair fixes trailing commas, smart quotes, code fences, and unquoted keys. Always review generated output.</p>
            <button className="btn-primary" onClick={() => run()} type="button"><Play size={15} fill="currentColor" /> Run {action}</button>
          </div>

          <div className="mt-16 grid gap-4 border-t border-white/[0.07] pt-8 sm:grid-cols-3" id="how-it-works">
            <div className="feature-note"><div className="feature-icon"><WandSparkles size={16} /></div><div><h2>Repair gently</h2><p>Only common, reversible cleanup rules are applied.</p></div></div>
            <div className="feature-note"><div className="feature-icon"><ShieldCheck size={16} /></div><div><h2>Stay private</h2><p>All parsing happens inside your browser tab.</p></div></div>
            <div className="feature-note"><div className="feature-icon"><Code2 size={16} /></div><div><h2>Ship clean JSON</h2><p>Copy, download, or use the formatted result anywhere.</p></div></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/[0.07] px-5 py-5 text-center text-[11px] text-slate-600">Built for developers who prefer fewer tabs and cleaner data.</footer>
    </div>
  );
}
