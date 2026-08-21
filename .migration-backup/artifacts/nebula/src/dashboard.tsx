import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  Command,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Moon,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TaskStatus = "todo" | "progress" | "done";
type Task = { id: number; title: string; description: string; priority: "High" | "Medium" | "Low"; status: TaskStatus; due: string };
type Toast = { id: number; message: string };

const initialTasks: Task[] = [
  { id: 1, title: "Map Q3 launch sequence", description: "Turn the launch brief into a clear, sequenced plan for the whole team.", priority: "High", status: "progress", due: "Today" },
  { id: 2, title: "Review product narrative", description: "Tighten the story around focus, flow, and momentum.", priority: "Medium", status: "todo", due: "Tomorrow" },
  { id: 3, title: "Send design handoff", description: "Share the latest interaction notes with the product team.", priority: "Low", status: "done", due: "Yesterday" },
  { id: 4, title: "Prepare weekly signal", description: "Summarize the most important progress from the last seven days.", priority: "Medium", status: "todo", due: "Fri, Aug 21" },
  { id: 5, title: "Run focus retro", description: "Capture what helped the team protect deep work this week.", priority: "High", status: "progress", due: "Fri, Aug 21" },
];

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const activityData = [
  { name: "Mon", tasks: 18, focus: 5.5 },
  { name: "Tue", tasks: 25, focus: 6.8 },
  { name: "Wed", tasks: 21, focus: 6.1 },
  { name: "Thu", tasks: 32, focus: 7.4 },
  { name: "Fri", tasks: 27, focus: 6.9 },
  { name: "Sat", tasks: 14, focus: 4.2 },
  { name: "Sun", tasks: 19, focus: 5.8 },
];

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = (message: string) => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  };
  return { toasts, notify };
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 900, 1);
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{current}{suffix}</>;
}

function Shell({ children, onNewTask }: { children: ReactNode; onNewTask: () => void }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const active = navItems.find((item) => item.href === location)?.href ?? "/dashboard";
  return (
    <div className="min-h-screen bg-[#eef1ec] text-[#26304f]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[248px] border-r border-[#d9e0d9] bg-[#f8f8f3] px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3 pb-9">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)} data-testid="link-sidebar-logo">
            <span className="grid size-8 place-items-center rounded-xl bg-[#26304f] text-[#a6e7d8]"><Sparkles size={16} /></span>
            <span className="font-['Syne'] text-xl font-extrabold tracking-[-.06em]">nebula<span className="text-[#20a99c]">.</span></span>
          </Link>
          <button className="rounded-lg p-2 text-[#798195] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" data-testid="button-close-menu"><X size={18} /></button>
        </div>
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9ba2ae]">Workspace</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.href;
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${selected ? "text-[#26304f]" : "text-[#81899b] hover:bg-[#edf2ed] hover:text-[#26304f]"}`} data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}>
              {selected && <motion.span layoutId="dashboard-nav-pill" className="absolute inset-0 rounded-xl bg-[#dcefe8]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10"><Icon size={17} strokeWidth={selected ? 2.5 : 2} /></span><span className="relative z-10">{item.label}</span>
              {item.label === "Tasks" && <span className="relative z-10 ml-auto rounded-full bg-[#f4c6a4] px-2 py-0.5 text-[10px] text-[#814827]">5</span>}
            </Link>;
          })}
        </nav>
        <div className="absolute inset-x-4 bottom-5">
          <div className="relative">
            <AnimatePresence>
              {profileOpen && <motion.div initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .97 }} className="absolute bottom-16 left-0 right-0 rounded-2xl border border-[#d9e0d9] bg-white p-2 shadow-xl">
                <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-[#eef5f0]" data-testid="link-profile-settings"><Settings size={15} /> Settings</Link>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#b34f53] hover:bg-[#fff1f0]" onClick={() => setProfileOpen(false)} data-testid="button-logout"><LogOut size={15} /> Log out</button>
              </motion.div>}
            </AnimatePresence>
            <button onClick={() => setProfileOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-2xl border border-[#dce2dc] bg-white p-3 text-left" data-testid="button-profile-menu">
              <span className="grid size-9 place-items-center rounded-full bg-[#26304f] text-xs font-bold text-[#b9eddf]">IS</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">Ibrahim Saleem</span><span className="block truncate text-[11px] text-[#9199a9]">Creator workspace</span></span><MoreHorizontal size={17} className="text-[#9ba2ae]" />
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[#17213e]/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" data-testid="button-nav-overlay" />}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center gap-3 border-b border-[#d9e0d9]/80 bg-[#eef1ec]/90 px-4 backdrop-blur-xl sm:px-8">
          <button className="rounded-xl border border-[#d9e0d9] bg-white p-2.5 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu" data-testid="button-open-menu"><Menu size={19} /></button>
          <div className="relative max-w-[330px] flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa1ad]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-[#d9e0d9] bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[#a2a9b4] focus:border-[#48b8a9]" placeholder="Search your workspace..." aria-label="Search workspace" data-testid="input-search-workspace" />
            {search && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8c94a5]">Filtering</span>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-xl p-2.5 text-[#687186] hover:bg-white" aria-label="Open notifications" data-testid="button-notifications"><Bell size={19} /> <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#e98076] ring-2 ring-[#eef1ec]" /></button>
              <AnimatePresence>{notificationsOpen && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 w-80 rounded-2xl border border-[#d9e0d9] bg-white p-3 shadow-xl"><p className="px-2 pb-2 text-xs font-bold">Notifications <span className="float-right rounded-full bg-[#dcefe8] px-2 py-0.5 text-[10px] text-[#28796e]">3 new</span></p>{["Maya commented on your launch brief", "Your weekly signal is ready", "You have 2 tasks due today"].map((note, index) => <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .08 }} key={note} className="flex gap-2 rounded-xl p-2.5 text-xs hover:bg-[#f2f6f2]"><span className="mt-1 size-2 shrink-0 rounded-full bg-[#48b8a9]" /><span>{note}<span className="mt-1 block text-[10px] text-[#9aa1ad]">{index + 1}h ago</span></span></motion.div>)}</motion.div>}</AnimatePresence>
            </div>
            <button onClick={onNewTask} className="hidden items-center gap-2 rounded-xl bg-[#26304f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 sm:flex" data-testid="button-quick-new-task"><Plus size={16} /> New task</button>
          </div>
        </header>
        <main className="min-h-[calc(100vh-76px)] px-4 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#22a394]">{eyebrow}</p><h1 className="font-['Syne'] text-3xl font-extrabold tracking-[-.06em] text-[#26304f] sm:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#80899a]">{description}</p></div>{action}</div>;
}

function StatCard({ label, value, suffix, icon: Icon, note, accent }: { label: string; value: number; suffix?: string; icon: typeof Activity; note: string; accent: string }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#dce3dc] bg-white p-5 shadow-[0_8px_30px_rgba(38,48,79,.04)]"><div className="flex items-start justify-between"><span className="text-xs font-semibold text-[#7d8697]">{label}</span><span className={`grid size-9 place-items-center rounded-xl ${accent}`}><Icon size={17} /></span></div><p className="mt-5 font-['Syne'] text-3xl font-extrabold tracking-[-.07em]"><AnimatedNumber value={value} suffix={suffix} /></p><p className="mt-1 text-[11px] text-[#8892a2]">{note}</p></motion.div>;
}

function DashboardHome() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setLoaded(true), 450); return () => window.clearTimeout(timer); }, []);
  if (!loaded) return <div className="space-y-6"><div className="h-28 animate-pulse rounded-3xl bg-white/70" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-white/70" />)}</div><div className="h-80 animate-pulse rounded-2xl bg-white/70" /></div>;
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PageHeader eyebrow="Thursday, August 20" title="Good morning, Ibrahim." description="Here's the shape of your work today. Protect the signal, let the noise wait." action={<button className="flex items-center gap-2 rounded-xl border border-[#cfdad1] bg-white px-4 py-2.5 text-xs font-bold text-[#26304f]" data-testid="button-focus-mode"><Command size={15} /> Start focus mode</button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Tasks completed" value={28} icon={CheckCircle2} note="+18% from last week" accent="bg-[#dcefe8] text-[#248a7d]" /><StatCard label="In progress" value={7} icon={Clock3} note="2 due today" accent="bg-[#fce5d1] text-[#b96c38]" /><StatCard label="Team members" value={12} icon={Users} note="4 active right now" accent="bg-[#e4e4f4] text-[#625caa]" /><StatCard label="Productivity score" value={86} suffix="%" icon={TrendingUp} note="+6 points this week" accent="bg-[#f5e6c4] text-[#a47a21]" /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="font-['Syne'] text-lg font-bold">Weekly activity</h2><p className="mt-1 text-xs text-[#8992a2]">Small steps, compounding momentum.</p></div><span className="rounded-full bg-[#eaf5ef] px-3 py-1.5 text-[10px] font-bold text-[#28796e]">This week</span></div><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={activityData} barGap={8}><CartesianGrid vertical={false} stroke="#edf0eb" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#99a1ae", fontSize: 11 }} /><YAxis hide /><Tooltip cursor={{ fill: "#f2f6f2" }} contentStyle={{ borderRadius: 12, border: "1px solid #dce3dc", fontSize: 11 }} /><Bar dataKey="tasks" fill="#6bc7b7" radius={[5, 5, 0, 0]} animationDuration={900} /><Line type="monotone" dataKey="focus" stroke="#26304f" strokeWidth={2} dot={{ fill: "#26304f", r: 3 }} animationDuration={1100} /></BarChart></ResponsiveContainer></div></section><section className="rounded-2xl border border-[#dce3dc] bg-[#26304f] p-5 text-[#f8f8f3] sm:p-6"><div className="flex items-center gap-2 text-[#a6e7d8]"><Sparkles size={16} /><span className="text-[10px] font-bold uppercase tracking-[.18em]">Recent activity</span></div><div className="mt-6 space-y-5">{["You completed “Send design handoff”", "Maya joined the Launch project", "Your productivity score rose 6 points", "Weekly signal generated"].map((item, index) => <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .1 }} key={item} className="flex gap-3 border-b border-white/10 pb-4 last:border-0"><span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#a6e7d8]"><Check size={13} /></span><span className="text-sm leading-5 text-[#dce4e1]">{item}<span className="block text-[10px] text-[#8995a7]">{index + 1}h ago</span></span></motion.div>)}</div></section></div></motion.div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#17213e]/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .96 }} className="w-full max-w-lg rounded-3xl bg-[#f8f8f3] p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="font-['Syne'] text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-xl p-2 text-[#8992a2] hover:bg-[#eaf0eb]" aria-label="Close dialog" data-testid="button-close-dialog"><X size={18} /></button></div>{children}</motion.div></motion.div>;
}

function TasksPage({ notify }: { notify: (message: string) => void }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [modal, setModal] = useState<"add" | "detail" | null>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [dragged, setDragged] = useState<number | null>(null);
  const columns: { id: TaskStatus; label: string; color: string }[] = [{ id: "todo", label: "To do", color: "bg-[#f1e8d3]" }, { id: "progress", label: "In progress", color: "bg-[#dcefe8]" }, { id: "done", label: "Done", color: "bg-[#e7e5f3]" }];
  const addTask = () => { if (!newTitle.trim()) return; setTasks((items) => [...items, { id: Date.now(), title: newTitle.trim(), description: "A new piece of work waiting for its first clear next step.", priority: "Medium", status: "todo", due: "Next up" }]); setNewTitle(""); setModal(null); notify("Task added to your workspace"); };
  const moveTask = (status: TaskStatus) => { if (dragged === null) return; setTasks((items) => items.map((task) => task.id === dragged ? { ...task, status } : task)); setDragged(null); notify("Task moved"); };
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><PageHeader eyebrow="Work in motion" title="Tasks" description="Keep the next clear action visible. Everything else can wait." action={<button onClick={() => setModal("add")} className="flex items-center gap-2 rounded-xl bg-[#26304f] px-4 py-2.5 text-xs font-bold text-white" data-testid="button-add-task"><Plus size={16} /> Add task</button>} /><div className="grid gap-5 md:grid-cols-3">{columns.map((column) => <section key={column.id} className="min-h-[400px] rounded-2xl border border-[#dce3dc] bg-white/65 p-3" onDragOver={(event) => event.preventDefault()} onDrop={() => moveTask(column.id)} data-testid={`column-${column.id}`}><div className="mb-3 flex items-center justify-between px-2 py-1"><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${column.color}`} /><h2 className="text-sm font-bold">{column.label}</h2><span className="text-xs text-[#9aa1ad]">{tasks.filter((task) => task.status === column.id).length}</span></div><button className="rounded-lg p-1.5 text-[#9aa1ad] hover:bg-[#edf2ed]" onClick={() => setModal("add")} aria-label={`Add task to ${column.label}`} data-testid={`button-add-${column.id}`}><Plus size={15} /></button></div><div className="space-y-3">{tasks.filter((task) => task.status === column.id).map((task) => <motion.article layout key={task.id} draggable onDragStart={() => setDragged(task.id)} onClick={() => { setSelected(task); setModal("detail"); }} className="cursor-grab rounded-2xl border border-[#e0e6df] bg-white p-4 shadow-[0_5px_20px_rgba(38,48,79,.035)] transition hover:-translate-y-1 hover:shadow-lg active:cursor-grabbing" data-testid={`card-task-${task.id}`}><div className="mb-3 flex items-center justify-between"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${task.priority === "High" ? "bg-[#fbe0d8] text-[#ad5548]" : task.priority === "Medium" ? "bg-[#f6e9c9] text-[#9c7422]" : "bg-[#e6f0e9] text-[#39836f]"}`}>{task.priority}</span><span className="text-[10px] text-[#9aa1ad]">{task.due}</span></div><h3 className="text-sm font-bold leading-5">{task.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8992a2]">{task.description}</p><div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-1 text-[10px] text-[#9aa1ad]"><Circle size={10} /> Ibrahim</span><MoreHorizontal size={15} className="text-[#adb4bf]" /></div></motion.article>)}</div>{tasks.filter((task) => task.status === column.id).length === 0 && <div className="grid min-h-[180px] place-items-center rounded-xl border border-dashed border-[#dce3dc] text-center"><div><ClipboardList size={22} className="mx-auto text-[#b5c0b6]" /><p className="mt-2 text-xs text-[#9aa1ad]">Nothing here yet</p></div></div>}</section>)}</div><AnimatePresence>{modal === "add" && <Modal title="Add a new task" onClose={() => setModal(null)}><label className="block text-xs font-bold text-[#6d7689]" htmlFor="new-task-title">What needs your attention?</label><input id="new-task-title" autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addTask(); }} placeholder="e.g. Shape the next release" className="mt-2 w-full rounded-xl border border-[#d5ded6] bg-white px-4 py-3 text-sm outline-none focus:border-[#48b8a9]" data-testid="input-new-task-title" /><button onClick={addTask} className="mt-5 w-full rounded-xl bg-[#26304f] py-3 text-sm font-bold text-white" data-testid="button-save-task">Add task</button></Modal>}{modal === "detail" && selected && <Modal title={selected.title} onClose={() => setModal(null)}><p className="text-sm leading-6 text-[#7d8798]">{selected.description}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#edf3ee] p-3"><p className="text-[10px] uppercase tracking-wider text-[#8e98a7]">Priority</p><p className="mt-1 text-sm font-bold">{selected.priority}</p></div><div className="rounded-xl bg-[#edf3ee] p-3"><p className="text-[10px] uppercase tracking-wider text-[#8e98a7]">Due</p><p className="mt-1 text-sm font-bold">{selected.due}</p></div></div><button onClick={() => { setTasks((items) => items.filter((task) => task.id !== selected.id)); setModal(null); notify("Task deleted"); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#f2c6c0] py-3 text-sm font-bold text-[#b34f53]" data-testid="button-delete-task"><Trash2 size={15} /> Delete task</button></Modal>}</AnimatePresence></motion.div>;
}

function ChatPage({ notify }: { notify: (message: string) => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([{ role: "ai", text: "Good morning, Ibrahim. I’ve got the shape of your week. What would make today feel meaningfully lighter?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const send = () => { const text = input.trim(); if (!text || typing) return; setMessages((items) => [...items, { role: "user", text }]); setInput(""); setTyping(true); window.setTimeout(() => { const response = text.toLowerCase().includes("plan") ? "Let’s make it concrete: choose one outcome, define the smallest next action, then protect a 45-minute window for it." : text.toLowerCase().includes("task") ? "I’d start with the task that unlocks someone else. Momentum is often a dependency problem in disguise." : "I’m holding that thought with you. Try naming the one thing you want to be true by the end of the day."; setMessages((items) => [...items, { role: "ai", text: response }]); setTyping(false); notify("Nebula replied"); }, 1100); };
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl"><PageHeader eyebrow="Think out loud" title="AI Chat" description="A quiet room for turning a tangle of thoughts into the next right move." /><div className="flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-[#dce3dc] bg-white"><div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">{messages.map((message, index) => <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`${message.text}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`} data-testid={`message-${message.role}-${index}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-sm bg-[#26304f] text-white" : "rounded-bl-sm bg-[#edf4ee] text-[#44506b]"}`}>{message.text}</div></motion.div>)}{typing && <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#edf4ee] px-4 py-4"><span className="size-1.5 animate-bounce rounded-full bg-[#78a79c]" /><span className="size-1.5 animate-bounce rounded-full bg-[#78a79c] [animation-delay:100ms]" /><span className="size-1.5 animate-bounce rounded-full bg-[#78a79c] [animation-delay:200ms]" /></div>}</div><div className="border-t border-[#e3e8e2] p-4"><div className="flex items-center gap-2 rounded-2xl border border-[#d5ded6] bg-[#fafbf8] p-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Ask Nebula anything..." aria-label="Chat message" data-testid="input-chat-message" /><button onClick={send} className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#26304f] text-white transition hover:scale-105" aria-label="Send message" data-testid="button-send-message"><Send size={16} /></button></div></div></div></motion.div>;
}

function CalendarPage({ notify }: { notify: (message: string) => void }) {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [events, setEvents] = useState<Record<string, string[]>>({ "2026-08-20": ["Focus block", "Launch sync"], "2026-08-24": ["Team retro"], "2026-08-28": ["Signal review"] });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const days = useMemo(() => { const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); return [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]; }, [month]);
  const saveEvent = () => { if (!selectedDay || !eventName.trim()) return; setEvents((current) => ({ ...current, [selectedDay]: [...(current[selectedDay] ?? []), eventName.trim()] })); setEventName(""); setSelectedDay(null); notify("Event added to your calendar"); };
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><PageHeader eyebrow="Make room for what matters" title="Calendar" description="See your commitments with enough space to make good choices." action={<div className="flex items-center gap-1 rounded-xl border border-[#d9e0d9] bg-white p-1"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg p-2 hover:bg-[#edf2ed]" aria-label="Previous month" data-testid="button-previous-month"><ChevronLeft size={17} /></button><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg p-2 hover:bg-[#edf2ed]" aria-label="Next month" data-testid="button-next-month"><ChevronRight size={17} /></button></div>} /><section className="rounded-3xl border border-[#dce3dc] bg-white p-4 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="font-['Syne'] text-xl font-bold">{month.toLocaleString("en-US", { month: "long" })} <span className="text-[#8d96a6]">{month.getFullYear()}</span></h2><span className="text-xs text-[#9aa1ad]">Click a date to add an event</span></div><div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-[#9da5b1] sm:gap-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day} className="pb-2">{day}</span>)}{days.map((day, index) => { const key = day ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : `empty-${index}`; const dayEvents = day ? events[key] ?? [] : []; return <button key={key} disabled={!day} onClick={() => day && setSelectedDay(key)} className={`min-h-[86px] rounded-xl border p-2 text-left align-top transition sm:min-h-[115px] ${day ? "border-[#e6ebe5] hover:border-[#63bcae] hover:bg-[#f5faf5]" : "border-transparent"} ${key === "2026-08-20" ? "bg-[#eaf5ef]" : "bg-[#fcfcf9]"}`} data-testid={day ? `calendar-day-${key}` : undefined}><span className={`text-xs font-bold ${key === "2026-08-20" ? "grid size-6 place-items-center rounded-full bg-[#26304f] text-white" : "text-[#647087]"}`}>{day}</span><span className="mt-2 block space-y-1">{dayEvents.map((event) => <span key={event} className="block truncate rounded-md bg-[#dcefe8] px-1.5 py-1 text-[9px] font-bold text-[#397c70]">{event}</span>)}</span></button>; })}</div></section><AnimatePresence>{selectedDay && <Modal title="Add an event" onClose={() => setSelectedDay(null)}><p className="text-xs text-[#8d96a6]">{selectedDay}</p><input autoFocus value={eventName} onChange={(event) => setEventName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveEvent(); }} className="mt-3 w-full rounded-xl border border-[#d5ded6] bg-white px-4 py-3 text-sm outline-none focus:border-[#48b8a9]" placeholder="Event title" aria-label="Event title" data-testid="input-event-title" /><button onClick={saveEvent} className="mt-5 w-full rounded-xl bg-[#26304f] py-3 text-sm font-bold text-white" data-testid="button-save-event">Save event</button></Modal>}</AnimatePresence></motion.div>;
}

function TeamPage({ notify }: { notify: (message: string) => void }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const members = [{ name: "Ibrahim Saleem", role: "Workspace lead", initials: "IS", status: "online" }, { name: "Maya Chen", role: "Product design", initials: "MC", status: "online" }, { name: "Owen Brooks", role: "Engineering", initials: "OB", status: "offline" }, { name: "Sana Malik", role: "Research", initials: "SM", status: "online" }, { name: "Leo Hart", role: "Marketing", initials: "LH", status: "online" }, { name: "Nora Evans", role: "Operations", initials: "NE", status: "offline" }];
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><PageHeader eyebrow="People with context" title="Team" description="A small group moving with the same signal." action={<button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#26304f] px-4 py-2.5 text-xs font-bold text-white" data-testid="button-invite-member"><UserPlus size={16} /> Invite member</button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{members.map((member, index) => <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} key={member.name} className="rounded-2xl border border-[#dce3dc] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg" data-testid={`card-member-${index}`}><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#e4e4f4] font-['Syne'] font-bold text-[#625caa]">{member.initials}</span><span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${member.status === "online" ? "text-[#43937e]" : "text-[#a1a8b4]"}`}><span className={`size-2 rounded-full ${member.status === "online" ? "bg-[#53b994]" : "bg-[#cbd0d1]"}`} />{member.status}</span></div><h2 className="mt-5 font-bold">{member.name}</h2><p className="mt-1 text-xs text-[#8b94a3]">{member.role}</p><div className="mt-5 flex items-center gap-2 border-t border-[#edf0eb] pt-4 text-[11px] text-[#8b94a3]"><Activity size={14} /> Active this week</div></motion.article>)}</div><AnimatePresence>{inviteOpen && <Modal title="Invite a teammate" onClose={() => setInviteOpen(false)}><label className="text-xs font-bold text-[#6d7689]" htmlFor="invite-email">Email address</label><input id="invite-email" autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5ded6] bg-white px-4 py-3 text-sm outline-none focus:border-[#48b8a9]" placeholder="teammate@company.com" data-testid="input-invite-email" /><button onClick={() => { if (!email.includes("@")) return; setEmail(""); setInviteOpen(false); notify("Invitation ready to send"); }} className="mt-5 w-full rounded-xl bg-[#26304f] py-3 text-sm font-bold text-white" data-testid="button-send-invite">Send invite</button></Modal>}</AnimatePresence></motion.div>;
}

function AnalyticsPage() {
  const [range, setRange] = useState<"Week" | "Month" | "Year">("Week");
  const datasets = { Week: [{ name: "Mon", completed: 18, focus: 6 }, { name: "Tue", completed: 25, focus: 7 }, { name: "Wed", completed: 21, focus: 6 }, { name: "Thu", completed: 32, focus: 8 }, { name: "Fri", completed: 27, focus: 7 }], Month: [{ name: "W1", completed: 82, focus: 31 }, { name: "W2", completed: 96, focus: 34 }, { name: "W3", completed: 118, focus: 42 }, { name: "W4", completed: 104, focus: 39 }], Year: [{ name: "Q1", completed: 280, focus: 110 }, { name: "Q2", completed: 340, focus: 136 }, { name: "Q3", completed: 418, focus: 162 }, { name: "Q4", completed: 391, focus: 148 }] };
  const data = datasets[range];
  const donut = [{ name: "Deep work", value: 58, color: "#61c3b1" }, { name: "Meetings", value: 24, color: "#f0bf8e" }, { name: "Admin", value: 18, color: "#a9a8d3" }];
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><PageHeader eyebrow="See the pattern" title="Analytics" description="A wider view of how your time is becoming momentum." action={<div className="flex rounded-xl border border-[#d9e0d9] bg-white p-1">{(["Week", "Month", "Year"] as const).map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${range === item ? "bg-[#26304f] text-white" : "text-[#858e9f]"}`} data-testid={`button-range-${item.toLowerCase()}`}>{item}</button>)}</div>} /><div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-6"><h2 className="font-['Syne'] text-lg font-bold">Output over time</h2><p className="mt-1 text-xs text-[#8992a2]">Completed tasks and protected focus hours.</p><div className="mt-5 h-[275px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid vertical={false} stroke="#edf0eb" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#99a1ae", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#99a1ae", fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce3dc", fontSize: 11 }} /><Line type="monotone" dataKey="completed" stroke="#26304f" strokeWidth={3} dot={{ fill: "#26304f", r: 4 }} animationDuration={700} /><Line type="monotone" dataKey="focus" stroke="#61c3b1" strokeWidth={3} dot={{ fill: "#61c3b1", r: 4 }} animationDuration={900} /></LineChart></ResponsiveContainer></div></section><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-6"><h2 className="font-['Syne'] text-lg font-bold">Time shape</h2><p className="mt-1 text-xs text-[#8992a2]">Where your week is actually going.</p><div className="mt-4 h-[220px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donut} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={4} animationDuration={900}>{donut.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="space-y-2">{donut.map((entry) => <div key={entry.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />{entry.name}</span><span className="font-bold">{entry.value}%</span></div>)}</div></section></div><section className="mt-5 rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-['Syne'] text-lg font-bold">Daily completion</h2><p className="mt-1 text-xs text-[#8992a2]">A simple view of your delivery rhythm.</p></div><TrendingUp size={19} className="text-[#3ba890]" /></div><div className="mt-5 h-[190px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid vertical={false} stroke="#edf0eb" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#99a1ae", fontSize: 11 }} /><YAxis hide /><Bar dataKey="completed" fill="#a9a8d3" radius={[6, 6, 0, 0]} animationDuration={800} /></BarChart></ResponsiveContainer></div></section></motion.div>;
}

function SettingsPage({ notify }: { notify: (message: string) => void }) {
  const [name, setName] = useState("Ibrahim Saleem");
  const [email, setEmail] = useState("ibrahim@nebula.so");
  const [dark, setDark] = useState(false);
  const [prefs, setPrefs] = useState({ activity: true, digest: true, mentions: false });
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); return () => document.documentElement.classList.remove("dark"); }, [dark]);
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl"><PageHeader eyebrow="Make it yours" title="Settings" description="A few thoughtful defaults, tuned to the way you work." /><div className="space-y-5"><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e4e4f4] text-[#625caa]"><UserPlus size={18} /></span><div><h2 className="font-['Syne'] text-lg font-bold">Profile</h2><p className="text-xs text-[#8992a2]">How your team sees you.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-[#6d7689]">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5ded6] bg-[#fafbf8] px-4 py-3 text-sm font-normal outline-none focus:border-[#48b8a9]" data-testid="input-profile-name" /></label><label className="text-xs font-bold text-[#6d7689]">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5ded6] bg-[#fafbf8] px-4 py-3 text-sm font-normal outline-none focus:border-[#48b8a9]" data-testid="input-profile-email" /></label></div><button onClick={() => notify("Profile settings saved")} className="mt-5 rounded-xl bg-[#26304f] px-5 py-3 text-xs font-bold text-white" data-testid="button-save-profile">Save profile</button></section><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-['Syne'] text-lg font-bold">Appearance</h2><p className="mt-1 text-xs text-[#8992a2]">Choose the atmosphere that helps you focus.</p></div><button onClick={() => setDark((value) => !value)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${dark ? "bg-[#26304f] text-white" : "bg-[#eef3ee] text-[#536078]"}`} data-testid="button-theme-toggle">{dark ? <Moon size={15} /> : <Sun size={15} />} {dark ? "Dark mode" : "Light mode"}</button></div></section><section className="rounded-2xl border border-[#dce3dc] bg-white p-5 sm:p-7"><div className="mb-5"><h2 className="font-['Syne'] text-lg font-bold">Notifications</h2><p className="mt-1 text-xs text-[#8992a2]">Only receive the signals you actually need.</p></div>{[["activity", "Activity updates", "When work moves or someone joins a project"], ["digest", "Weekly signal", "A calm summary every Friday"], ["mentions", "Mentions", "When someone tags you directly"]].map(([key, label, description]) => <div key={key} className="flex items-center justify-between border-t border-[#edf0eb] py-4"><div><p className="text-sm font-bold">{label}</p><p className="mt-1 text-xs text-[#8992a2]">{description}</p></div><button onClick={() => setPrefs((current) => ({ ...current, [key]: !current[key as keyof typeof current] }))} className={`relative h-6 w-11 rounded-full transition ${prefs[key as keyof typeof prefs] ? "bg-[#53b994]" : "bg-[#d5dcd5]"}`} aria-label={`Toggle ${label}`} data-testid={`toggle-${key}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${prefs[key as keyof typeof prefs] ? "left-6" : "left-1"}`} /></button></div>)}</section></div></motion.div>;
}

export default function DashboardApp() {
  const [location] = useLocation();
  const { toasts, notify } = useToasts();
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const page = location.replace("/dashboard", "") || "/";
  const content = page === "/" ? <DashboardHome /> : page === "/tasks" ? <TasksPage notify={notify} /> : page === "/chat" ? <ChatPage notify={notify} /> : page === "/calendar" ? <CalendarPage notify={notify} /> : page === "/team" ? <TeamPage notify={notify} /> : page === "/analytics" ? <AnalyticsPage /> : page === "/settings" ? <SettingsPage notify={notify} /> : <DashboardHome />;
  return <Shell onNewTask={() => setNewTaskOpen(true)}>{content}<AnimatePresence>{newTaskOpen && <QuickTaskModal onClose={() => setNewTaskOpen(false)} notify={notify} />}</AnimatePresence><div className="fixed bottom-5 right-5 z-[60] space-y-2" aria-live="polite">{toasts.map((toast) => <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key={toast.id} className="flex items-center gap-2 rounded-xl bg-[#26304f] px-4 py-3 text-xs font-bold text-white shadow-xl" data-testid={`toast-${toast.id}`}><CheckCircle2 size={15} className="text-[#a6e7d8]" />{toast.message}</motion.div>)}</div></Shell>;
}

function QuickTaskModal({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  const [title, setTitle] = useState("");
  return <Modal title="Quick add" onClose={onClose}><p className="text-sm text-[#8992a2]">Create a task and keep the momentum moving.</p><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && title.trim()) { notify("Task added to your workspace"); onClose(); } }} className="mt-4 w-full rounded-xl border border-[#d5ded6] bg-white px-4 py-3 text-sm outline-none focus:border-[#48b8a9]" placeholder="Name the next clear action" aria-label="Quick task title" data-testid="input-quick-task" /><button onClick={() => { if (title.trim()) { notify("Task added to your workspace"); onClose(); } }} className="mt-5 w-full rounded-xl bg-[#26304f] py-3 text-sm font-bold text-white" data-testid="button-save-quick-task">Add task</button></Modal>;
}