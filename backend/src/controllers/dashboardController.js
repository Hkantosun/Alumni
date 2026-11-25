/**
 * DashboardController - Role-Specific User Workspace (/dashboard)
 */

const db = require('../db/db');
const UserModel = require('../models/userModel');
const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const AnnouncementModel = require('../models/announcementModel');
const DashboardViews = require('../views/dashboardViews');

const DashboardController = {
  async renderDashboard(req, res, next) {
    try {
      const user = await UserModel.getById(req.user.id);
      if (!user) return res.redirect('/login');

      const roleProfile = await UserModel.getRoleProfile(user);
      const role = String(user.role || '').toLowerCase();

      let myApplications = [];
      let myJobPostings = [];
      let availableMentors = [];
      let mentorshipRequests = [];
      let recentAnnouncements = [];

      if (role === 'student') {
        const [apps, mentorsRes, reqsRes] = await Promise.all([
          ApplicationModel.getByApplicantUserId(user.id),
          db.query(`
            SELECT ap.id AS alumni_profile_id, ap.current_job_title, ap.current_company,
                   d.code AS department_code, u.first_name || ' ' || u.last_name AS name
            FROM alumni_profiles ap
            JOIN users u ON ap.user_id = u.id
            LEFT JOIN departments d ON ap.department_id = d.id
            WHERE ap.available_for_mentorship = TRUE AND u.is_active = TRUE
            ORDER BY u.first_name ASC;
          `),
          db.query(`
            SELECT mr.id, mr.status, mr.request_message,
                   u.first_name || ' ' || u.last_name AS mentor_name,
                   ap.current_company AS mentor_company
            FROM mentorship_requests mr
            JOIN alumni_profiles ap ON mr.mentor_alumni_id = ap.id
            JOIN users u ON ap.user_id = u.id
            WHERE mr.student_user_id = $1
            ORDER BY mr.created_at DESC;
          `, [user.id])
        ]);
        myApplications = apps;
        availableMentors = mentorsRes.rows;
        mentorshipRequests = reqsRes.rows;
      } else if (role === 'alumni') {
        myJobPostings = await JobPostingModel.getByUserId(user.id);
        if (roleProfile) {
          const reqsRes = await db.query(`
            SELECT mr.id, mr.status, mr.request_message,
                   u.first_name || ' ' || u.last_name AS student_name,
                   u.email AS student_email
            FROM mentorship_requests mr
            JOIN users u ON mr.student_user_id = u.id
            WHERE mr.mentor_alumni_id = $1
            ORDER BY mr.created_at DESC;
          `, [roleProfile.id]);
          mentorshipRequests = reqsRes.rows;
        }
      } else if (role === 'academic_staff') {
        recentAnnouncements = await AnnouncementModel.getAll({ sortBy: 'created_at', order: 'desc' });
      }

      res.send(DashboardViews.renderDashboard({
        user,
        roleProfile,
        myApplications,
        myJobPostings,
        availableMentors,
        mentorshipRequests,
        recentAnnouncements,
        msg: req.query.msg || null,
        err: req.query.err || null
      }));
    } catch (err) {
      next(err);
    }
  },

  async createMentorshipRequest(req, res, next) {
    try {
      const mentorAlumniId = parseInt(req.body.mentor_alumni_id, 10);
      const message = (req.body.request_message || '').trim();
      if (isNaN(mentorAlumniId) || !message) {
        return res.redirect(`/dashboard?err=${encodeURIComponent('Mentör ve talep mesajı zorunludur.')}`);
      }

      await db.query(
        `INSERT INTO mentorship_requests (student_user_id, mentor_alumni_id, status, request_message, created_at, updated_at)
         VALUES ($1, $2, 'pending', $3, NOW(), NOW());`,
        [req.user.id, mentorAlumniId, message]
      );
      return res.redirect(`/dashboard?msg=${encodeURIComponent('Mentörlük talebiniz gönderildi.')}`);
    } catch (err) {
      next(err);
    }
  },

  async respondMentorshipRequest(req, res, next) {
    try {
      const requestId = parseInt(req.params.id, 10);
      const status = String(req.body.status || '').toLowerCase();
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.redirect(`/dashboard?err=${encodeURIComponent('Geçersiz mentörlük durumu.')}`);
      }

      const { rows } = await db.query(
        `UPDATE mentorship_requests mr
         SET status = $1, updated_at = NOW()
         FROM alumni_profiles ap
         WHERE mr.id = $2 AND mr.mentor_alumni_id = ap.id AND ap.user_id = $3
         RETURNING mr.id;`,
        [status, requestId, req.user.id]
      );

      if (rows.length === 0) {
        return res.redirect(`/dashboard?err=${encodeURIComponent('Talep bulunamadı veya yetkiniz yok.')}`);
      }
      return res.redirect(`/dashboard?msg=${encodeURIComponent(`Mentörlük talebi #${requestId} '${status}' olarak güncellendi.`)}`);
    } catch (err) {
      next(err);
    }
  },

  async toggleMentorshipAvailability(req, res, next) {
    try {
      const { rows } = await db.query(
        `UPDATE alumni_profiles
         SET available_for_mentorship = NOT available_for_mentorship, updated_at = NOW()
         WHERE user_id = $1
         RETURNING available_for_mentorship;`,
        [req.user.id]
      );
      if (rows.length === 0) {
        return res.redirect(`/dashboard?err=${encodeURIComponent('Mezun profili bulunamadı.')}`);
      }
      return res.redirect(`/dashboard?msg=${encodeURIComponent('Mentörlük durumunuz güncellendi.')}`);
    } catch (err) {
      next(err);
    }
  },

  async createAnnouncement(req, res, next) {
    try {
      const title = (req.body.title || '').trim();
      const content = (req.body.content || '').trim();
      const category = (req.body.category || 'Akademik').trim();
      if (!title || !content) {
        return res.redirect(`/dashboard?err=${encodeURIComponent('Başlık ve içerik zorunludur.')}`);
      }
      await AnnouncementModel.create({
        author_id: req.user.id,
        title,
        content,
        category,
        is_pinned: false
      });
      return res.redirect(`/dashboard?msg=${encodeURIComponent('Duyurunuz yayınlandı.')}`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = DashboardController;
