# 🎓 Alumni Tracking System

> A full-stack web application developed for a Web Programming course, designed to connect and manage alumni, current students, and academic staff within a single unified platform.
---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Who Uses This System](#-who-uses-this-system)
- [The One-Command Rule](#-the-one-command-rule)
- [Tech Stack](#-tech-stack)
- [Core Requirements](#-core-requirements-defined-by-the-instructor)
- [Additional Features](#-additional-features-developer-choice)
- [Project Philosophy](#-project-philosophy)
- [Developer Notes](#-developer-notes)

---

## 📖 About the Project

The **Alumni Tracking System** is a web application built as part of a Web Programming course. Its core purpose is to record, update, and track information about people who have graduated from an educational institution — including contact details, graduation year, department, and current career/job status.

Beyond alumni, the system is designed to also include:

- 🎓 **Alumni** — graduates of the institution
- 📚 **Current (full-time) students** — students who are still actively enrolled and have not yet graduated
- 👩‍🏫 **Academic staff** — faculty members and advisors associated with the institution

By bringing these three groups together, the system aims to provide an integrated infrastructure for maintaining connections between an institution's past, present, and academic community.

---

## 👥 Who Uses This System

| Role | Description | Example Data Tracked |
|---|---|---|
| **Alumni** | Graduated students | Graduation year, department, current job/company, contact info |
| **Students** | Currently enrolled students | Enrollment year, department, expected graduation date |
| **Academic Staff** | Faculty and advisors | Department, title/position, courses or students supervised |

---
🌟 Key Features

The platform is designed to go beyond simple record-keeping and act as a communication bridge between alumni, current students, and academic staff.

👤 Profile & Records
User registration and login for alumni, students, and academic staff (with role-based access)
Editable personal profiles (contact info, department, graduation year/expected graduation year, job/position)
Search and filter users by department, graduation year, role, or job title

💬 Communication & Networking
Direct messaging between alumni and current students (e.g. for mentorship or advice)
Ability for students to reach out to alumni working in a specific company or field
Discussion boards / comment sections for department- or topic-based conversations
Notification system for new messages or connection requests

🤝 Mentorship & Career Support
Alumni can offer mentorship to current students
Alumni can share job openings, internships, or career opportunities
Students can browse alumni by industry/company for networking purposes

📅 Events & Announcements
Academic staff or admins can post events (career days, alumni meetups, seminars)
Alumni and students can view and RSVP to upcoming events

📊 Admin / Academic Staff Panel
Academic staff can view statistics about alumni (e.g. employment rate, popular industries)
Manage/approve new user registrations
Manage department and event data

The exact scope of these features can be adjusted based on the instructor's core requirements and available development time — the list above represents the intended full feature set of the platform.

## ⚙️ The One-Command Rule

This project follows one non-negotiable rule that applies from week one until the final submission:

> **The entire system must be able to start with a single command.**

```bash
docker compose up
```

- This command does **not** need to work perfectly in the early weeks — it is the target the project is built toward.
- Every service (backend, frontend, and database) must ultimately be containerized and orchestrated through Docker Compose.
- The final evaluation of the project will be performed by running this exact command.

Because of this rule, Docker-compatibility is considered from the very beginning of development, not added at the end.

---

## 🛠 Tech Stack

### Backend
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- Handles REST API endpoints, business logic, and communication with the database

### Database
- **PostgreSQL**
- Relational database, well suited for modeling relationships between alumni, students, academic staff, departments, and job history

### Frontend
- **HTML5 & CSS3**
- **Bootstrap / Tailwind CSS** for responsive, modern UI styling

### DevOps & Tooling
- **Docker & Docker Compose** — containerization of all services, required for the one-command startup rule
- **Git & GitHub** — version control and collaboration
- **Antigravity** — development environment used to build the project
- **.env files** — used for environment variables (e.g., database credentials), excluded from version control via `.gitignore`

---

## 🧭 Project Philosophy

This project is not about being told exactly what to build — it's about being told **what the system must accomplish**, and then defending **how** it was built. Every week, the working code itself is the argument for the technical decisions made:

- The **core features** are fixed by the instructor.
- The **data model, language, database, interface, naming, and structure** are entirely up to the developer.
- Progress is demonstrated through **working code**, not documentation alone.

---

## 📝 Developer Notes

This project is developed incrementally throughout the semester, with weekly milestones that must run as working code. The `docker compose up` command is expected to remain functional and up to date as the project evolves, since it will be used as the primary method of running and grading the final submission.
