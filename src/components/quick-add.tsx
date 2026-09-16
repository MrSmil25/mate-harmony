import { FileText, ListTodo, NotebookPen, Plus, Timer, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type QuickTask = { title: string; course: string; due: string };
export type QuickNote = { title: string; course: string; body: string };
export type QuickResource = { title: string; course: string; type: string };
export type QuickSession = { day: string; date: string; time: string; duration: string; topic: string };

type Kind = "Task" | "Note" | "Resource" | "Study session";

const kinds: { id: Kind; icon: typeof ListTodo }[] = [
  { id: "Task", icon: ListTodo },
  { id: "Note", icon: NotebookPen },
  { id: "Resource", icon: FileText },
  { id: "Study session", icon: Timer },
];

const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function QuickAdd({
  courses, onAddTask, onAddNote, onAddResource, onAddSession,
}: {
  courses: string[];
  onAddTask: (task: QuickTask) => void;
  onAddNote: (note: QuickNote) => void;
  onAddResource: (resource: QuickResource) => void;
  onAddSession: (session: QuickSession) => void;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("Task");
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(courses[0] ?? "");
  const [due, setDue] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("Books");
  const [day, setDay] = useState("Mon");
  const [time, setTime] = useState("19:00");
  const [duration, setDuration] = useState("90 min");
  const [message, setMessage] = useState("");

  const reset = () => { setTitle(""); setDue(""); setBody(""); };

  const submit = () => {
    const value = title.trim();
    if (!value) return;
    if (kind === "Task") onAddTask({ title: value, course, due: due.trim() || "This week" });
    if (kind === "Note") onAddNote({ title: value, course, body: body.trim() });
    if (kind === "Resource") onAddResource({ title: value, course, type });
    if (kind === "Study session") onAddSession({ day, date: due.trim() || day, time, duration, topic: value });
    setMessage(`${kind} added to your workspace.`);
    reset();
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick add"
        className="fixed bottom-24 right-4 z-40 grid size-14 place-items-center rounded-full bg-academic text-academic-foreground shadow-lg transition-transform hover:-translate-y-0.5 md:bottom-8 md:right-8"
      >
        <Plus className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-academic/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl" onClick={event => event.stopPropagation()}>
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-bold">Quick add</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Create anything without leaving this page.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close quick add" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
            </header>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-4 gap-2">
                {kinds.map(({ id, icon: Icon }) => (
                  <button key={id} onClick={() => setKind(id)} className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-[11px] font-semibold transition-colors ${kind === id ? "border-academic bg-accent text-academic" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    <Icon className="size-4" />
                    <span className="w-full truncate">{id}</span>
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">{kind === "Study session" ? "Topic" : "Title"}</span>
                <Input value={title} onChange={event => setTitle(event.target.value)} placeholder={kind === "Study session" ? "Cost behavior recap" : `New ${kind.toLowerCase()}`} className="mt-1.5" />
              </label>

              {kind !== "Study session" && (
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground">Course</span>
                  <select value={course} onChange={event => setCourse(event.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    {courses.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              )}

              {kind === "Task" && (
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground">Due</span>
                  <Input value={due} onChange={event => setDue(event.target.value)} placeholder="24 Sep" className="mt-1.5" />
                </label>
              )}

              {kind === "Note" && (
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground">Note</span>
                  <Textarea value={body} onChange={event => setBody(event.target.value)} rows={3} placeholder="Key points from the session…" className="mt-1.5" />
                </label>
              )}

              {kind === "Resource" && (
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground">Resource type</span>
                  <select value={type} onChange={event => setType(event.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
                    {["Books", "Lecture Slides", "Practice Questions", "Articles", "External References"].map(item => <option key={item}>{item}</option>)}
                  </select>
                </label>
              )}

              {kind === "Study session" && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Day</span>
                    <select value={day} onChange={event => setDay(event.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm">
                      {dayKeys.map(item => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Date</span>
                    <Input value={due} onChange={event => setDue(event.target.value)} placeholder="2 Oct" className="mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Time</span>
                    <Input value={time} onChange={event => setTime(event.target.value)} className="mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-muted-foreground">Duration</span>
                    <Input value={duration} onChange={event => setDuration(event.target.value)} className="mt-1.5" />
                  </label>
                </div>
              )}

              {message && <p className="rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">{message}</p>}

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
                <Button variant="academic" onClick={submit}><Plus /> Add {kind.toLowerCase()}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
