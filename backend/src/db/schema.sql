-- =============================================================================
-- Alumni Tracking System - PostgreSQL Database Schema
-- Generated directly from ddd.md (Database Design Documentation)
-- =============================================================================

-- 1. departments (Bölümler)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    faculty VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. users (Temel Kullanıcı Hesabı)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('alumni', 'student', 'academic_staff', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. alumni_profiles (Mezun Profilleri)
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    graduation_year SMALLINT NOT NULL CHECK (graduation_year >= 1950),
    degree VARCHAR(50) NOT NULL DEFAULT 'Bachelor',
    current_job_title VARCHAR(150),
    current_company VARCHAR(150),
    current_city VARCHAR(100),
    linkedin_url VARCHAR(300),
    bio TEXT,
    available_for_mentorship BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. student_profiles (Öğrenci Profilleri)
CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    student_number VARCHAR(30) NOT NULL UNIQUE,
    enrollment_year SMALLINT NOT NULL,
    expected_graduation_year SMALLINT NOT NULL,
    degree VARCHAR(50) NOT NULL DEFAULT 'Bachelor',
    interests TEXT,
    career_goals TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. academic_profiles (Akademik Personel Profilleri)
CREATE TABLE IF NOT EXISTS academic_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    academic_title VARCHAR(100) NOT NULL,
    office_location VARCHAR(150),
    research_areas TEXT,
    office_hours VARCHAR(200),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. job_experiences (Kariyer ve İş Deneyimleri)
CREATE TABLE IF NOT EXISTS job_experiences (
    id SERIAL PRIMARY KEY,
    alumni_profile_id INTEGER NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT
);

-- 7. job_postings (İş ve Staj İlanları)
CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    posted_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type VARCHAR(30) NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Internship', 'Contract', 'Remote')),
    description TEXT NOT NULL,
    application_link VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- 8. mentorship_requests (Mentörlük Talepleri)
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id SERIAL PRIMARY KEY,
    student_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_alumni_id INTEGER NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    request_message TEXT NOT NULL,
    response_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 9. events (Etkinlikler)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    capacity INTEGER CHECK (capacity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 10. event_rsvps (Etkinlik Katılım Durumları)
CREATE TABLE IF NOT EXISTS event_rsvps (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'declined')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);

-- 11. announcements (Duyurular)
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- İndeksler (Performance Optimization Indexes)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_alumni_dept_year ON alumni_profiles(department_id, graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_mentorship ON alumni_profiles(available_for_mentorship) WHERE available_for_mentorship = TRUE;
CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_dept ON job_postings(department_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- =============================================================================
-- Başlangıç Verileri (Seed Data)
-- =============================================================================
INSERT INTO departments (code, name, faculty, description) VALUES
('CENG', 'Bilgisayar Mühendisliği', 'Mühendislik Fakültesi', 'Yazılım, Yapay Zekâ ve Bilgisayar Bilimleri Bölümü'),
('EEE', 'Elektrik-Elektronik Mühendisliği', 'Mühendislik Fakültesi', 'Elektronik, Haberleşme ve Güç Sistemleri'),
('IE', 'Endüstri Mühendisliği', 'Mühendislik Fakültesi', 'Optimizasyon ve Süreç Yönetimi')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, is_verified) VALUES
('admin@alumni.edu', '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0', 'admin', 'Sistem', 'Yöneticisi', TRUE, TRUE),
('ahmet.yilmaz@alumni.edu', '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0', 'alumni', 'Ahmet', 'Yılmaz', TRUE, TRUE),
('ayse.demir@student.edu', '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0', 'student', 'Ayşe', 'Demir', TRUE, TRUE),
('prof.mehmet@academic.edu', '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0', 'academic_staff', 'Mehmet', 'Öztürk', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO alumni_profiles (user_id, department_id, graduation_year, degree, current_job_title, current_company, current_city, available_for_mentorship)
SELECT u.id, d.id, 2020, 'Bachelor', 'Kıdemli Yazılım Mühendisi', 'Tech Solutions A.Ş.', 'İstanbul', TRUE
FROM users u, departments d
WHERE u.email = 'ahmet.yilmaz@alumni.edu' AND d.code = 'CENG'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, department_id, student_number, enrollment_year, expected_graduation_year, degree, interests)
SELECT u.id, d.id, '2023001042', 2023, 2027, 'Bachelor', 'Full Stack Web Geliştirme, Bulut Bilişim'
FROM users u, departments d
WHERE u.email = 'ayse.demir@student.edu' AND d.code = 'CENG'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO academic_profiles (user_id, department_id, academic_title, office_location, research_areas)
SELECT u.id, d.id, 'Prof. Dr.', 'Mühendislik Binası B-302', 'Veri Tabanı Mimarisi, Dağıtık Sistemler'
FROM users u, departments d
WHERE u.email = 'prof.mehmet@academic.edu' AND d.code = 'CENG'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO announcements (author_id, title, content, category, is_pinned)
SELECT u.id, '🎓 2026 Geleneksel Mezunlar Günü ve Pilav Günü', 'Tüm mezunlarımızı ve akademik personelimizi kampüsümüzde düzenlenecek 2026 Mezunlar Günü etkinliğimize davet ediyoruz.', 'Etkinlik', TRUE
FROM users u WHERE u.email = 'admin@alumni.edu'
ON CONFLICT DO NOTHING;
