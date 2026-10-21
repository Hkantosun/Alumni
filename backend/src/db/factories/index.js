/**
 * Factory Data Generators for Alumni Tracking System
 * Provides reproducible, realistic fake entities aligned with ddd.md
 */

let userCounter = 1;
let departmentCounter = 1;
let studentNumberCounter = 2023001000;

const FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Emine', 'Ali', 'Zeynep',
  'Can', 'Elif', 'Burak', 'Selin', 'Oğuz', 'Gizem', 'Eren', 'Büşra',
  'Mert', 'Deniz', 'Kaan', 'İrem', 'Cem', 'Ezgi', 'Onur', 'Tuğçe'
];

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın',
  'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç',
  'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdoğan', 'Yavuz'
];

const COMPANIES = [
  'TechCorp Yazılım', 'InnoSoft Global', 'TrendyTech', 'DataPulse Analytics',
  'CyberShield Güvenlik', 'CloudPeak Bilişim', 'FinHub Finansal Teknolojiler',
  'SmartEdge AI Labs', 'NextGen Robotics', 'SoftMatrix'
];

const JOB_TITLES = [
  'Full Stack Geliştirici', 'Frontend Mühendisi', 'Backend Geliştirici',
  'DevOps Mühendisi', 'Veri Bilimci', 'Yapay Zekâ Araştırmacısı',
  'Ürün Yöneticisi (Product Manager)', 'Sistem Mimarı', 'Mobil Uygulama Geliştirici'
];

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Londra', 'Berlin', 'Amsterdam'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Department Factory
function departmentFactory(overrides = {}) {
  const count = departmentCounter++;
  return {
    code: `DEPT${count}`,
    name: `Mühendislik Bölümü ${count}`,
    faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
    description: `Akademik lisans ve lisansüstü eğitim sunan mühendislik bölümü.`,
    ...overrides
  };
}

// 2. User Factory
function userFactory(overrides = {}) {
  const count = userCounter++;
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const role = overrides.role || 'alumni';
  const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${count}`;
  
  return {
    email: `${emailPrefix}@alumni.edu`,
    password_hash: '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0', // standard test hash
    role,
    first_name: firstName,
    last_name: lastName,
    phone: `+90 555 ${getRandomInt(100, 999)} ${getRandomInt(10, 99)}${getRandomInt(10, 99)}`,
    profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}_${count}`,
    is_active: true,
    is_verified: true,
    ...overrides
  };
}

// 3. Alumni Profile Factory
function alumniProfileFactory(userId, departmentId, overrides = {}) {
  const graduationYear = overrides.graduation_year || getRandomInt(2015, 2024);
  const company = getRandomItem(COMPANIES);
  const title = getRandomItem(JOB_TITLES);
  const city = getRandomItem(CITIES);

  return {
    user_id: userId,
    department_id: departmentId,
    graduation_year: graduationYear,
    degree: overrides.degree || 'Bachelor',
    current_job_title: title,
    current_company: company,
    current_city: city,
    linkedin_url: `https://linkedin.com/in/user-${userId}`,
    bio: `${company} bünyesinde ${title} olarak görev almaktayım. Mezun ağındaki genç meslektaşlarıma rehberlik etmeye hazırım.`,
    available_for_mentorship: overrides.available_for_mentorship !== undefined ? overrides.available_for_mentorship : (Math.random() > 0.3),
    ...overrides
  };
}

// 4. Student Profile Factory
function studentProfileFactory(userId, departmentId, overrides = {}) {
  const studentNumber = (studentNumberCounter++).toString();
  const enrollmentYear = overrides.enrollment_year || getRandomInt(2021, 2024);
  const expectedGraduationYear = enrollmentYear + 4;

  return {
    user_id: userId,
    department_id: departmentId,
    student_number: studentNumber,
    enrollment_year: enrollmentYear,
    expected_graduation_year: expectedGraduationYear,
    degree: 'Bachelor',
    interests: 'Web Teknolojileri, Mikroservisler, Dağıtık Sistemler, Yapay Zekâ',
    career_goals: 'Yazılım geliştirme sektöründe küresel projelerde mimar olarak yer almak.',
    ...overrides
  };
}

// 5. Academic Profile Factory
function academicProfileFactory(userId, departmentId, overrides = {}) {
  const titles = ['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Arş. Gör. Dr.'];
  const rooms = ['A-201', 'B-304', 'C-108', 'D-412', 'M-215'];

  return {
    user_id: userId,
    department_id: departmentId,
    academic_title: getRandomItem(titles),
    office_location: `Mühendislik Binası Ofis ${getRandomItem(rooms)}`,
    research_areas: 'Büyük Veri Mimarileri, Makine Öğrenimi Algoritmaları, Bilgi Güvenliği',
    office_hours: 'Çarşamba 14:00 - 16:00, Cuma 10:00 - 12:00',
    ...overrides
  };
}

// 6. Job Experience Factory
function jobExperienceFactory(alumniProfileId, overrides = {}) {
  const isCurrent = overrides.is_current !== undefined ? overrides.is_current : true;
  const startYear = getRandomInt(2018, 2022);
  const startMonth = getRandomInt(1, 12).toString().padStart(2, '0');
  
  return {
    alumni_profile_id: alumniProfileId,
    company: getRandomItem(COMPANIES),
    position: getRandomItem(JOB_TITLES),
    start_date: `${startYear}-${startMonth}-01`,
    end_date: isCurrent ? null : `${startYear + 2}-06-30`,
    is_current: isCurrent,
    description: 'Büyük ölçekli web servisleri tasarımı, CI/CD süreçlerinin otomasyonu ve takım liderliği.',
    ...overrides
  };
}

// 7. Job Posting Factory
function jobPostingFactory(postedByUserId, departmentId = null, overrides = {}) {
  const types = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'];
  const title = getRandomItem(JOB_TITLES);
  const company = getRandomItem(COMPANIES);

  return {
    posted_by_user_id: postedByUserId,
    department_id: departmentId,
    title: `${title} İlanı`,
    company: company,
    location: getRandomItem(CITIES),
    job_type: getRandomItem(types),
    description: `${company} olarak dinamik ekibimize katılacak, yenilikçi projelere imza atacak yetenekli takım arkadaşları arıyoruz.`,
    application_link: `https://${company.toLowerCase().replace(/[^a-z]/g, '')}.com/careers/apply`,
    is_active: true,
    expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    ...overrides
  };
}

// 8. Mentorship Request Factory
function mentorshipRequestFactory(studentUserId, mentorAlumniId, overrides = {}) {
  const statuses = ['pending', 'accepted', 'completed'];

  return {
    student_user_id: studentUserId,
    mentor_alumni_id: mentorAlumniId,
    status: getRandomItem(statuses),
    request_message: 'Merhaba, mezun olduğunuz bölümdeki bir öğrenci olarak kariyer yolculuğunuz hakkında tavsiyelerinizi almak ve mentörlüğünüzden faydalanmak isterim.',
    response_message: 'Merhaba! Memnuniyetle yardımcı olurum, önümüzdeki hafta detayları görüşmek üzere haberleşelim.',
    ...overrides
  };
}

// 9. Event Factory
function eventFactory(createdByUserId, overrides = {}) {
  const categories = ['Kariyer', 'Etkinlik', 'Seminer', 'Akademik'];
  const locations = ['Kampüs Kültür Merkezi Amfi 1', 'Mühendislik Fakültesi Konferans Salonu', 'Online Zoom / YouTube Live', 'Merkez Kampüs Meydanı'];
  const eventDate = new Date(Date.now() + getRandomInt(3, 45) * 24 * 3600 * 1000).toISOString();

  return {
    created_by_user_id: createdByUserId,
    title: overrides.title || 'Mezun & Öğrenci Buluşması 2026',
    description: overrides.description || 'Farklı sektörlerdeki mezunlarımız ve öğrencilerimizin bir araya gelerek networking yapacağı panel ve tanışma oturumu.',
    event_date: eventDate,
    location: getRandomItem(locations),
    category: getRandomItem(categories),
    capacity: getRandomInt(50, 300),
    ...overrides
  };
}

// 10. Event RSVP Factory
function eventRsvpFactory(eventId, userId, overrides = {}) {
  const statuses = ['attending', 'maybe', 'declined'];
  return {
    event_id: eventId,
    user_id: userId,
    status: getRandomItem(statuses),
    ...overrides
  };
}

// 11. Announcement Factory
function announcementFactory(authorId, overrides = {}) {
  const categories = ['Duyuru', 'Etkinlik', 'Kariyer & İş', 'Akademik'];

  return {
    author_id: authorId,
    title: overrides.title || 'Yeni Dönem Mezun Ağı Faaliyetleri ve Destek Programı',
    content: overrides.content || 'Mezunlar Derneği ve Kariyer Merkezi iş birliğiyle hazırlanan yeni dönem staj ve mentörlük programı kayıtları başlamıştır.',
    category: getRandomItem(categories),
    is_pinned: overrides.is_pinned !== undefined ? overrides.is_pinned : (Math.random() > 0.7),
    ...overrides
  };
}

// 12. Application Factory
function applicationFactory(jobPostingId, applicantUserId, overrides = {}) {
  const statuses = ['pending', 'under_review', 'accepted', 'rejected'];
  return {
    job_posting_id: jobPostingId,
    applicant_user_id: applicantUserId,
    resume_url: `https://alumni.edu/cv/applicant_${applicantUserId}.pdf`,
    cover_letter: 'Pozisyon gereksinimlerini dikkatle inceledim. Üniversitemiz bünyesinde aldığım eğitim ve geliştirdiğim projelerle ekibinize değer katabileceğime inanıyorum.',
    status: overrides.status || getRandomItem(statuses),
    ...overrides
  };
}

module.exports = {
  departmentFactory,
  userFactory,
  alumniProfileFactory,
  studentProfileFactory,
  academicProfileFactory,
  jobExperienceFactory,
  jobPostingFactory,
  applicationFactory,
  mentorshipRequestFactory,
  eventFactory,
  eventRsvpFactory,
  announcementFactory
};
