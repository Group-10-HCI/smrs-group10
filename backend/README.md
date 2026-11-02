# SMRS Backend API Documentation

**Base URL:** `http://localhost:5000`
_(Note: For authentication, the API uses HTTP-Only Cookies. Your frontend MUST be configured to send and receive cookies)._

## 🔐 Authentication (`/auth`)

### 1. Register Student

- **Method:** `POST /auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "firstName": "firstname",
    "lastName": "lastname",
    "email": "test@test.com",
    "password": "Password123"
  }
  ```
- **Response:** `201 Created` with user ID.

### 2. Login

- **Method:** `POST /auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "test@test.com",
    "password": "Password123"
  }
  ```
- **Response:** `200 OK`. Sets `access_token` and `refresh_token` as HTTP-only cookies. Returns user role and ID.

### 3. Get Current User (Me)

- **Method:** `GET /auth/me`
- **Access:** Authenticated
- **Response:** `200 OK` with user details.

### 4. Logout

- **Method:** `POST /auth/logout`
- **Access:** Authenticated
- **Response:** `200 OK`. Clears cookies and revokes refresh token.

### 5. Refresh Token

- **Method:** `POST /auth/refresh`
- **Access:** Authenticated (Uses refresh cookie)
- **Response:** `200 OK`. Rotates cookies.

---

## 🎓 Academic Setup (`/programmes`, `/courses`, `/periods`)

### 1. Create Programme (Admin Only)

- **Method:** `POST /programmes/createProgrammes`
- **Access:** Admin
- **Body:** `code`, `name`, `faculty`, `department`, `qualification`, `duration`, `studyMode`

### 2. View Programmes

- **Method:** `GET /programmes/viewProgrammes`
- **Access:** Authenticated

### 3. Create Course (Admin Only)

- **Method:** `POST /courses/createCourses`
- **Access:** Admin
- **Body:** `code`, `name`, `description`, `creditHours`, `department`, `programme` (ObjectId), `level`, `semester`

### 4. Search/View Courses

- **Method:** `GET /courses/viewCourses?search=intro&level=1`
- **Access:** Authenticated
- **Query Params (Optional):** `search`, `programme` (ID), `level`, `semester`

### 5. Create Registration Period (Admin Only)

- **Method:** `POST /periods/createPeriod`
- **Access:** Admin
- **Body:** `academicYear` (e.g., "2026/2027"), `semester` (1 or 2), `openDate` (ISO), `closeDate` (ISO), `status`

### 6. Get Active Registration Period

- **Method:** `GET /periods/active`
- **Access:** Authenticated
- **Response:** Returns the currently open period or `404` if closed.

---

## 📝 Student Actions (`/profiles`, `/registrations`, `/dashboards`)

### 1. Get My Profile

- **Method:** `GET /profiles/getMyProfile`
- **Access:** Student
- **Response:** Profile data + `completionPercentage`.

### 2. Update My Profile

- **Method:** `PUT /profiles/updateMyProfile`
- **Access:** Student
- **Body (All optional):**
  ```json
  {
    "phone": "+265991234567",
    "physicalAddress": "Area 47",
    "gender": "male",
    "nextOfKin": { "name": "Jane", "relationship": "Mother", "phone": "0888" }
  }
  ```
  _(Note: Cannot update `studentNumber`, `programme`, or `names` here)._

### 3. Submit Course Registration

- **Method:** `POST /registrations/submit`
- **Access:** Student
- **Body:**
  ```json
  {
    "academicYear": "2026/2027",
    "semester": 1,
    "courseIds": ["id1", "id2", "id3"]
  }
  ```
- **Rules:** Fails if credits < 12 or > 21, if courses don't exist or if already submitted.

### 4. View My Registration

- **Method:** `GET /registrations/myRegistration?academicYear=2026/2027&semester=1`
- **Access:** Student

### 5. Add/Drop Course

- **Method:** `POST /registrations/addCourse` OR `POST /registrations/dropCourse`
- **Access:** Student / Admin
- **Body:**
  ```json
  { "registrationId": "id_here", "courseId": "id_here" }
  ```
- **Rules:** Students can only do this if the status is `rejected` or `draft`. Admins can override.

### 6. Student Dashboard

- **Method:** `GET /dashboards/student`
- **Access:** Student
- **Response:** Profile status, active deadline, and current registration summary.

---

## 👑 Admin / Officer Actions (`/admin`, `/registrations`, `/dashboards`)

### 1. View All Students

- **Method:** `GET /admin/students`
- **Access:** Admin/Officer
- **Response:** List of all students and their assigned programmes.

### 2. Assign Programme to Student

- **Method:** `POST /admin/assignProgramme`
- **Access:** Admin/Officer
- **Body:** `{ "studentId": "id_here", "programmeId": "id_here" }`

### 3. View Pending Registrations

- **Method:** `GET /registrations/pending`
- **Access:** Admin/Officer
- **Response:** List of all `submitted` registrations with student details.

### 4. Approve Registration

- **Method:** `PATCH /registrations/:id/approve`
- **Access:** Admin/Officer

### 5. Reject Registration

- **Method:** `PATCH /registrations/:id/reject`
- **Access:** Admin/Officer
- **Body:** `{ "reason": "Missing prerequisite CS101." }` _(Required)_

### 6. Admin Dashboard

- **Method:** `GET /dashboards/admin`
- **Access:** Admin/Officer
- **Response:** Total students, pending approvals, active courses, etc.

---

## 🔔 Notifications (`/notifications`)

### 1. Get My Notifications

- **Method:** `GET /notifications`
- **Access:** Authenticated
- **Response:** Array of notifications + `unreadCount`.

### 2. Mark as Read

- **Method:** `PATCH /notifications/:id/read`
- **Access:** Authenticated

### 3. Delete Notification

- **Method:** `DELETE /notifications/:id`
- **Access:** Authenticated

---

## ⚠️ Error Handling (IMPORTANT)

If an error occurs (e.g., validation fails, unauthorized, or business logic blocked), the API will return a JSON object with this shape:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed. Please check your inputs.",
  "details": [
    { "field": "email", "message": "Please provide a valid email address." }
  ]
}
```

**Frontend Rule:** Always display the `message` field to the user. If `details` is present, map those to the specific form inputs (e.g., show the error under the email field).
