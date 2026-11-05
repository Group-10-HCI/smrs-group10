# SMRS — Shikunzi's Frontend

This is the **frontend/UI part** of the Student Management and Registration System (SMRS) group project.

## What is included

- Student sign-in screen (demo only)
- Student dashboard and profile editing
- Course search and department filtering
- Add/drop course interactions
- Duplicate course prevention
- Course capacity checks
- Maximum credit-load check (18 credits in this prototype)
- Registration open/closed control for the administrator
- Admin overview, course creation and sample student directory
- Responsive desktop, tablet and mobile layouts
- HCI styling: readable type, visible keyboard focus, high-contrast palette, large controls, skip link, semantic landmarks, labelled forms, and screen-reader status/error announcements

## Run it in VS Code

1. Extract the ZIP file.
2. In VS Code choose **File → Open Folder**.
3. Open the folder named `SMRS-Shikunzi-Frontend` — the folder that contains `package.json`.
4. Open **Terminal → New Terminal**.
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local address Vite prints, usually `http://localhost:5173`.

If PowerShell says it cannot find `package.json`, you opened the wrong folder. Use `cd SMRS-Shikunzi-Frontend` from the parent folder, then run the commands again.

## Demo sign-in

Enter any valid-looking email address and any non-empty password. Choose **Student** or **Administrator** from the role selector. This is only a frontend demonstration; it is not secure authentication.

## Important project boundary

This deliverable is the frontend prototype for Shikunzi's assigned UI/UX work. It uses sample data stored in React state. It does **not** connect to Kirito's Express/MongoDB backend yet. Data resets when the page is refreshed. Authentication, permissions, registration rules and all important validations must also be enforced by the backend before the system is used with real student records.

The HCI document describes more complete institutional requirements such as account verification, programme and semester configuration, approval workflows, notifications, receipts, reports, audit logs and security. Those need coordination with the backend and the rest of the group; this frontend should not be presented as having implemented them all.

## Suggested checks

- Test the student and administrator roles.
- Try registering for the same course twice.
- Try adding a course when the 18-credit limit would be exceeded.
- Close registration in the admin view and check that course registration is blocked.
- Use Tab and Shift+Tab without a mouse.
- Test browser zoom at 200%.
- Use Chrome DevTools device emulation for a narrow mobile screen.
- Build check: `npm run build`.
