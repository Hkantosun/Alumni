const { pool } = require('./db');
const {
  departmentFactory,
  userFactory,
  alumniProfileFactory,
  studentProfileFactory,
  academicProfileFactory,
  jobExperienceFactory,
  jobPostingFactory,
  mentorshipRequestFactory,
  eventFactory,
  eventRsvpFactory,
  announcementFactory
} = require('./factories');

async function seedDatabase({ clean = false } = {}) {
  const client = await pool.connect();
  console.log('🌱 Starting Database Seeding with Factories...');

  try {
    await client.query('BEGIN');

    if (clean) {
      console.log('🧹 Cleaning existing tables (TRUNCATE CASCADE)...');
      await client.query(`
        TRUNCATE TABLE 
          event_rsvps,
          events,
          announcements,
          mentorship_requests,
          job_postings,
          job_experiences,
          academic_profiles,
          student_profiles,
          alumni_profiles,
          users,
          departments
        RESTART IDENTITY CASCADE;
      `);
    }

    // 1. Seed Departments
    const departmentDefs = [
      { code: 'CENG', name: 'Bilgisayar Mühendisliği', faculty: 'Mühendislik Fakültesi', description: 'Yazılım, Yapay Zekâ ve Bilgisayar Bilimleri.' },
      { code: 'EEE', name: 'Elektrik-Elektronik Mühendisliği', faculty: 'Mühendislik Fakültesi', description: 'Elektronik, Haberleşme, Sinyal İşleme ve Güç Sistemleri.' },
      { code: 'IE', name: 'Endüstri Mühendisliği', faculty: 'Mühendislik Fakültesi', description: 'Sistem Analizi, Optimizasyon ve Tedarik Zinciri.' },
      { code: 'ME', name: 'Makine Mühendisliği', faculty: 'Mühendislik Fakültesi', description: 'Termodinamik, Robotik ve Mekatronik Tasarım.' },
      { code: 'BA', name: 'İşletme ve Yönetim Bilimleri', faculty: 'İktisadi ve İdari Bilimler Fakültesi', description: 'Girişimcilik, Finans ve Stratejik Yönetim.' }
    ];

    const departmentIds = [];
    for (const def of departmentDefs) {
      const data = departmentFactory(def);
      const res = await client.query(`
        INSERT INTO departments (code, name, faculty, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
      `, [data.code, data.name, data.faculty, data.description]);
      departmentIds.push(res.rows[0].id);
    }
    console.log(`✅ Seeded ${departmentIds.length} departments.`);

    // 2. Seed Admin User
    const adminUser = userFactory({
      email: 'admin@alumni.edu',
      first_name: 'Sistem',
      last_name: 'Yöneticisi',
      role: 'admin'
    });
    const { rows: [adminRow] } = await client.query(`
      INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image_url, is_active, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name
      RETURNING id;
    `, [adminUser.email, adminUser.password_hash, adminUser.role, adminUser.first_name, adminUser.last_name, adminUser.phone, adminUser.profile_image_url, adminUser.is_active, adminUser.is_verified]);
    const adminId = adminRow.id;

    // 3. Seed Academic Staff Users & Profiles
    const academicIds = [];
    for (let i = 0; i < 4; i++) {
      const deptId = departmentIds[i % departmentIds.length];
      const user = userFactory({ role: 'academic_staff' });
      const { rows: [uRow] } = await client.query(`
        INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image_url, is_active, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `, [user.email, user.password_hash, user.role, user.first_name, user.last_name, user.phone, user.profile_image_url, user.is_active, user.is_verified]);

      if (uRow) {
        academicIds.push(uRow.id);
        const profile = academicProfileFactory(uRow.id, deptId);
        await client.query(`
          INSERT INTO academic_profiles (user_id, department_id, academic_title, office_location, research_areas, office_hours)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id) DO NOTHING;
        `, [profile.user_id, profile.department_id, profile.academic_title, profile.office_location, profile.research_areas, profile.office_hours]);
      }
    }
    console.log(`✅ Seeded ${academicIds.length} academic staff with academic profiles.`);

    // 4. Seed Alumni Users & Profiles + Experiences
    const alumniUserIds = [];
    const alumniProfileIds = [];
    for (let i = 0; i < 8; i++) {
      const deptId = departmentIds[i % departmentIds.length];
      const user = userFactory({ role: 'alumni' });
      const { rows: [uRow] } = await client.query(`
        INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image_url, is_active, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `, [user.email, user.password_hash, user.role, user.first_name, user.last_name, user.phone, user.profile_image_url, user.is_active, user.is_verified]);

      if (uRow) {
        alumniUserIds.push(uRow.id);
        const profile = alumniProfileFactory(uRow.id, deptId, { available_for_mentorship: i % 2 === 0 });
        const { rows: [profRow] } = await client.query(`
          INSERT INTO alumni_profiles (user_id, department_id, graduation_year, degree, current_job_title, current_company, current_city, linkedin_url, bio, available_for_mentorship)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (user_id) DO UPDATE SET current_company = EXCLUDED.current_company
          RETURNING id;
        `, [profile.user_id, profile.department_id, profile.graduation_year, profile.degree, profile.current_job_title, profile.current_company, profile.current_city, profile.linkedin_url, profile.bio, profile.available_for_mentorship]);

        if (profRow) {
          alumniProfileIds.push(profRow.id);
          // Seed past & current experiences
          const exp1 = jobExperienceFactory(profRow.id, { is_current: true });
          const exp2 = jobExperienceFactory(profRow.id, { is_current: false });
          await client.query(`
            INSERT INTO job_experiences (alumni_profile_id, company, position, start_date, end_date, is_current, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7), ($8, $9, $10, $11, $12, $13, $14);
          `, [
            exp1.alumni_profile_id, exp1.company, exp1.position, exp1.start_date, exp1.end_date, exp1.is_current, exp1.description,
            exp2.alumni_profile_id, exp2.company, exp2.position, exp2.start_date, exp2.end_date, exp2.is_current, exp2.description
          ]);
        }
      }
    }
    console.log(`✅ Seeded ${alumniUserIds.length} alumni with profiles and job experiences.`);

    // 5. Seed Student Users & Profiles
    const studentUserIds = [];
    for (let i = 0; i < 8; i++) {
      const deptId = departmentIds[i % departmentIds.length];
      const user = userFactory({ role: 'student' });
      const { rows: [uRow] } = await client.query(`
        INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image_url, is_active, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
        RETURNING id;
      `, [user.email, user.password_hash, user.role, user.first_name, user.last_name, user.phone, user.profile_image_url, user.is_active, user.is_verified]);

      if (uRow) {
        studentUserIds.push(uRow.id);
        const profile = studentProfileFactory(uRow.id, deptId);
        await client.query(`
          INSERT INTO student_profiles (user_id, department_id, student_number, enrollment_year, expected_graduation_year, degree, interests, career_goals)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (user_id) DO NOTHING;
        `, [profile.user_id, profile.department_id, profile.student_number, profile.enrollment_year, profile.expected_graduation_year, profile.degree, profile.interests, profile.career_goals]);
      }
    }
    console.log(`✅ Seeded ${studentUserIds.length} students with student profiles.`);

    // 6. Seed Job Postings
    for (let i = 0; i < 6; i++) {
      const posterId = alumniUserIds[i % alumniUserIds.length] || adminId;
      const job = jobPostingFactory(posterId);
      await client.query(`
        INSERT INTO job_postings (posted_by_user_id, title, company, location, job_type, description, application_link, is_active, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [job.posted_by_user_id, job.title, job.company, job.location, job.job_type, job.description, job.application_link, job.is_active, job.expires_at]);
    }
    console.log(`✅ Seeded 6 job postings.`);

    // 7. Seed Mentorship Requests
    for (let i = 0; i < 5; i++) {
      const sId = studentUserIds[i % studentUserIds.length];
      const mId = alumniProfileIds[i % alumniProfileIds.length];
      if (sId && mId) {
        const req = mentorshipRequestFactory(sId, mId);
        await client.query(`
          INSERT INTO mentorship_requests (student_user_id, mentor_alumni_id, status, request_message, response_message)
          VALUES ($1, $2, $3, $4, $5);
        `, [req.student_user_id, req.mentor_alumni_id, req.status, req.request_message, req.response_message]);
      }
    }
    console.log(`✅ Seeded 5 mentorship requests.`);

    // 8. Seed Events & RSVPs
    const eventIds = [];
    const eventTitles = [
      '🎓 2026 Geleneksel Mezunlar Günü & Pilav Şenliği',
      '💼 Teknoloji ve Yapay Zekâ Kariyer Zirvesi',
      '🤝 Mezun-Öğrenci Mentörlük Buluşması ve Panel',
      '🚀 Start-up Kurucusu Mezunlarımızla Girişimcilik Söyleşisi'
    ];

    for (const title of eventTitles) {
      const creatorId = academicIds[0] || adminId;
      const ev = eventFactory(creatorId, { title });
      const { rows: [eRow] } = await client.query(`
        INSERT INTO events (created_by_user_id, title, description, event_date, location, category, capacity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `, [ev.created_by_user_id, ev.title, ev.description, ev.event_date, ev.location, ev.category, ev.capacity]);

      if (eRow) {
        eventIds.push(eRow.id);
        // Add random RSVPs from students and alumni
        const attendees = [...studentUserIds.slice(0, 4), ...alumniUserIds.slice(0, 3)];
        for (const uId of attendees) {
          const rsvp = eventRsvpFactory(eRow.id, uId);
          await client.query(`
            INSERT INTO event_rsvps (event_id, user_id, status)
            VALUES ($1, $2, $3)
            ON CONFLICT (event_id, user_id) DO NOTHING;
          `, [rsvp.event_id, rsvp.user_id, rsvp.status]);
        }
      }
    }
    console.log(`✅ Seeded ${eventIds.length} events with multiple RSVPs.`);

    // 9. Seed Announcements
    const announcementDefs = [
      { title: '🎓 2026 Mezunlar Buluşması Tarihleri Açıklandı', category: 'Etkinlik', is_pinned: true },
      { title: '💼 Mezunlar İçin Staj & İş İlanları Portalı Yayında', category: 'Kariyer & İş', is_pinned: true },
      { title: '🤝 2026-2027 Güz Dönemi Mentörlük Başvuruları Başladı', category: 'Duyuru', is_pinned: false },
      { title: '📚 Lisansüstü Burs ve Araştırma Görevlisi İlanları', category: 'Akademik', is_pinned: false }
    ];

    for (const def of announcementDefs) {
      const ann = announcementFactory(adminId, def);
      await client.query(`
        INSERT INTO announcements (author_id, title, content, category, is_pinned)
        VALUES ($1, $2, $3, $4, $5);
      `, [ann.author_id, ann.title, ann.content, ann.category, ann.is_pinned]);
    }
    console.log(`✅ Seeded ${announcementDefs.length} announcements.`);

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  const shouldClean = process.argv.includes('--clean');
  seedDatabase({ clean: shouldClean })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
