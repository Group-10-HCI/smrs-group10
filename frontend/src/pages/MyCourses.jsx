import { PageHeading, StatCard, EmptyState } from "../components/UI";
import { BookOpen, ClipboardList, CheckCircle2, Trash2 } from "lucide-react";

export default function MyCourses({ registration, onDrop }) {
  const courses = registration?.courses || [];
  const credits = registration?.totalCredits || 0;
  const isEditable = registration?.status === "rejected"; // Students can only modify if rejected

  return (
    <>
      <PageHeading
        eyebrow="YOUR SEMESTER"
        title="My registered courses"
        subtitle="Review or drop courses in your current registration."
      />
      <div className="stats-grid compact-stats">
        <StatCard
          icon={BookOpen}
          label="Selected courses"
          value={courses.length}
          detail="Current semester"
        />
        <StatCard
          icon={ClipboardList}
          label="Total credits"
          value={credits}
          detail="Maximum 21 allowed"
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Registration summary</h2>
            <p>Your current course selection.</p>
          </div>
          <span className="status-pill">
            <CheckCircle2 size={15} /> Status: {registration?.status || "None"}
          </span>
        </div>
        {courses.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.course._id}>
                    <td>
                      <strong>{c.course.code}</strong>
                      <small className="table-sub">{c.course.name}</small>
                    </td>
                    <td>{c.course.department || "Computing"}</td>
                    <td>{c.course.creditHours}</td>
                    <td>
                      {isEditable ? (
                        <button
                          className="text-danger"
                          onClick={() => onDrop(c.course._id)}
                        >
                          <Trash2 size={18} /> Drop
                        </button>
                      ) : (
                        <span className="muted">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No courses registered"
            text="Go to Find courses to begin your registration."
          />
        )}
      </section>
    </>
  );
}
