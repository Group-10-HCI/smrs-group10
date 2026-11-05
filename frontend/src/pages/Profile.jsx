import { useState } from "react";
import { PageHeading } from "../components/UI";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile({ profileData, notify }) {
  const { user } = useAuth();
  const [form, setForm] = useState(profileData || {});
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/profiles/updateProfile", {
        phone: form.phone,
        physicalAddress: form.physicalAddress,
        nextOfKin: form.nextOfKin,
      });
      notify("Profile updated successfully.");
    } catch (err) {
      notify(
        `Error: ${err.response?.data?.message || "Failed to update"}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="ACCOUNT SETTINGS"
        title="My profile"
        subtitle="Keep your personal details up to date."
      />
      <form className="panel profile-form" onSubmit={save}>
        <div className="panel-heading">
          <div>
            <h2>Personal information</h2>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>First Name (Immutable)</label>
            <input value={user.firstname} disabled />
          </div>
          <div className="field">
            <label>Email (Immutable)</label>
            <input value={user.email} disabled />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Physical Address</label>
            <input
              value={form.physicalAddress || ""}
              onChange={(e) =>
                setForm({ ...form, physicalAddress: e.target.value })
              }
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}
