'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Target,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'

type Status = 'Not started' | 'In progress' | 'Completed'
type Priority = 'Low' | 'Medium' | 'High' | 'Urgent'
type Assignment = { id: number; title: string; subject: string; due: string; priority: Priority; status: Status; color: string }

const seed: Assignment[] = [
  { id: 1, title: 'Implement binary search algorithm', subject: 'Data Structures', due: '2026-10-16', priority: 'High', status: 'In progress', color: '#6478f5' },
  { id: 2, title: 'Machine learning lab report', subject: 'Machine Learning', due: '2026-10-18', priority: 'Medium', status: 'Not started', color: '#edaa4b' },
  { id: 3, title: 'Design database schema', subject: 'Database Systems', due: '2026-10-20', priority: 'Urgent', status: 'Not started', color: '#dc6b67' },
  { id: 4, title: 'Responsive React application', subject: 'Web Development', due: '2026-10-22', priority: 'High', status: 'In progress', color: '#51a883' },
  { id: 5, title: 'Software engineering case study', subject: 'Software Engineering', due: '2026-10-12', priority: 'Low', status: 'Completed', color: '#8b72c7' },
  { id: 6, title: 'Operating systems quiz prep', subject: 'Computer Science', due: '2026-10-25', priority: 'Medium', status: 'Not started', color: '#52a7ae' },
]

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'All Assignments', icon: ClipboardList }, { label: 'My Tasks', icon: Target },
  { label: 'Calendar', icon: CalendarDays }, { label: 'Subjects', icon: BookOpen }, { label: 'Analytics', icon: BarChart3 },
]
const fmt = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const daysUntil = (date: string) => Math.ceil((new Date(`${date}T12:00:00`).getTime() - new Date('2026-10-14T12:00:00').getTime()) / 86400000)

export default function Page() {
  const [assignments, setAssignments] = useState<Assignment[]>(seed)
  useEffect(() => {
    const saved = window.localStorage.getItem('assignment-tracker-items')
    if (saved) setAssignments(JSON.parse(saved))
  }, [])
  useEffect(() => {
    window.localStorage.setItem('assignment-tracker-items', JSON.stringify(assignments))
  }, [assignments])
  const [active, setActive] = useState('Dashboard')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newDue, setNewDue] = useState('2026-10-28')
  const [newPriority, setNewPriority] = useState<Priority>('Medium')

  const pending = assignments.filter(a => a.status !== 'Completed')
  const completed = assignments.filter(a => a.status === 'Completed')
  const dueSoon = pending.filter(a => daysUntil(a.due) >= 0 && daysUntil(a.due) <= 7)
  const visible = useMemo(() => assignments.filter(a => (filter === 'All' || a.status === filter || (filter === 'Due soon' && dueSoon.some(d => d.id === a.id))) && `${a.title} ${a.subject}`.toLowerCase().includes(query.toLowerCase())), [assignments, filter, query, dueSoon])

  function addAssignment() {
    if (!newTitle.trim() || !newSubject.trim()) return
    setAssignments(prev => [...prev, { id: Date.now(), title: newTitle, subject: newSubject, due: newDue, priority: newPriority, status: 'Not started', color: '#6478f5' }])
    setNewTitle(''); setNewSubject(''); setShowForm(false)
  }
  function toggleComplete(id: number) { setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Completed' ? 'Not started' : 'Completed' } : a)) }
  function deleteAssignment(id: number) { setAssignments(prev => prev.filter(a => a.id !== id)) }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><ClipboardList /></div><span>Assignment<br /><strong>Tracker</strong></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X /></button></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{nav.map(item => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => { setActive(item.label); setMobileNav(false) }}><Icon />{item.label}{item.label === 'My Tasks' && <span className="nav-count">{pending.length}</span>}</button> })}</nav>
        <div className="sidebar-bottom"><button className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => setActive('Settings')}><Settings />Settings</button><button className="profile" onClick={() => setShowProfile(true)} aria-label="Open Jordan Davis profile"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><span>Computer Science</span></div><MoreHorizontal /></button></div>
      </aside>
      {mobileNav && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <main className="main-area">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu /></button><div className="crumb"><span>Workspace</span><ChevronDown /></div><div className="top-actions"><div className="top-search"><Search /><input aria-label="Search assignments" placeholder="Search assignments..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div><button className="icon-button notification" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell />{pending.length > 0 && <i />}</button><div className="top-date"><span>Tuesday</span><strong>October 14, 2026</strong></div><button className="avatar avatar-sm" onClick={() => setShowProfile(true)} aria-label="Open Jordan Davis profile">JD</button></div>{showNotifications && <div className="notification-pop"><strong>Notifications</strong><p><AlertCircle />{dueSoon.length} assignments due this week</p><p><Clock3 />Next deadline: {fmt(dueSoon[0]?.due || '2026-10-18')}</p></div>}</header>
        <div className="content">
          <section className="welcome"><div><div className="eyebrow">TUESDAY, OCTOBER 14, 2026</div><h1>Good morning, Jordan <span>✦</span></h1><p>Here&apos;s your academic progress at a glance.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus /> New assignment</button></section>
          <div className="stats-grid"><Stat icon={<ClipboardList />} label="Total assignments" value={assignments.length} note="Across all subjects" tone="indigo" /><Stat icon={<Clock3 />} label="Pending tasks" value={pending.length} note="Need your attention" tone="amber" /><Stat icon={<CalendarDays />} label="Due this week" value={dueSoon.length} note="Next 7 days" tone="red" /><Stat icon={<CheckCircle2 />} label="Completed" value={completed.length} note={`${Math.round(completed.length / assignments.length * 100)}% completion rate`} tone="green" progress={completed.length / assignments.length * 100} /></div>
          {active === 'Dashboard' ? <Dashboard assignments={visible} completed={completed.length} pending={pending.length} dueSoon={dueSoon} filter={filter} setFilter={setFilter} setActive={setActive} toggleComplete={toggleComplete} deleteAssignment={deleteAssignment} /> : <PageView active={active} assignments={assignments} setActive={setActive} setShowForm={setShowForm} toggleComplete={toggleComplete} />}
        </div>
      </main>
      {showProfile && <Modal title="Jordan Davis" onClose={() => setShowProfile(false)}><div className="profile-bio"><div className="avatar avatar-large">JD</div><div><h3>Computer Science student</h3><p>Focused on building strong foundations in software engineering, data structures, and machine learning.</p></div></div><div className="profile-details"><div><span>Email</span><strong>jordan.davis@university.edu</strong></div><div><span>Semester</span><strong>Fall 2026</strong></div><div><span>Progress</span><strong>{completed.length} of {assignments.length} assignments completed</strong></div></div><div className="modal-actions"><button className="secondary-button" onClick={() => setShowProfile(false)}>Close</button><button className="primary-button" onClick={() => { setShowProfile(false); setActive('Settings') }}>Open settings</button></div></Modal>}
      {showForm && <Modal title="Add assignment" onClose={() => setShowForm(false)}><div className="form-grid"><label className="wide">Assignment title<input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Research paper draft" /></label><label>Subject<input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g. Mathematics" /></label><label>Due date<input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} /></label><label>Priority<select value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label><label className="wide">Notes<textarea placeholder="Add a short note (optional)" /></label></div><div className="modal-actions"><button className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" onClick={addAssignment}>Save assignment</button></div></Modal>}
    </div>
  )
}

function Stat({ icon, label, value, note, tone, progress }: { icon: React.ReactNode; label: string; value: number; note: string; tone: string; progress?: number }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small>{progress !== undefined && <div className="mini-progress"><i style={{ width: `${progress}%` }} /></div>}</div><TrendingUp className="stat-trend" /></div> }

function Dashboard({ assignments, completed, pending, dueSoon, filter, setFilter, setActive, toggleComplete, deleteAssignment }: { assignments: Assignment[]; completed: number; pending: number; dueSoon: Assignment[]; filter: string; setFilter: (x: string) => void; setActive: (x: string) => void; toggleComplete: (id: number) => void; deleteAssignment: (id: number) => void }) { return <>
  <div className="section-heading"><div><h2>Overview</h2><p>Stay on top of your academic workload.</p></div><button className="text-button" onClick={() => setActive('Analytics')}>View reports <span>→</span></button></div>
  <div className="dashboard-grid"><section className="panel assignments-panel"><div className="panel-head"><div><h3>Recent assignments</h3><p>Your latest academic tasks</p></div><button className="filter-button" onClick={() => setFilter(filter === 'All' ? 'Due soon' : 'All')}><Filter /> {filter === 'Due soon' ? 'Clear filter' : 'Filter'}</button></div><div className="filter-tabs">{['All', 'Not started', 'In progress', 'Completed', 'Due soon'].map(x => <button key={x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div><div className="assignment-list">{assignments.slice(0, 6).map(a => <div className="assignment-row" key={a.id}><button className={`check ${a.status === 'Completed' ? 'checked' : ''}`} onClick={() => toggleComplete(a.id)} aria-label={`Mark ${a.title} complete`}>{a.status === 'Completed' && <Check />}</button><div className="assignment-main"><strong>{a.title}</strong><span><i style={{ background: a.color }} />{a.subject}</span></div><span className={`priority ${a.priority.toLowerCase()}`}>{a.priority}</span><div className="due"><span>{fmt(a.due)}</span><small>{daysUntil(a.due) < 0 && a.status !== 'Completed' ? 'Overdue' : daysUntil(a.due) === 0 ? 'Today' : `in ${daysUntil(a.due)} days`}</small></div><button className="row-more" onClick={() => deleteAssignment(a.id)} aria-label="Delete assignment"><Trash2 /></button></div>)}{assignments.length === 0 && <div className="empty">No assignments found. Add your first one above.</div>}</div><button className="view-all" onClick={() => { setFilter('All'); setActive('All Assignments') }}>View all assignments <span>→</span></button></section>
    <aside className="right-column"><section className="panel workload-panel"><div className="panel-head"><div><h3>Weekly workload</h3><p>Completed vs. pending</p></div><button className="dots"><MoreHorizontal /></button></div><div className="chart"><div className="chart-y"><span>8</span><span>6</span><span>4</span><span>2</span><span>0</span></div><div className="chart-area">{['M','T','W','T','F','S','S'].map((d, i) => <div className="bar-group" key={`${d}${i}`}><div className="bars"><i style={{ height: `${[42, 55, 34, 72, 48, 25, 15][i]}%` }} /><b style={{ height: `${[25, 35, 25, 22, 38, 14, 10][i]}%` }} /></div><span>{d}</span></div>)}</div></div><div className="chart-legend"><span><i className="legend-complete" />Completed</span><span><i className="legend-pending" />Pending</span></div></section>
    <section className="panel deadlines-panel"><div className="panel-head"><div><h3>Upcoming deadlines</h3><p>What&apos;s coming next</p></div><CalendarDays className="panel-icon" /></div>{dueSoon.slice(0, 3).map(a => <div className="deadline" key={a.id}><div className="date-box"><strong>{new Date(`${a.due}T12:00:00`).getDate()}</strong><span>{new Date(`${a.due}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</span></div><div><strong>{a.title}</strong><span>{a.subject}</span></div><b>{daysUntil(a.due) === 0 ? 'Today' : `${daysUntil(a.due)}d`}</b></div>)}</section></aside>
  </div></> }

function PageView({ active, assignments, setActive, setShowForm, toggleComplete }: { active: string; assignments: Assignment[]; setActive: (x: string) => void; setShowForm: (x: boolean) => void; toggleComplete: (id: number) => void }) { const subjects = [...new Set(assignments.map(a => a.subject))]; const today = '2026-10-14'; const todayTasks = assignments.filter(a => a.status !== 'Completed'); const rows = active === 'My Tasks' ? todayTasks : active === 'Calendar' ? [...assignments].sort((a, b) => a.due.localeCompare(b.due)) : assignments; return <section className="page-view"><div className="section-heading"><div><h2>{active}</h2><p>{active === 'Subjects' ? 'Organize your coursework by subject.' : active === 'Analytics' ? 'A clearer view of your academic progress.' : active === 'My Tasks' ? 'All of your active assignments in one place.' : active === 'Calendar' ? 'Every assignment deadline, ordered by date.' : 'Manage and review all of your academic work.'}</p></div>{active !== 'Analytics' && <button className="primary-button" onClick={() => setShowForm(true)}><Plus /> New assignment</button>}</div>{active === 'Analytics' ? <div className="analytics-cards"><div className="big-progress"><span>Completion rate</span><strong>{Math.round(assignments.filter(a => a.status === 'Completed').length / assignments.length * 100)}%</strong><div className="large-ring"><div>{assignments.filter(a => a.status === 'Completed').length}<small> / {assignments.length}</small></div></div></div><div className="panel subject-bars"><h3>Subject workload</h3>{subjects.map((s, i) => <div className="subject-bar" key={s}><span>{s}</span><div><i style={{ width: `${Math.max(18, 100 - i * 13)}%` }} /></div><b>{assignments.filter(a => a.subject === s).length}</b></div>)}</div></div> : active === 'Subjects' ? <div className="subject-grid">{subjects.map((s, i) => <div className="subject-card" key={s}><div className="subject-dot" style={{ background: ['#6478f5','#edaa4b','#51a883','#8b72c7'][i % 4] }} /><h3>{s}</h3><p>{assignments.filter(a => a.subject === s).length} assignments</p><div><span>{assignments.filter(a => a.subject === s && a.status === 'Completed').length} completed</span><span>{assignments.filter(a => a.subject === s && a.status !== 'Completed').length} pending</span></div></div>)}</div> : <div className="panel full-list">{(active === 'My Tasks' ? assignments.filter(a => a.status !== 'Completed') : [...assignments].sort((a, b) => a.due.localeCompare(b.due))).map(a => <div className="assignment-row" key={a.id}><button className={`check ${a.status === 'Completed' ? 'checked' : ''}`} onClick={() => toggleComplete(a.id)}>{a.status === 'Completed' && <Check />}</button><div className="assignment-main"><strong>{a.title}</strong><span>{a.subject}</span></div><span className={`status ${a.status.toLowerCase().replace(' ', '-')}`}>{a.status}</span><div className="due"><span>{fmt(a.due)}</span><small>{a.priority} priority</small></div></div>)}</div>}</section> }

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="modal-backdrop" onMouseDown={e => e.currentTarget === e.target && onClose()}><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>Keep your academic work organized.</p></div><button className="icon-button" onClick={onClose}><X /></button></div>{children}</div></div> }
