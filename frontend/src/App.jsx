import { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CourseSearch from "./pages/CourseSearch";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCourses from "./pages/ManageCourses";
import StudentsPage from "./pages/StudentsPage";
import api from "./api/axios";
import { Toast } from "./components/UI";

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [message, setMessage] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const notify = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    if (user?.role === "student") {
      async function fetchData() {
        try {
          const regRes = await api.get(
            "/registrations/myRegistration?academicYear=2026/2027&semester=1",
          );
          setRegistration(regRes.data.data);
        } catch (e) {
          /* No reg yet */
        }

        try {
          const profRes = await api.get("/profiles/me");
          setProfileData(profRes.data.data);
        } catch (e) {
          /* No profile yet */
        }
      }
      fetchData();
    }
  }, [user]);

  async function addCourse(courseId) {
    try {
      if (!registration) {
        const res = await api.post("/registrations/submit", {
          academicYear: "2026/2027",
          semester: 1,
          courseIds: [courseId],
        });
        setRegistration(res.data.data);
      } else {
        const res = await api.post("/registrations/addCourse", {
          registrationId: registration._id,
          courseId,
        });
        setRegistration(res.data.data);
      }
      notify("Success: Course added successfully.");
    } catch (err) {
      notify(
        `Error: ${err.response?.data?.message || "Failed to add course"}`,
        "error",
      );
    }
  }

  async function dropCourse(courseId) {
    try {
      const res = await api.post("/registrations/dropCourse", {
        registrationId: registration._id,
        courseId,
      });
      setRegistration(res.data.data);
      notify("Success: Course dropped.");
    } catch (err) {
      notify(
        `Error: ${err.response?.data?.message || "Failed to drop course"}`,
        "error",
      );
    }
  }

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading Portal...
      </div>
    );
  if (!user) return <Login />;

  // Determine page title for the top bar
  const pageTitles = {
    dashboard: "Dashboard",
    search: "Find courses",
    mycourses: "My courses",
    profile: "My profile",
    admin: "Admin overview",
    manage: "Manage courses",
    students: "Students",
  };

  return (
    <>
      <Layout
        page={page}
        setPage={setPage}
        pageTitle={() => pageTitles[page] || "Dashboard"}
      >
        <Toast message={message} onClose={() => setMessage(null)} />

        {/* Student Routes */}
        {page === "dashboard" && (
          <StudentDashboard
            onSearch={() => setPage("search")}
            registration={registration}
            onDrop={dropCourse}
            notify={notify}
          />
        )}
        {page === "search" && (
          <CourseSearch registration={registration} onAdd={addCourse} />
        )}
        {page === "mycourses" && (
          <MyCourses registration={registration} onDrop={dropCourse} />
        )}
        {page === "profile" && (
          <Profile profileData={profileData} notify={notify} />
        )}

        {/* Admin Routes */}
        {page === "admin" && (
          <AdminDashboard onManage={() => setPage("manage")} />
        )}
        {page === "manage" && <ManageCourses notify={notify} />}
        {page === "students" && <StudentsPage />}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
