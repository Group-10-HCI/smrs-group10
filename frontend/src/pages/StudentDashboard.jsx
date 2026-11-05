import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  CalendarDays,
  UserRound,
  Plus,
} from "lucide-react";
import { PageHeading, StatCard, EmptyState } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const MAX_CREDITS = 21;

export default function StudentDashboard({ onSearch, onDrop, notify }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDash() {
      try {
        const res = await api.get("/dashboard/student");
        if (res.data.success === true) {
          setData(res.data.data);
        }
      } catch (err) {
        notify("Failed to load dashboard data", "error");
      }
    }
    fetchDash();
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <>
      <PageHeading
        eyebrow="STUDENT OVERVIEW"
        title={`Good day, ${user.firstname} 👋`}
        subtitle="Here is an overview of your academic registration."
        action={
          <button className="primary-btn" onClick={onSearch}>
            <Plus size={18} /> Register for a course
          </button>
        }
      />
      <div className="stats-grid">
        <StatCard
          icon={BookOpen}
          label="Registered courses"
          value={data.registration?.courses.length || 0}
          detail="This semester"
        />
        <StatCard
          icon={ClipboardList}
          label="Credit load"
          value={`${data.registration?.totalCredits || 0} / ${MAX_CREDITS}`}
          detail="Maximum allowed credits"
        />
        <StatCard
          icon={CalendarDays}
          label="Registration status"
          value={data.registration?.status || "Not Registered"}
          detail="Current status"
        />
      </div>

      <div className="content-grid">
        <section className="panel course-panel">
          <div className="panel-heading">
            <div>
              <h2>Your registered courses</h2>
              <p>Courses you have selected for this semester.</p>
            </div>
          </div>
          {data.registration?.courses?.length ? (
            <div className="course-list">
              {data.registration.courses.map((c) => (
                <div className="course-row" key={c.course._id}>
                  <div className="course-code">{c.course.code}</div>
                  <div className="course-info">
                    <strong>{c.course.name}</strong>
                    <span>{c.course.creditHours} credits</span>
                  </div>
                  {data.registration.status === "rejected" && (
                    <button
                      className="text-danger"
                      onClick={() => onDrop(c.course._id)}
                    >
                      Drop course
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses registered"
              text="Search the course catalogue to add courses."
            />
          )}
        </section>

        <aside className="panel profile-summary">
          <div className="panel-heading">
            <div>
              <h2>Student profile</h2>
              <p>Your academic information.</p>
            </div>
            <UserRound size={20} />
          </div>
          <div className="profile-avatar">{user.firstname.charAt(0)}</div>
          <h3>
            {user.firstname} {user.lastName}
          </h3>
          <p className="muted">{data.programme || "No Programme Assigned"}</p>
          <div className="detail-line">
            <span>Email</span>
            <strong className="email-value">{user.email}</strong>
          </div>
        </aside>
      </div>
    </>
  );
}
