# 🎓 Alumni Tracking System

> A full-stack web application developed for a Web Programming course, designed to connect and manage alumni, current students, and academic staff within a single unified platform.
---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Who Uses This System](#-who-uses-this-system)
- [The One-Command Rule](#-the-one-command-rule)
- [Tech Stack](#-tech-stack)
- [MVC Architecture](#-mvc-architecture)
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
|  In-Memory / PostgreSQL  |             |  JSON API Responses      |
|  User & Alumni Schema    |             |  Swagger UI & Web Views  |
+--------------------------+             +--------------------------+
```

### 1. 🗄️ Model Layer
- **Responsibility:** Represents data models, database state, entity rules, and persistence operations.
- **Implementation in Project:**
  - **User Model Module (`backend/src/models/userModel.js`):** Database-less in-memory data model encapsulating entity state and full CRUD logic (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`).
  - **Database Persistence:** Prepared for **PostgreSQL** integration (`alumni_db` running on port `5433:5432` in Docker Compose) using the `pg` database driver.
  - **Domain Entities:** User data models covering **Alumni**, **Students**, and **Academic Staff**.

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
├── docker-compose.yml           # [Model/DevOps] Container orchestration (PostgreSQL DB & Express API)
├── .env                         # [Model/Config] Database credentials and server environment configuration
├── README.md                    # Project documentation & MVC architecture
├── implementation_plan.md       # Development roadmap & feature specifications
├── LICENSE                      # Open-source license file
└── backend/                     # Backend application directory
    ├── Dockerfile               # [Controller/DevOps] Container build configuration for Express service
    ├── package.json             # Node.js dependencies & scripts (express, pg, swagger-ui-express, cors)
    └── src/                     # Application source code
        ├── index.js             # [Application Entry Point] Configures Express app, Swagger UI & mounts routes
        ├── models/              # Data model abstractions
        │   └── userModel.js     # [Model] Database-less User Model containing CRUD functions
        ├── views/               # Presentation and HTML rendering templates
        │   └── userViews.js     # [View] User Views module (renderUserListPage & renderUserCreatedPage)
        ├── controllers/         # Request handling and controller logic
        │   ├── apiUserController.js  # [Controller] REST API Controller (JSON responses & API CRUD)
        │   └── userController.js     # [Controller] Web Controller (GET /users listing & POST /users creating)
        └── routes/              # Express Router definitions
            ├── apiUserRoutes.js # [Router] Express Router for /api/users endpoints
            └── userRoutes.js    # [Router] Express Router for /users, /home, /about web routes
```

#### 📌 File-to-Layer Mapping Table:

| Path / File | MVC Component | Description & Responsibilities |
|---|---|---|
| **`backend/src/models/userModel.js`** | **Model** | Encapsulates in-memory User entity storage and provides CRUD functions (`getAll`, `getById`, `create`, `update`, `patch`, `delete`, `count`). |
| **`backend/src/views/userViews.js`** | **View** | Generates HTML page templates for User Listing (`GET /users -> listing`) and Creation Confirmation (`POST /users -> creating`). |
| **`backend/src/controllers/apiUserController.js`** | **Controller (API)** | REST API Controller handling JSON API requests, status codes, payload validation, and API CRUD operations. |
| **`backend/src/controllers/userController.js`** | **Controller (Web)** | Web Controller handling HTML page rendering (`GET /users -> listing`, `POST /users -> creating`, `/users/:id`, `/home`, `/about`). |
| **`backend/src/routes/apiUserRoutes.js`** | **Router** | Express Router mapping `/api/users` REST endpoints directly to `ApiUserController`. |
| **`backend/src/routes/userRoutes.js`** | **Router** | Express Router mapping `/users`, `/home`, `/about` page routes directly to `UserController`. |
| **`backend/src/index.js`** | **Entry Point** | Initializes Express server, configures Swagger UI OpenAPI specs, and mounts router modules. |
| **`docker-compose.yml`** | **Model & Infrastructure** | Manages persistent PostgreSQL database container (`alumni_db`) and backend container (`alumni_backend`). |
| **`backend/package.json`** | **Infrastructure & Dependencies** | Configures dependencies for Express routing, PostgreSQL client (`pg`), and Swagger UI. |
| **`backend/Dockerfile`** | **Infrastructure** | Containerizes the Express controller and API server environment. |
| **`.env`** | **Model & Configuration** | Stores database URLs, ports, and secret configurations for data connectivity. |

---

## 🧭 Project Philosophy

This project is not about being told exactly what to build — it's about being told **what the system must accomplish**, and then defending **how** it was built. Every week, the working code itself is the argument for the technical decisions made:

- The **core features** are fixed by the instructor.
- The **data model, language, database, interface, naming, and structure** are entirely up to the developer.
- Progress is demonstrated through **working code**, not documentation alone.

---

## 📝 Developer Notes

This project is developed incrementally throughout the semester, with weekly milestones that must run as working code. The `docker compose up` command is expected to remain functional and up to date as the project evolves, since it will be used as the primary method of running and grading the final submission.
