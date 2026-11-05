import { useState, useEffect } from "react";
import { PageHeading } from "../components/UI";
import api from "../api/axios";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const res = await api.get("/admin/students");
      setStudents(res.data.data);
    }
    fetchStudents();
  }, []);

  return (
    <>
      <PageHeading
        eyebrow="STUDENT RECORDS"
        title="Students"
        subtitle="View student registration records."
      />
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Programme</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>{s.email}</td>
                  <td>{s.programme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
