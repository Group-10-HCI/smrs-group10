import { useMemo, useState } from 'react'
import {
  GraduationCap, LayoutDashboard, Search, BookOpen, UserRound, LogOut,
  Menu, X, Plus, Trash2, CheckCircle2, AlertCircle, CalendarDays, Users,
  ClipboardList, ChevronRight, Clock3, Filter, Bell
} from 'lucide-react'

const starterCourses = [
  { id: 'CS101', title: 'Introduction to Computer Science', department: 'Computing', credits: 3, lecturer: 'Dr. Banda', capacity: 60, enrolled: 42, description: 'Core concepts of computing, problem solving and computer systems.' },
  { id: 'CS204', title: 'Web Application Development', department: 'Computing', credits: 4, lecturer: 'Ms. Phiri', capacity: 45, enrolled: 38, description: 'Learn to plan and build responsive web applications.' },
  { id: 'MA102', title: 'Discrete Mathematics', department: 'Mathematics', credits: 3, lecturer: 'Mr. Zulu', capacity: 50, enrolled: 31, description: 'Sets, relations, functions, logic and mathematical reasoning.' },
  { id: 'IS210', title: 'Database Management Systems', department: 'Information Systems', credits: 4, lecturer: 'Dr. Mbewe', capacity: 40, enrolled: 39, description: 'Database design, SQL, normalization and data management.' },
  { id: 'BU110', title: 'Principles of Management', department: 'Business', credits: 3, lecturer: 'Mrs. Nkhoma', capacity: 55, enrolled: 20, description: 'An introduction to management and organizational practice.' },
  { id: 'CS220', title: 'Human Computer Interaction', department: 'Computing', credits: 3, lecturer: 'Mr. Phiri', capacity: 45, enrolled: 26, description: 'Designing accessible, useful and easy-to-use digital products.' },
]
const MAX_CREDITS = 18

function Login({ onLogin }) {
  const [error, setError] = useState('')
  function submit(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!data.get('email')?.trim() || !data.get('password')) {
      setError('Error: Email address and password are required. Enter both fields, then try signing in again.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email').trim())) {
      setError('Error: The email address is not in a valid format. Check the address and enter it again, for example student@example.com.')
      return
    }
    setError('')
    onLogin({ email: data.get('email').trim(), role: data.get('role') })
  }
  return <div className="login-page">
    <section className="login-intro">
      <div className="login-brand"><span className="brand-symbol"><GraduationCap size={26}/></span><span>SMRS</span></div>
      <div className="intro-copy">
        <p className="eyebrow">STUDENT MANAGEMENT & REGISTRATION SYSTEM</p>
        <h1>Your academic journey, organised in one place.</h1>
        <p>Register for courses, keep track of your academic progress and manage your student profile with ease.</p>
      </div>
      <div className="intro-footer">A simpler way to manage your studies.</div>
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={submit} noValidate aria-describedby="login-help">
        <div className="mobile-login-brand"><GraduationCap/> SMRS</div>
        <p className="eyebrow blue-text">WELCOME BACK</p>
        <h2>Sign in to your account</h2>
        <p className="muted">Enter your details to access the student portal.</p>
        {error && <div className="alert error" role="alert"><AlertCircle size={20} aria-hidden="true"/><span>{error}</span></div>}
        <label htmlFor="login-email">Email address</label>
        <input id="login-email" name="email" type="email" placeholder="you@example.com" autoComplete="username" />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
        <label htmlFor="login-role">Sign in as</label>
        <select id="login-role" name="role" defaultValue="student">
          <option value="student">Student</option>
          <option value="admin">Administrator (demo)</option>
        </select>
        <button className="primary-btn full-btn" type="submit">Sign in <ChevronRight size={18}/></button>
        <p className="login-hint" id="login-help">Demo prototype: enter any valid email address and any password. Choose Administrator to preview the admin screens.</p>
      </form>
    </section>
  </div>
}

function App() {
  const [account, setAccount] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [courses, setCourses] = useState(starterCourses)
  const [registered, setRegistered] = useState(['CS101', 'MA102'])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [message, setMessage] = useState(null)
  const [profile, setProfile] = useState({
    fullName: 'Alex Student', studentId: 'STU2026001',
    email: 'alex.student@example.com', programme: 'BSc Computer Science', year: '2'
  })
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [newCourse, setNewCourse] = useState({ id: '', title: '', department: 'Computing', credits: '3', lecturer: '' })

  const isAdmin = account?.role === 'admin'
  const myCourses = courses.filter(c => registered.includes(c.id))
  const totalCredits = myCourses.reduce((sum, c) => sum + c.credits, 0)
  const departments = ['All departments', ...new Set(courses.map(c => c.department))]
  const filteredCourses = useMemo(() => courses.filter(c => {
    const term = search.toLowerCase()
    return (c.title.toLowerCase().includes(term) || c.id.toLowerCase().includes(term)) &&
      (department === 'All departments' || c.department === department)
  }), [courses, search, department])

  function notify(text, type = 'success') {
    setMessage({ text, type })
    window.clearTimeout(window.__smrsToast)
    window.__smrsToast = window.setTimeout(() => setMessage(null), 3800)
  }
  function go(next) { setPage(next); setMenuOpen(false); setMessage(null) }
  function addCourse(id) {
    const course = courses.find(c => c.id === id)
    if (!course) return notify('Error: This course could not be found. Refresh the course list and try again.', 'error')
    if (!registrationOpen) return notify('Error: Course registration is closed for this period. Check the registration dates or contact the student support office.', 'error')
    if (registered.includes(id)) return notify('Error: You are already registered for this course. Choose a different course to avoid a duplicate registration.', 'error')
    if (totalCredits + course.credits > MAX_CREDITS) return notify(`Error: This course would take your credit load above ${MAX_CREDITS} credits. Choose a course with fewer credits or drop a course first.`, 'error')
    if (course.enrolled >= course.capacity) return notify('Error: This course has reached its capacity. Choose another available course.', 'error')
    if (!window.confirm(`Are you sure you want to submit your course registration for ${course.id} – ${course.title}?`)) return
    setRegistered(old => [...old, id])
    setCourses(old => old.map(c => c.id === id ? { ...c, enrolled: c.enrolled + 1 } : c))
    notify(`Success: Your course registration for ${course.id} was successfully submitted.`)
  }
  function dropCourse(id) {
    const course = courses.find(c => c.id === id)
    if (!course) return
    if (!window.confirm(`Drop course ${course.id} from your current registration?`)) return
    setRegistered(old => old.filter(code => code !== id))
    setCourses(old => old.map(c => c.id === id ? { ...c, enrolled: Math.max(0, c.enrolled - 1) } : c))
    notify(`Success: ${course.id} has been dropped from your courses.`)
  }
  function addNewCourse(e) {
    e.preventDefault()
    if (!newCourse.id.trim() || !newCourse.title.trim() || !newCourse.lecturer.trim()) {
      notify('Complete all course fields before saving.', 'error'); return
    }
    if (courses.some(c => c.id.toLowerCase() === newCourse.id.trim().toLowerCase())) {
      notify('A course with that course code already exists.', 'error'); return
    }
    setCourses(old => [...old, { ...newCourse, id: newCourse.id.trim().toUpperCase(), credits: Number(newCourse.credits), capacity: 40, enrolled: 0, description: 'New course added by the administrator.' }])
    setNewCourse({ id: '', title: '', department: 'Computing', credits: '3', lecturer: '' })
    notify('The new course has been created.')
  }

  if (!account) return <Login onLogin={setAccount}/>

  const studentNav = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['search', 'Find courses', Search],
    ['mycourses', 'My courses', BookOpen],
    ['profile', 'My profile', UserRound],
  ]
  const adminNav = [
    ['admin', 'Admin overview', LayoutDashboard],
    ['manage', 'Manage courses', BookOpen],
    ['students', 'Students', Users],
  ]
  const navItems = isAdmin ? adminNav : studentNav

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <span className="brand-symbol"><GraduationCap size={23}/></span>
        <span className="brand-name">SMRS<small>Student Portal</small></span>
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X/></button>
      </div>
      <p className="side-caption">WORKSPACE</p>
      <nav aria-label="Main navigation">
        {navItems.map(([id, label, Icon]) => <button key={id} className={`nav-link ${page === id ? 'selected' : ''}`} onClick={() => go(id)}><Icon size={19}/><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-box"><span className="help-bubble">?</span><strong>Need help?</strong><p>Contact the student support office if you need assistance.</p></div>
        <button className="nav-link signout" onClick={() => { setAccount(null); setPage('dashboard') }}><LogOut size={18}/><span>Sign out</span></button>
      </div>
    </aside>
    {menuOpen && <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation overlay"/>}
    <main className="main-area" id="main-content" tabIndex="-1">
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu/></button>
        <div className="topbar-title">Student Management <span>/</span> <strong>{pageTitle(page)}</strong></div>
        <div className="topbar-user"><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button><span className="avatar">{(profile.fullName || 'A').charAt(0)}</span><div className="user-meta"><strong>{isAdmin ? 'Administrator' : profile.fullName}</strong><small>{isAdmin ? 'System admin' : profile.studentId}</small></div></div>
      </header>
    {message && (
  <div
    className={`toast ${message.type}`}
    role={message.type === 'error' ? 'alert' : 'status'}
  >
    {message.type === 'error' ? (
      <AlertCircle size={20} aria-hidden="true" />
    ) : (
      <CheckCircle2 size={20} aria-hidden="true" />
    )}

    <span>
      {message.text.startsWith('Error:') ||
      message.text.startsWith('Success:')
        ? message.text
        : `${message.type === 'error' ? 'Error:' : 'Success:'} ${message.text}`}
    </span>

    <button
      onClick={() => setMessage(null)}
      aria-label="Dismiss message"
    >
      <X size={16} />
    </button>
  </div>
)}


      <section className="page-content" aria-live="off">
        {page === 'dashboard' && !isAdmin && (
          <StudentDashboard
            profile={profile}
            courses={myCourses}
            credits={totalCredits}
            onSearch={() => go('search')}
            onDrop={dropCourse}
          />
        )}
        {page === 'search' && !isAdmin && (
          <CourseSearch
            courses={filteredCourses}
            registered={registered}
            search={search}
            setSearch={setSearch}
            department={department}
            setDepartment={setDepartment}
            departments={departments}
            onAdd={addCourse}
          />
        )}
        {page === 'mycourses' && !isAdmin && (
          <MyCourses courses={myCourses} credits={totalCredits} onDrop={dropCourse} />
        )}
        {page === 'profile' && !isAdmin && (
          <Profile profile={profile} setProfile={setProfile} notify={notify} />
        )}
        {page === 'admin' && isAdmin && (
          <AdminDashboard
            courses={courses}
            registered={registered}
            registrationOpen={registrationOpen}
            setRegistrationOpen={setRegistrationOpen}
            onManage={() => go('manage')}
          />
        )}
        {page === 'manage' && isAdmin && (
          <ManageCourses
            courses={courses}
            newCourse={newCourse}
            setNewCourse={setNewCourse}
            onAdd={addNewCourse}
          />
        )}
        {page === 'students' && isAdmin && (
          <StudentsPage profile={profile} registered={registered} courses={courses} />
        )}
      </section>

      <footer className="footer">SMRS · Student Management & Registration System <span>Prototype with sample data</span></footer>
    </main>
  </div>
}

function pageTitle(page) {
  return ({ dashboard: 'Dashboard', search: 'Find courses', mycourses: 'My courses', profile: 'My profile', admin: 'Admin overview', manage: 'Manage courses', students: 'Students' })[page] || 'Dashboard'
}
function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><p className="eyebrow blue-text">{eyebrow}</p><h1>{title}</h1><p className="muted">{subtitle}</p></div>{action}</div>
}
function StatCard({ icon: Icon, label, value, detail }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={21}/></div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div>
}
function StudentDashboard({ profile, courses, credits, onSearch, onDrop }) {
  return <>
    <PageHeading eyebrow="STUDENT OVERVIEW" title={`Good day, ${profile.fullName.split(' ')[0]} 👋`} subtitle="Here is an overview of your academic registration." action={<button className="primary-btn" onClick={onSearch}><Plus size={18}/> Register for a course</button>}/>
    <div className="stats-grid">
      <StatCard icon={BookOpen} label="Registered courses" value={courses.length} detail="This semester"/>
      <StatCard icon={ClipboardList} label="Credit load" value={`${credits} / ${MAX_CREDITS}`} detail="Maximum allowed credits"/>
      <StatCard icon={CalendarDays} label="Registration status" value="Open" detail="Semester 1 · 2026/27"/>
    </div>
    <div className="content-grid">
      <section className="panel course-panel"><div className="panel-heading"><div><h2>Your registered courses</h2><p>Courses you have selected for this semester.</p></div><span className="count-pill">{courses.length} courses</span></div>
        {courses.length ? <div className="course-list">{courses.map(c => <div className="course-row" key={c.id}><div className="course-code">{c.id}</div><div className="course-info"><strong>{c.title}</strong><span>{c.lecturer} · {c.credits} credits</span></div><button className="text-danger" onClick={() => onDrop(c.id)}>Drop course</button></div>)}</div> : <EmptyState title="No courses registered" text="Search the course catalogue to add courses to your semester."/>}
      </section>
      <aside className="panel profile-summary"><div className="panel-heading"><div><h2>Student profile</h2><p>Your academic information.</p></div><UserRound size={20}/></div><div className="profile-avatar">{profile.fullName.charAt(0)}</div><h3>{profile.fullName}</h3><p className="muted">{profile.programme}</p><div className="detail-line"><span>Student ID</span><strong>{profile.studentId}</strong></div><div className="detail-line"><span>Year of study</span><strong>{profile.year}</strong></div><div className="detail-line"><span>Email</span><strong className="email-value">{profile.email}</strong></div></aside>
    </div>
    <div className="notice-card"><div className="notice-icon"><Clock3 size={20}/></div><div><strong>Registration reminder</strong><p>Review your selected courses before the registration deadline. Your total credit load must not exceed 18 credits.</p></div></div>
  </>
}
function CourseSearch({ courses, registered, search, setSearch, department, setDepartment, departments, onAdd }) {
  return <>
    <PageHeading eyebrow="COURSE CATALOGUE" title="Find your next course" subtitle="Search available courses and add them to your semester registration."/>
    <div className="panel search-panel"><div className="search-controls"><div className="search-input-wrap"><Search size={19}/><input aria-label="Search courses" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by course name or code..."/></div><div className="filter-wrap"><Filter size={17}/><select aria-label="Filter by department" value={department} onChange={e => setDepartment(e.target.value)}>{departments.map(d => <option key={d}>{d}</option>)}</select></div></div>
      <div className="results-heading"><strong>{courses.length} courses found</strong><span>Maximum credit load: {MAX_CREDITS}</span></div>
      {courses.length ? <div className="catalog-grid">{courses.map(c => <article className="catalog-card" key={c.id}><div className="catalog-top"><span className="course-code">{c.id}</span><span className={`availability ${c.enrolled >= c.capacity ? 'full' : ''}`}>{c.enrolled >= c.capacity ? 'Full' : `${c.capacity - c.enrolled} places left`}</span></div><h3>{c.title}</h3><p>{c.description}</p><div className="catalog-meta"><span>{c.department}</span><span>{c.credits} credits</span></div><div className="catalog-lecturer">Lecturer: {c.lecturer}</div><button className={registered.includes(c.id) ? 'secondary-btn full-btn' : 'primary-btn full-btn'} disabled={registered.includes(c.id) || c.enrolled >= c.capacity} onClick={() => onAdd(c.id)}>{registered.includes(c.id) ? <><CheckCircle2 size={17}/> Already registered</> : <><Plus size={17}/> Add course</>}</button></article>)}</div> : <EmptyState title="No matching courses" text="Try another search term or choose a different department."/>}
    </div>
  </>
}
function MyCourses({ courses, credits, onDrop }) {
  return <><PageHeading eyebrow="YOUR SEMESTER" title="My registered courses" subtitle="Review or drop courses in your current registration."/><div className="stats-grid compact-stats"><StatCard icon={BookOpen} label="Selected courses" value={courses.length} detail="Current semester"/><StatCard icon={ClipboardList} label="Total credits" value={credits} detail={`Out of ${MAX_CREDITS} allowed`}/></div><section className="panel"><div className="panel-heading"><div><h2>Registration summary</h2><p>Your current course selection.</p></div><span className="status-pill"><CheckCircle2 size={15}/> Saved locally</span></div>{courses.length ? <div className="table-wrap"><table><caption className="sr-only">Student course registration details</caption><thead><tr><th scope="col">Course</th><th scope="col">Department</th><th scope="col">Lecturer</th><th scope="col">Credits</th><th scope="col">Action</th></tr></thead><tbody>{courses.map(c => <tr key={c.id}><td><strong>{c.id}</strong><small className="table-sub">{c.title}</small></td><td>{c.department}</td><td>{c.lecturer}</td><td>{c.credits}</td><td><button className="text-danger" onClick={() => onDrop(c.id)}><Trash2 size={18} aria-hidden="true"/> Drop course</button></td></tr>)}</tbody></table></div> : <EmptyState title="No courses registered" text="Go to Find courses to begin your registration."/>}</section></>
}
function Profile({ profile, setProfile, notify }) {
  const [form, setForm] = useState(profile)
  function save(e) { e.preventDefault(); if (!form.fullName.trim() || !form.email.trim() || !form.programme.trim()) { notify('Error: Full name, email address and programme are required. Complete the missing fields and save again.', 'error'); return }; setProfile(form); notify('Your profile has been updated.') }
  return <><PageHeading eyebrow="ACCOUNT SETTINGS" title="My profile" subtitle="Keep your personal and academic details up to date."/><form className="panel profile-form" onSubmit={save}><div className="panel-heading"><div><h2>Personal information</h2><p>Fields marked with * are required.</p></div></div><div className="form-grid"><div className="field"><label htmlFor="fullname">Full name *</label><input id="fullname" name="fullName" autoComplete="name" maxLength={100} value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required/></div><div className="field"><label htmlFor="studentid">Student ID</label><input id="studentid" value={form.studentId} disabled/></div><div className="field"><label htmlFor="profileemail">Email address *</label><input id="profileemail" name="email" autoComplete="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/></div><div className="field"><label htmlFor="programme">Programme *</label><input id="programme" value={form.programme} onChange={e => setForm({...form, programme: e.target.value})} required/></div><div className="field"><label htmlFor="year">Year of study</label><select id="year" value={form.year} onChange={e => setForm({...form, year: e.target.value})}><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option><option value="5">Year 5</option></select></div></div><div className="form-actions"><button className="primary-btn" type="submit">Save changes</button></div></form></>
}
function AdminDashboard({ courses, registered, registrationOpen, setRegistrationOpen, onManage }) {
  return <><PageHeading eyebrow="ADMINISTRATION" title="Admin overview" subtitle="Monitor course registration and manage the academic catalogue." action={<button className="primary-btn" onClick={onManage}><Plus size={18}/> Add a course</button>}/><div className="stats-grid"><StatCard icon={Users} label="Student accounts" value="128" detail="Sample system data"/><StatCard icon={BookOpen} label="Available courses" value={courses.length} detail="In the course catalogue"/><StatCard icon={ClipboardList} label="Registrations" value={registered.length} detail="Demo student registrations"/></div><div className="content-grid"><section className="panel"><div className="panel-heading"><div><h2>Course capacity</h2><p>Current enrolment across courses.</p></div></div><div className="capacity-list">{courses.map(c => <div className="capacity-item" key={c.id}><div className="capacity-label"><strong>{c.id} · {c.title}</strong><span>{c.enrolled}/{c.capacity}</span></div><div className="progress-track"><div className="progress-fill" style={{width: `${Math.min(100, c.enrolled / c.capacity * 100)}%`}}/></div></div>)}</div></section><section className="panel period-panel"><div className="panel-heading"><div><h2>Registration period</h2><p>Control whether students can register.</p></div><CalendarDays size={21}/></div><span className={`large-status ${registrationOpen ? 'open' : 'closed'}`}>{registrationOpen ? 'Open' : 'Closed'}</span><p className="muted">Semester 1 · 2026/2027</p><button className={registrationOpen ? 'danger-outline full-btn' : 'primary-btn full-btn'} onClick={() => setRegistrationOpen(v => !v)}>{registrationOpen ? 'Close registration' : 'Open registration'}</button><p className="small-note">This demo toggle updates the student registration experience locally.</p></section></div></>
}
function ManageCourses({ courses, newCourse, setNewCourse, onAdd }) {
  return <><PageHeading eyebrow="COURSE MANAGEMENT" title="Manage courses" subtitle="Create courses and review the catalogue."/><div className="manage-grid"><form className="panel add-course-form" onSubmit={onAdd}><div className="panel-heading"><div><h2>Create a course</h2><p>Add a course to the catalogue.</p></div></div><div className="field"><label htmlFor="new-code">Course code *</label><input id="new-code" name="courseCode" placeholder="e.g. CS305" value={newCourse.id} onChange={e => setNewCourse({...newCourse, id: e.target.value})} required/></div><div className="field"><label htmlFor="new-title">Course title *</label><input id="new-title" name="courseTitle" placeholder="Enter course title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required/></div><div className="field"><label htmlFor="new-dept">Department</label><select id="new-dept" value={newCourse.department} onChange={e => setNewCourse({...newCourse, department: e.target.value})}><option>Computing</option><option>Mathematics</option><option>Information Systems</option><option>Business</option></select></div><div className="form-grid two-fields"><div className="field"><label htmlFor="new-credits">Credits</label><select id="new-credits" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: e.target.value})}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div><div className="field"><label htmlFor="new-lecturer">Lecturer *</label><input id="new-lecturer" name="lecturer" placeholder="Lecturer name" value={newCourse.lecturer} onChange={e => setNewCourse({...newCourse, lecturer: e.target.value})} required/></div></div><button className="primary-btn full-btn" type="submit"><Plus size={17}/> Create course</button></form><section className="panel"><div className="panel-heading"><div><h2>Course catalogue</h2><p>{courses.length} courses currently listed.</p></div></div><div className="admin-course-list">{courses.map(c => <div className="admin-course-row" key={c.id}><span className="course-code">{c.id}</span><div><strong>{c.title}</strong><small>{c.department} · {c.credits} credits</small></div><span className="enrolment-number">{c.enrolled}/{c.capacity}</span></div>)}</div></section></div></>
}
function StudentsPage({ profile, registered, courses }) {
  return <><PageHeading eyebrow="STUDENT RECORDS" title="Students" subtitle="View a sample overview of student registration records."/><section className="panel"><div className="panel-heading"><div><h2>Student directory</h2><p>Sample data for the frontend prototype.</p></div><span className="count-pill">1 student shown</span></div><div className="table-wrap"><table><caption className="sr-only">Student course registration details</caption><thead><tr><th scope="col">Student</th><th scope="col">Student ID</th><th scope="col">Programme</th><th scope="col">Courses</th><th scope="col">Credits</th></tr></thead><tbody><tr><td><strong>{profile.fullName}</strong><small className="table-sub">{profile.email}</small></td><td>{profile.studentId}</td><td>{profile.programme}</td><td>{registered.length}</td><td>{courses.filter(c => registered.includes(c.id)).reduce((n,c) => n+c.credits,0)}</td></tr></tbody></table></div></section></>
}
function EmptyState({ title, text }) { return <div className="empty-state"><div className="empty-icon"><BookOpen size={24}/></div><strong>{title}</strong><p>{text}</p></div> }

export default App
