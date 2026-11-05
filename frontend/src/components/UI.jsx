import { X, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

export function PageHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow blue-text">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={21} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      className={`toast ${message.type}`}
      role={message.type === "error" ? "alert" : "status"}
    >
      {message.type === "error" ? (
        <AlertCircle size={20} aria-hidden="true" />
      ) : (
        <CheckCircle2 size={20} aria-hidden="true" />
      )}
      <span>{message.text}</span>
      <button onClick={onClose} aria-label="Dismiss message">
        <X size={16} />
      </button>
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <BookOpen size={24} />
      </div>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
