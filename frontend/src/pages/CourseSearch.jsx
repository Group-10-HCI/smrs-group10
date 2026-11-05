import { useEffect, useState } from "react";
import { Search, Plus, CheckCircle2 } from "lucide-react";
import { PageHeading } from "../components/UI";
import api from "../api/axios";

export default function CourseSearch({ registration, onAdd }) {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses/viewCourses");
        // Map backend format to UI format
        const mapped = res.data.data.map((c) => ({
          _id: c._id,
          code: c.code,
          title: c.name,
          department: c.department,
          credits: c.creditHours,
          description: c.description,
          enrolled: 0, // Backend doesn't return capacity for now
          capacity: 100,
        }));
        setCourses(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const registeredIds = registration?.courses.map((c) => c.course._id) || [];

  return (
    <>
      <PageHeading
        eyebrow="COURSE CATALOGUE"
        title="Find your next course"
        subtitle="Search available courses and add them to your semester registration."
      />
      <div className="panel search-panel">
        <div className="search-controls">
          <div className="search-input-wrap">
            <Search size={19} />
            <input
              aria-label="Search courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course name or code..."
            />
          </div>
        </div>
        <div className="results-heading">
          <strong>{filtered.length} courses found</strong>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="catalog-grid">
            {filtered.map((c) => (
              <article className="catalog-card" key={c._id}>
                <div className="catalog-top">
                  <span className="course-code">{c.code}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="catalog-meta">
                  <span>{c.department}</span>
                  <span>{c.credits} credits</span>
                </div>
                <button
                  className={
                    registeredIds.includes(c._id)
                      ? "secondary-btn full-btn"
                      : "primary-btn full-btn"
                  }
                  disabled={registeredIds.includes(c._id)}
                  onClick={() => onAdd(c._id)}
                >
                  {registeredIds.includes(c._id) ? (
                    <>
                      <CheckCircle2 size={17} /> Already registered
                    </>
                  ) : (
                    <>
                      <Plus size={17} /> Add course
                    </>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
