# OPDFlow

A full-stack hospital management platform for outpatient (OPD) appointments. Patients book consultations, doctors manage their queue, and admins control doctor onboarding — all from one unified web app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v7 |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | Google OAuth 2.0 + Email/Password (JWT) |
| Styling | CSS custom properties (design token system) |

---

## Features

### Patients
- Google OAuth or email/password sign-in
- Browse and search approved doctors by specialization
- Book appointments (no payment required in current mode)
- View appointment history and statuses
- Request appointment rescheduling
- Message doctors directly via in-app chat

### Doctors
- Apply to become a doctor via an in-app registration form
- Dedicated Doctor Panel to manage incoming appointments
- Accept, reject, or complete appointments
- Propose or respond to reschedule requests
- Message patients from the appointment view

### Admin
- Bootstrap admin accounts via `ADMIN_EMAILS` env variable (no separate signup)
- Review pending doctor applications — approve, reject (with reason), or suspend
- View platform statistics (total users, doctors, appointments)

### Messaging
- Real-time-style chat between patients and doctors (8-second polling)
- Unread badge on the navbar (30-second polling)
- Conversation list sidebar with last-message preview

---

## Project Structure

```
hospital-1/
├── backend/               # Express REST API
│   ├── middleware/
│   │   ├── auth.js        # JWT verification
│   │   └── admin.js       # Admin role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Message.js
│   │   ├── Prescription.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js        # Login, register, Google OAuth
│   │   ├── doctor.js      # Doctor profile CRUD
│   │   ├── admin.js       # Doctor approval management
│   │   ├── appointments.js
│   │   ├── messages.js
│   │   ├── prescriptions.js
│   │   └── reviews.js
│   └── index.js
└── Opd_flow/              # React frontend (Vite)
    └── src/
        ├── components/    # Navbar, shared UI
        ├── context/       # Toast notifications
        ├── pages/         # All route-level pages
        └── services/
            └── api.js     # All API calls (authAPI, appointmentAPI, adminAPI, messageAPI)
```

---

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud project with OAuth 2.0 credentials

---

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/opdflow
JWT_SECRET=your_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Comma-separated list of emails that get admin role on login/register
ADMIN_EMAILS=you@example.com
```

```bash
node index.js
```

---

### Frontend

```bash
cd Opd_flow
npm install
```

Create `Opd_flow/.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Auth Flow

1. **Google OAuth** — click "Sign in with Google"; the backend verifies the token via `google-auth-library` and issues a JWT.
2. **Email/Password** — register at `/register`, sign in at `/login`; bcrypt-hashed passwords, JWT issued on success.
3. **Admin role** — any account whose email is in `ADMIN_EMAILS` gets `role: 'admin'` automatically on first login. No separate admin signup.

---

## Doctor Approval Flow

```
User fills form at /doctor/register
        ↓
Doctor document created  (status: pending)
User.doctorApplicationStatus = 'pending'
        ↓
Admin reviews at /admin → approves or rejects
        ↓
On approval:
  Doctor.status = 'approved'
  User.isDoctor = true
  User.doctorApplicationStatus = undefined
        ↓
Doctor can now access /doctor-panel
```

Rejected users may reapply; the existing Doctor document is updated in place rather than creating a duplicate.

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Email/password registration |
| POST | `/api/auth/login` | — | Email/password login |
| POST | `/api/auth/google` | — | Google OAuth token exchange |
| GET | `/api/doctor/list` | — | List approved doctors |
| GET | `/api/doctor/profile/:id` | — | Doctor public profile |
| POST | `/api/doctor/register` | User | Submit doctor application |
| GET | `/api/doctor/my-profile` | User | Own doctor profile |
| PUT | `/api/doctor/update` | Doctor | Update profile fields |
| POST | `/api/doctor/timings` | Doctor | Set availability timings |
| GET | `/api/admin/doctors/pending` | Admin | Pending applications |
| POST | `/api/admin/doctors/:id/approve` | Admin | Approve doctor |
| POST | `/api/admin/doctors/:id/reject` | Admin | Reject with reason |
| POST | `/api/admin/doctors/:id/suspend` | Admin | Suspend doctor |
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/appointments` | User | User's appointments |
| POST | `/api/appointments` | User | Book appointment |
| POST | `/api/appointments/:id/reschedule` | User/Doctor | Propose reschedule |
| POST | `/api/appointments/:id/reschedule/respond` | User/Doctor | Accept/reject reschedule |
| GET | `/api/messages/conversations` | User | Conversation list |
| GET | `/api/messages/with/:userId` | User | Fetch messages with user |
| POST | `/api/messages` | User | Send message |
| GET | `/api/messages/unread-count` | User | Unread message count |

---

## Environment Variables Summary

| Variable | Where | Description |
|---|---|---|
| `PORT` | backend | Server port (default 8080) |
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret for signing JWTs |
| `GOOGLE_CLIENT_ID` | backend + frontend | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | backend | OAuth client secret |
| `ADMIN_EMAILS` | backend | Comma-separated admin emails |
| `VITE_API_URL` | frontend | Backend base URL |
| `VITE_GOOGLE_CLIENT_ID` | frontend | OAuth client ID (Vite env) |
