import { useState, useEffect } from "react";
import { PageHeading } from "../components/UI";
import { Plus } from "lucide-react";
import api from "../api/axios";

export default function ManageCourses({ notify }) {
  const [courses, setCourses] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "New course",
    creditHours: 3,
    department: "Computing",
    programme: "",
    level: 1,
    semester: 1,
  });

  useEffect(() => {
    async function fetchData() {
      const cRes = await api.get("/courses/viewCourses");
      setCourses(cRes.data.data);
      const pRes = await api.get("/programmes/viewProgrammes");
      setProgrammes(pRes.data.data);
      if (pRes.data.data.length > 0)
        setForm((f) => ({ ...f, programme: pRes.data.data[0]._id }));
    }
    fetchData();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/courses/createCourse", form);
      setCourses([...courses, res.data.data]);
      notify("Course created successfully.");
    } catch (err) {
      notify(
        `Error: ${err.response?.data?.message || "Failed to create"}`,
        "error",
      );
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="COURSE MANAGEMENT"
        title="Manage courses"
        subtitle="Create courses and review the catalogue."
      />
      <div className="manage-grid">
        <form className="panel add-course-form" onSubmit={submit}>
          <div className="panel-heading">
            <div>
              <h2>Create a course</h2>
            </div>
          </div>
          <div className="field">
            <label>Course code *</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Course title *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Programme *</label>
            <select
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
            >
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-grid two-fields">
            <div className="field">
              <label>Credits</label>
              <input
                type="number"
                value={form.creditHours}
                onChange={(e) =>
                  setForm({ ...form, creditHours: Number(e.target.value) })
                }
              />
            </div>
            <div className="field">
              <label>Level</label>
              <input
                type="number"
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <button className="primary-btn full-btn" type="submit">
            <Plus size={17} /> Create course
          </button>
        </form>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Course catalogue</h2>
            </div>
          </div>
          <div className="admin-course-list">
            {courses.map((c) => (
              <div className="admin-course-row" key={c._id}>
                <span className="course-code">{c.code}</span>
                <div>
                  <strong>{c.name}</strong>
                  <small>{c.creditHours} credits</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
