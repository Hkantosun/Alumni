# 🎓 Alumni Tracking System

> A full-stack web application developed for a Web Programming course, designed to connect and manage alumni, current students, and academic staff within a single unified platform.
---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Who Uses This System](#-who-uses-this-system)
- [The One-Command Rule](#-the-one-command-rule)
- [API Documentation & Swagger UI](#-api-documentation--swagger-ui)
- [Tech Stack](#-tech-stack)
- [Database Design Documentation (ddd.md)](#-database-design-documentation-dddmd)
- [Database Migrations, Factories & Seeds](#-database-migrations-factories--seeds)
- [MVC Architecture](#-mvc-architecture)
- [Middleware & Guardian Architecture](#-middleware--guardian-architecture)
- [Logging System & Error Tracking](#-logging-system--error-tracking)
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

## 📚 API Documentation & Swagger UI

Interactive OpenAPI (Swagger UI) documentation is available at:

👉 **`http://localhost:3000/api/swagger`**

### 🚀 Available REST Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/` | System root health check |
| **GET** | `/api/health` | Health check returning JSON status |
| **GET** | `/api/swagger` | Interactive Swagger API Documentation |
| **GET** | `/api/users` | List all users (supports `sortBy` and `order` query params) |
| **POST** | `/api/users` | Create/Save new user data |
| **GET** | `/api/users/:id` | Get specific user details by ID |
| **PUT** | `/api/users/:id` | Full update user data by ID |
| **PATCH** | `/api/users/:id` | Partial update user data by ID |
| **DELETE** | `/api/users/:id` | Delete specific user by ID |
| **GET** | `/api/departments` | List all departments (Direct REST Route) |
| **POST** | `/api/departments` | Create new department (Direct REST Route) |
| **GET** | `/api/departments/:id` | Get department details by ID (Direct REST Route) |
| **GET** | `/api/departments/:departmentId/job-postings` | List jobs belonging to a department (**Nested REST Route**) |
| **POST** | `/api/departments/:departmentId/job-postings` | Create job under a department (**Nested REST Route**) |
| **GET** | `/api/users/:userId/job-postings` | List jobs posted by a specific user (**Nested REST Route**) |
| **POST** | `/api/users/:userId/job-postings` | Create job authored by a user (**Nested REST Route**) |
| **GET** | `/api/job-postings` | List all job & internship postings (Direct REST Route) |
| **POST** | `/api/job-postings` | Create job posting (Direct REST Route) |
| **GET** | `/api/job-postings/:id` | Get job posting by ID (Direct REST Route) |
| **PUT** | `/api/job-postings/:id` | Full update job posting (Direct REST Route) |
| **DELETE** | `/api/job-postings/:id` | Delete job posting (Direct REST Route) |
| **GET** | `/api/applications` | List all applications (Direct REST Route) |
| **POST** | `/api/applications` | Submit new application (Direct REST Route) |
| **GET** | `/api/applications/:id` | Get application details (Direct REST Route) |
| **PUT** | `/api/applications/:id` | Update application status/details (Direct REST Route) |
| **DELETE** | `/api/applications/:id` | Delete application (Direct REST Route) |
| **GET** | `/api/job-postings/:jobPostingId/applications` | List applications for a job (**Nested REST Route**) |
| **POST** | `/api/job-postings/:jobPostingId/applications` | Submit application for a job (**Nested REST Route**) |
| **GET** | `/api/users/:userId/applications` | List applications submitted by a user (**Nested REST Route**) |
| **POST** | `/api/users/:userId/applications` | Submit application on behalf of a user (**Nested REST Route**) |
| **GET** | `/api/announcements` | List announcements (Direct REST Route) |
| **GET** | `/departments` | Departments web listing (Direct Web Page) |
| **GET** | `/departments/:departmentId/job-postings` | Jobs for department (**Nested Web Page**) |
| **GET** | `/job-postings` | Job postings web listing (Direct Web Page) |
| **GET** | `/users/:userId/job-postings` | Jobs by user (**Nested Web Page**) |
| **GET** | `/applications` | Applications web listing (Direct Web Page) |
| **GET** | `/job-postings/:jobPostingId/applications` | Applications for job (**Nested Web Page**) |
| **GET** | `/users/:userId/applications` | Applications by user (**Nested Web Page**) |
| **GET** | `/Hello` | Hello World greeting |
| **GET** | `/Hello/:name` | Personalized greeting |
| **GET** | `/sum/:number1/:number2` | Sum two numbers |

---


## 🛠 Tech Stack

### Backend
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- Handles REST API endpoints, business logic, and communication with the database

### Database
- **PostgreSQL 16 (Dockerized)**
- Containerized relational database (`alumni_db` running on port `5433:5432` in Docker Compose)
- Full relational persistence active via `pg` connection pool; CRUD interfaces query PostgreSQL tables directly as specified in `ddd.md`

### Frontend
- **HTML5 & CSS3**
- **Bootstrap / Tailwind CSS** for responsive, modern UI styling

### DevOps & Tooling
- **Docker & Docker Compose** — containerization of services, required for the one-command startup rule
- **Git & GitHub** — version control and collaboration
- **Antigravity** — development environment used to build the project
- **.env files** — used for environment variables (e.g., PORT, DATABASE_URL), excluded from version control via `.gitignore`; sample provided in `.example.env`

---

## 🗄️ Database Design Documentation (`ddd.md`)

Comprehensive database schema and relational entity specifications are documented in **[`ddd.md`](./ddd.md)**:

- 📊 **Entity Relationship (ER) Diagram:** Complete Mermaid diagram illustrating all entities, cardinality, and relationships.
- 📋 **Relational Tables & Attributes:**
  - `departments` (Academic departments and faculties)
  - `users` (Core authentication and user identity)
  - `alumni_profiles`, `student_profiles`, `academic_profiles` (Role-specific 1:1 profile extensions)
  - `job_experiences` & `job_postings` (Careers, past roles, and job/internship opportunities with explicit business rules: `title` required & max 120 chars, `company` required, `city` required & explicit, `short_description` required, `wage` required & explicit)
  - `mentorship_requests` (Mentorship connections and statuses)
  - `events` & `event_rsvps` (Alumni/student events and attendance tracking)
  - `announcements` (Departmental and general announcements)
- 🔒 **Integrity & Optimization:** Foreign key cascades, check constraints, 3NF normalization, and recommended database indexes.

> *Note:* The application's CRUD models (`userModel.js`, `announcementModel.js`) are fully connected to PostgreSQL (`users` and `announcements` tables) matching the `ddd.md` specification.

---

## 🔄 Database Migrations, Factories & Seeds

The project includes an enterprise-grade database migration and seeding workflow configured for PostgreSQL 16:

### 1. ⚡ Migrations (`backend/src/db/migrations/`)
Seven versioned migrations manage schema evolution idempotently with transactional `up` and `down` rollback capabilities:
- `001_create_departments.js`: Academic departments table
- `002_create_users.js`: Core users authentication & roles table
- `003_create_profile_extensions.js`: 1:1 profile extensions (`alumni_profiles`, `student_profiles`, `academic_profiles`)
- `004_create_careers.js`: `job_experiences` and `job_postings`
- `005_create_mentorship_requests.js`: Student-alumni mentorship connections
- `006_create_events_and_announcements.js`: Events, RSVPs, and system announcements
- `007_create_indexes.js`: Performance optimization indexes

### 2. 🏭 Factories (`backend/src/db/factories/index.js`)
Programmatic model factories generate realistic, domain-specific mock entities (Turkish names, university departments, tech companies, job titles, dates).

### 3. 🌱 Seeders (`backend/src/db/seed.js`)
Populates the database with consistent test data (5 departments, 21 users across all 4 roles, profiles, work histories, job postings, mentorship requests, events with RSVPs, announcements).

### 🛠️ Migration & Seeding CLI Commands:
```bash
# Apply all pending database migrations
docker exec -it alumni_backend npm run migrate

# Rollback the most recently applied migration
docker exec -it alumni_backend npm run migrate:rollback

# Populate database with factory seed data
docker exec -it alumni_backend npm run db:seed

# Wipe existing records and cleanly seed all tables
docker exec -it alumni_backend npm run db:seed:clean

# Run complete database setup (migrate + clean seed)
docker exec -it alumni_backend npm run db:setup
```

---

## 🏛 MVC Architecture

The **Alumni Tracking System** follows the **Model-View-Controller (MVC)** architectural pattern to separate data persistence, presentation logic, and request routing/business rules.

```
       +-------------------------------------------------------+
       |                     CLIENT / USER                     |
       +-------------------------------------------------------+
                                   |
                         HTTP Requests / Responses
                                   v
       +-------------------------------------------------------+
       |                   CONTROLLER LAYER                    |
       |  Express Route Handlers (app.get, app.post, etc.)    |
       |  Input Validation, Sorting & Query Logic              |
       +-------------------------------------------------------+
                      /                         \
        Reads & Updates                          Renders & Formats
                     v                             v
+--------------------------+             +--------------------------+
|       MODEL LAYER        |             |        VIEW LAYER        |
|  PostgreSQL Database     |             |  JSON API Responses      |
|  User & Announcement     |             |  Swagger UI & Web Views  |
+--------------------------+             +--------------------------+
```

### 1. 🗄️ Model Layer
- **Responsibility:** Encapsulates data access, business entities, validation rules, and persistence operations directly against PostgreSQL.
- **Implementation in Project:**
  - **User Model Module (`backend/src/models/userModel.js`):** PostgreSQL data model querying the `users` table via `db.query` for full asynchronous CRUD operations (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`), with automatic field mapping.
  - **Announcement Model Module (`backend/src/models/announcementModel.js`):** PostgreSQL announcement data model querying the `announcements` table joined with `users` for author metadata, providing full asynchronous CRUD operations (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`).
  - **Domain Entities:** User and Announcement relational models supporting **Alumni**, **Students**, and **Academic Staff**.

### 2. 👁️ View Layer
- **Responsibility:** Formats and presents information back to the client or user interface.
- **Implementation in Project:**
  - **User View Module (`backend/src/views/userViews.js`):** Dedicated HTML template generator rendering the User Listing page (`renderUserListPage`) for `GET /users -> listing` and the User Created confirmation page (`renderUserCreatedPage`) for `POST /users -> creating`.
  - **JSON REST API View:** Formats output data structures as JSON responses for client consumption (e.g., list of users, health status payload).
  - **Swagger UI (`/api/swagger`):** Interactive OpenAPI documentation powered by `swagger-ui-express` for visualizing and testing endpoints visually.

### 3. 🎮 Controller Layer
- **Responsibility:** Receives incoming client HTTP requests, validates payloads, orchestrates business logic, interacts with the Model layer, and selects the View representation to return.
- **Implementation in Project:**
  - **`ApiUserController` (`backend/src/controllers/apiUserController.js`):** Dedicated REST API controller handling JSON requests, HTTP status codes, payload validations, and CRUD operations (`getUsers`, `getUserById`, `createUser`, `updateUser`, `patchUser`, `deleteUser`).
  - **`UserController` (`backend/src/controllers/userController.js`):** Dedicated Web controller rendering HTML user list pages (`GET /users -> listing`), user creation actions (`POST /users -> creating`), user detail cards (`/users/:id`), and main pages (`/home`, `/about`).
  - **Express Route Registration (`backend/src/index.js`):** Connects incoming endpoints to the respective Controller methods.

---

### 📁 Directory, Folder & File Structure (MVC Mapping)

The project tree structure and the mapping of each directory/file to its corresponding MVC layer is detailed below:

```
Alumni/
├── ddd.md                       # Database Design Documentation (ER diagram & schemas)
├── docker-compose.yml           # [DevOps] Container orchestration for Express API
├── .example.env                 # [Config Template] Example environment configuration
├── README.md                    # Project documentation & MVC architecture
├── implementation_plan.md       # Development roadmap & feature specifications
├── LICENSE                      # Open-source license file
├── logs/                        # [Logging] Persistent log directory mounted from Docker
│   ├── error.logs               # Formatted error logs (4xx, 5xx, database and syntax errors)
│   └── combined.logs            # Complete request access logs with timestamps and response times
└── backend/                     # Backend application directory
    ├── Dockerfile               # [DevOps] Container build configuration for Express service
    ├── package.json             # Node.js dependencies & scripts (express, swagger-ui-express, cors)
    └── src/                     # Application source code
        ├── index.js             # [Application Entry Point] Configures Express app, Swagger UI, routes & guardians
        ├── db/                  # Database infrastructure (Migrations, Factories, Seeds)
        │   ├── db.js            # PostgreSQL pool client module
        │   ├── migrate.js       # Transactional migration runner with rollback capability
        │   ├── schema.sql       # Pure PostgreSQL DDL generated from ddd.md
        │   ├── seed.js          # Factory-driven database seeder
        │   ├── factories/       # Entity factories (User, Department, Profiles, Events, etc.)
        │   │   └── index.js
        │   └── migrations/      # Versioned migration steps (001 to 007 with up/down)
        ├── middlewares/         # Express custom middleware layer
        │   ├── loggerMiddleware.js    # [Middleware] Terminal request logger with ANSI colored status codes
        │   ├── notFoundGuardian.js    # [Middleware] 404 Guardian catching invalid routes and redirecting to /404
        │   └── serverErrorGuardian.js # [Middleware] 5xx Guardian global error handler with explicit reasons
        ├── utils/               # Utility helper modules
        │   └── fileLogger.js          # [Utility] Asynchronous file logger persisting to logs/error.logs
        ├── models/              # Data model abstractions (PostgreSQL connected)
        │   ├── userModel.js         # [Model] PostgreSQL User Model querying users table via db pool
        │   ├── announcementModel.js # [Model] PostgreSQL Announcement Model querying announcements table via db pool
        │   ├── departmentModel.js   # [Model] PostgreSQL Department Model
        │   ├── jobPostingModel.js   # [Model] PostgreSQL Job Posting Model (direct + nested relationship queries)
        │   └── applicationModel.js  # [Model] PostgreSQL Application Model (direct + nested relationship queries)
        ├── views/               # Presentation and HTML rendering templates
        │   ├── homeView.js          # [View] Istanbul University YBS home and about page view
        │   ├── notFoundView.js      # [View] Generic 404 Error Page view with reasons and navigation
        │   ├── userViews.js         # [View] User Views module (renderUserListPage, etc.)
        │   ├── announcementViews.js # [View] Announcement Views module (renderAnnouncementListPage, etc.)
        │   ├── departmentViews.js   # [View] Department Views module (renderDepartmentListPage, etc.)
        │   ├── jobPostingViews.js   # [View] Job Posting Views module (direct & nested views)
        │   └── applicationViews.js  # [View] Application Views module (direct & nested views)
        ├── controllers/         # Request handling and controller logic
        │   ├── apiUserController.js          # [Controller] REST API Controller for /api/users
        │   ├── userController.js             # [Controller] Web Controller for /users HTML pages
        │   ├── apiAnnouncementController.js  # [Controller] REST API Controller for /api/announcements
        │   ├── announcementController.js     # [Controller] Web Controller for /announcements HTML pages
        │   ├── apiDepartmentController.js    # [Controller] REST API Controller for /api/departments (direct & nested)
        │   ├── departmentController.js       # [Controller] Web Controller for /departments HTML pages (direct & nested)
        │   ├── apiJobPostingController.js    # [Controller] REST API Controller for /api/job-postings (direct & nested)
        │   ├── jobPostingController.js       # [Controller] Web Controller for /job-postings HTML pages (direct & nested)
        │   ├── apiApplicationController.js   # [Controller] REST API Controller for /api/applications (direct & nested)
        │   └── applicationController.js      # [Controller] Web Controller for /applications HTML pages (direct & nested)
        └── routes/              # Express Router definitions
            ├── apiUserRoutes.js         # [Router] Express Router for /api/users endpoints
            ├── userRoutes.js            # [Router] Express Router for /users, /home, /about web routes
            ├── apiAnnouncementRoutes.js # [Router] Express Router for /api/announcements endpoints
            ├── announcementRoutes.js    # [Router] Express Router for /announcements web routes
            ├── apiDepartmentRoutes.js   # [Router] Express Router for /api/departments endpoints
            ├── departmentRoutes.js      # [Router] Express Router for /departments web routes
            ├── apiJobPostingRoutes.js   # [Router] Express Router for /api/job-postings (mergeParams: true)
            ├── jobPostingRoutes.js      # [Router] Express Router for /job-postings (mergeParams: true)
            ├── apiApplicationRoutes.js  # [Router] Express Router for /api/applications (mergeParams: true)
            └── applicationRoutes.js     # [Router] Express Router for /applications (mergeParams: true)
```

#### 📌 File-to-Layer Mapping Table:

| Path / File | MVC Component | Description & Responsibilities |
|---|---|---|
| **`backend/src/middlewares/loggerMiddleware.js`** | **Middleware** | Intercepts HTTP traffic and prints method, path, color-coded status codes, and execution duration to terminal and access log. |
| **`backend/src/middlewares/notFoundGuardian.js`** | **Middleware (Guardian)** | Intercepts unmatched requests, records failure to `logs/error.logs`, redirects web clients to `/404`, and returns JSON for API clients. |
| **`backend/src/middlewares/serverErrorGuardian.js`** | **Middleware (Guardian)** | Global Express 4-argument error handler intercepting 5xx/database/syntax errors, formatting explicit reasons, and persisting to `logs/error.logs`. |
| **`backend/src/utils/fileLogger.js`** | **Utility** | Asynchronous disk logging service managing `logs/error.logs` and `logs/combined.logs`. |
| **`backend/src/views/notFoundView.js`** | **View** | Generates the Generic 404 HTML Error Page with error code, explicit reason box, requested URL pill, and quick navigation. |
| **`backend/src/views/homeView.js`** | **View** | Generates the Istanbul University YBS Home and About pages with metrics, navigation tabs, and historical visuals. |
| **`logs/error.logs`** | **Log Store** | Persistent host-mounted log file storing all 4xx, 5xx, database constraint, and application error traces. |
| **`backend/src/models/userModel.js`** | **Model** | Connects to PostgreSQL `users` table via `db.query` pool client and provides asynchronous CRUD functions (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`). |
| **`backend/src/models/announcementModel.js`** | **Model** | Connects to PostgreSQL `announcements` table via `db.query` pool client and provides asynchronous CRUD functions (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`). |
| **`backend/src/views/userViews.js`** | **View** | Generates HTML page templates for User Listing (`GET /users`), Details, Edit Form, and CRUD response pages. |
| **`backend/src/views/announcementViews.js`** | **View** | Generates HTML page templates for Announcement Listing (`GET /announcements`), Details, Edit Form, and CRUD response pages. |
| **`backend/src/controllers/apiUserController.js`** | **Controller (API)** | REST API Controller handling JSON API requests, status codes, payload validation, and API CRUD operations for Users. |
| **`backend/src/controllers/userController.js`** | **Controller (Web)** | Web Controller handling HTML page rendering for Users (`GET /users`, `POST /users`, `/users/:id`, `/home`, `/about`). |
| **`backend/src/controllers/apiAnnouncementController.js`** | **Controller (API)** | REST API Controller handling JSON API requests, status codes, payload validation, and API CRUD operations for Announcements. |
| **`backend/src/controllers/announcementController.js`** | **Controller (Web)** | Web Controller handling HTML page rendering for Announcements (`GET /announcements`, `POST /announcements`, `/announcements/:id`). |
| **`backend/src/routes/apiUserRoutes.js`** | **Router** | Express Router mapping `/api/users` REST endpoints directly to `ApiUserController`. |
| **`backend/src/routes/userRoutes.js`** | **Router** | Express Router mapping `/users`, `/home`, `/about` page routes directly to `UserController`. |
| **`backend/src/routes/apiAnnouncementRoutes.js`** | **Router** | Express Router mapping `/api/announcements` REST endpoints directly to `ApiAnnouncementController`. |
| **`backend/src/routes/announcementRoutes.js`** | **Router** | Express Router mapping `/announcements` page routes directly to `AnnouncementController`. |
| **`backend/src/routes/apiDepartmentRoutes.js`** | **Router** | Express Router mapping direct `/api/departments` and nested `/api/departments/:departmentId/job-postings` endpoints. |
| **`backend/src/routes/departmentRoutes.js`** | **Router** | Express Router mapping direct `/departments` and nested `/departments/:departmentId/job-postings` web routes. |
| **`backend/src/routes/apiJobPostingRoutes.js`** | **Router** | Express Router (`mergeParams: true`) mapping direct `/api/job-postings` and nested `/api/departments/:departmentId/job-postings`, `/api/users/:userId/job-postings`. |
| **`backend/src/routes/jobPostingRoutes.js`** | **Router** | Express Router (`mergeParams: true`) mapping direct `/job-postings` and nested web routes. |
| **`backend/src/routes/apiApplicationRoutes.js`** | **Router** | Express Router (`mergeParams: true`) mapping direct `/api/applications` and nested `/api/job-postings/:jobPostingId/applications`, `/api/users/:userId/applications`. |
| **`backend/src/routes/applicationRoutes.js`** | **Router** | Express Router (`mergeParams: true`) mapping direct `/applications` and nested web routes. |
| **`backend/src/index.js`** | **Entry Point** | Initializes Express server, configures Swagger UI OpenAPI specs, and mounts router modules. |
| **`docker-compose.yml`** | **Infrastructure & Database** | Manages PostgreSQL database container (`alumni_db`) and backend container (`alumni_backend`). |
| **`backend/package.json`** | **Infrastructure & Dependencies** | Configures dependencies for Express routing, PostgreSQL client (`pg`), and Swagger UI. |
| **`backend/Dockerfile`** | **Infrastructure** | Containerizes the Express controller and API server environment. |
| **`backend/src/db/migrate.js`** | **Database Migration Runner** | Executes and rolls back versioned SQL migrations (`001` to `007`). |
| **`backend/src/db/factories/`** | **Test Data Factories** | Entity mock factories producing consistent domain data for all models. |
| **`backend/src/db/seed.js`** | **Database Seeder** | Populates database with structured test records (departments, users, profiles, jobs, events). |
| **`.env`** | **Configuration** | Local environment file (git-ignored) containing database credentials and ports. |
| **`.example.env`** | **Configuration Template** | Template environment variables file to guide setting up `.env`. |
| **`ddd.md`** | **Model & Architecture** | Comprehensive Database Design Documentation containing Mermaid ER diagram, table schemas, and data dictionary. |

---

## 🛡️ Middleware & Guardian Architecture

The backend pipeline includes a multi-layered middleware and error-handling system designed to ensure robustness, observability, and graceful failure handling across all client types:

```
[Incoming Request]
        |
        v
+-------------------------------------------------------+
| 1. Logger Middleware (loggerMiddleware.js)            |
|    - Computes high-resolution request duration        |
|    - Prints ANSI color-coded log lines to terminal   |
|    - Appends access log entries to logs/combined.logs |
+-------------------------------------------------------+
        |
        v
+-------------------------------------------------------+
| 2. Core Middlewares (cors, express.json, urlencoded)  |
+-------------------------------------------------------+
        |
        v
+-------------------------------------------------------+
| 3. Application Controllers & Nested Routers           |
|    - REST API Endpoints (/api/*)                      |
|    - HTML Web Views & Actions (Users, Jobs, etc.)     |
|    - /404 Dedicated Generic Error Route               |
+-------------------------------------------------------+
        |
        |---> (Unmatched Route / Invalid Path)
        |           |
        |           v
        |     +-------------------------------------------------------+
        |     | 4. 404 Guardian Middleware (notFoundGuardian.js)      |
        |     |    - Computes explicit reason for failure             |
        |     |    - Logs error event to logs/error.logs              |
        |     |    - Returns JSON for REST API requests               |
        |     |    - Redirects (302) web requests to /404             |
        |     +-------------------------------------------------------+
        |
        |---> (Unhandled Exception / next(err))
                    |
                    v
              +-------------------------------------------------------+
              | 5. 5xx Guardian Middleware (serverErrorGuardian.js)   |
              |    - Express 4-argument error handler (err,req,res,nxt)|
              |    - Detects PostgreSQL errors (23505, 23503, etc.)   |
              |    - Formats explicit reason & persists to error.logs |
              |    - Returns 500 JSON (API) or styled HTML (Web)      |
              +-------------------------------------------------------+
```

### 1. 🔍 Terminal Request Logger (`backend/src/middlewares/loggerMiddleware.js`)
- Intercepts every incoming HTTP request and records execution duration using `process.hrtime()`.
- Prints colored terminal lines:
  - `2xx`: Green (Success)
  - `3xx`: Cyan (Redirects)
  - `4xx`: Yellow (Client Errors)
  - `5xx`: Red (Server Failures)
- Example Terminal Output:
  ```text
  [2026-11-11 07:38:21] GET /api/health 200 - 2.10ms
  [2026-11-11 07:38:21] GET /api/unknown-test-404 404 - 3.12ms
  [2026-11-11 07:38:21] GET /api/test-500 500 - 4.92ms
  ```

### 2. 🛡️ 404 Guardian Middleware & Generic 404 Page
- **`notFoundGuardian.js`:** Intercepts invalid routes and missing resources.
  - Automatically identifies whether an API endpoint or a web page was requested.
  - Generates an explicit **Reason** for the failure.
  - **Redirects** web/browser requests with HTTP 302 to the generic `/404?requestedUrl=...&reason=...` page.
  - Returns structured JSON for API clients (`/api/*`).
  - Writes the error to `logs/error.logs`.
- **Generic 404 View (`backend/src/views/notFoundView.js` & `GET /404`):**
  - Styled with Istanbul University YBS theme, displaying the requested invalid URL, failure reason, and quick navigation links.

### 3. 🚨 5xx Guardian Middleware (`backend/src/middlewares/serverErrorGuardian.js`)
- Standard Express 4-argument global error handler `(err, req, res, next)`.
- Categorizes runtime and database errors into human-readable reasons:
  - `23505`: Database Unique Constraint Violation (duplicate entry)
  - `23503`: Database Foreign Key Violation (missing referenced entity)
  - `23502`: Database Not-Null Violation (required column missing)
  - `ECONNREFUSED` / `08*`: PostgreSQL Connection Failure
  - `SyntaxError` / `entity.parse.failed`: Invalid JSON body syntax
- Persists error traces and reasons to `logs/error.logs`.
- Renders an interactive `🛡️ 5xx Guardian` HTML error card for browsers and structured JSON for APIs.

---

## 🪵 Logging System & Error Tracking

The application features a disk-persisted logging subsystem managed via `backend/src/utils/fileLogger.js`:

### 📂 Log Directory & Files (`logs/`)
- **`logs/error.logs`:** Dedicated error audit log. Every 4xx not-found, 5xx internal exception, database constraint failure, and syntax error is formatted and written here with timestamp, method, path, status, failure reason, and stack trace:
  ```text
  [2026-11-11 07:38:21] [STATUS 404] GET /api/unknown-test-404
    Reason : The requested API endpoint 'GET /api/unknown-test-404' does not exist on this server. Please verify the URL path, HTTP method, and query parameters.
  --------------------------------------------------------------------------------
  [2026-11-11 07:38:21] [STATUS 500] GET /api/test-500
    Reason : Simulated internal server exception to verify 5xx Guardian Middleware response.
    Details: Simulated database or server failure
    Stack  : Error: Simulated database or server failure
             at /app/src/index.js:634:15
  --------------------------------------------------------------------------------
  ```
- **`logs/combined.logs`:** Combined request log tracking timestamp, method, URL, status, and duration for all traffic.

### 🐳 Docker Volume Mount
The host's `./logs` directory is mapped to the container's `/app/logs` in `docker-compose.yml`:
```yaml
services:
  backend:
    volumes:
      - ./backend/src:/app/src
      - ./logs:/app/logs
```
This guarantees that all logs written by the container are persisted on the host machine and can be observed in real time:
```bash
# Live stream container terminal logs
docker compose logs -f backend

# Live stream error logs from host
tail -f logs/error.logs
```

---

## 🧭 Project Philosophy

This project is not about being told exactly what to build — it's about being told **what the system must accomplish**, and then defending **how** it was built. Every week, the working code itself is the argument for the technical decisions made:

- The **core features** are fixed by the instructor.
- The **data model, language, database, interface, naming, and structure** are entirely up to the developer.
- Progress is demonstrated through **working code**, not documentation alone.

---

## 📝 Developer Notes

This project is developed incrementally throughout the semester, with weekly milestones that must run as working code. The `docker compose up` command is expected to remain functional and up to date as the project evolves, since it will be used as the primary method of running and grading the final submission.
