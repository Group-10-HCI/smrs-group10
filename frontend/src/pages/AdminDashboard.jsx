import { useEffect, useState } from "react";
import { PageHeading, StatCard } from "../components/UI";
import { Users, BookOpen, ClipboardList, CalendarDays } from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard({ onManage }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/dashboard/admin");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  if (!stats) return <p>Loading admin stats...</p>;

  return (
    <>
      <PageHeading
        eyebrow="ADMINISTRATION"
        title="Admin overview"
        subtitle="Monitor course registration and manage the academic catalogue."
        action={
          <button className="primary-btn" onClick={onManage}>
            Manage Courses
          </button>
        }
      />
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Student accounts"
          value={stats.totalStudents}
          detail="Total registered"
        />
        <StatCard
          icon={BookOpen}
          label="Available courses"
          value={stats.totalCourses}
          detail="In the catalogue"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Regs"
          value={stats.pendingRegistrations}
          detail="Awaiting review"
        />
      </div>
      <div className="content-grid">
        <section className="panel period-panel">
          <div className="panel-heading">
            <div>
              <h2>Registration period</h2>
              <p>Current active period.</p>
            </div>
            <CalendarDays size={21} />
          </div>
          <span
            className={`large-status ${stats.activePeriod ? "open" : "closed"}`}
          >
            {stats.activePeriod ? "Open" : "Closed"}
          </span>
          {stats.activePeriod && (
            <>
              <p className="muted">
                {stats.activePeriod.academicYear} · Semester{" "}
                {stats.activePeriod.semester}
              </p>
              <p className="muted">
                Closes:{" "}
                {new Date(stats.activePeriod.closes).toLocaleDateString()}
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
