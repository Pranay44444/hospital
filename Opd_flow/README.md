# OPDFlow

## Patient Portal

### Overview

A patient-facing web app for appointment requests and symptom intake with an admin review panel and a 1:1 video call entry point.

### Tech Stack

- **Frontend**: React.js (Vite), HTML/CSS, JavaScript
- **Backend**: Node.js (Express)
- **Database**: MySQL with Prisma ORM
- **Authentication**: OAuth 2.0 (Google), Passport, express-session, express-mysql-session
- **Security & Middleware**: Helmet, CORS, express-rate-limit
- **File Handling**: Multer (up to 2 files, 5MB each)
- **Configuration**: dotenv

### Features

**Patient Portal:**
- Google sign-in with role-based access control
- Appointment request form with file uploads (up to 2 files, 5MB each)
- Symptom intake form
- 1:1 video call entry point from appointment detail view

**Admin Portal (Healthcare Providers Only):**
- Separate secure interface for doctors/admins (not publicly accessible)
- List, filter, view, and update appointment status (Pending/Reviewed/Scheduled/Rejected)
- Admin notes capability
- Accessed only through direct secure route with authentication
