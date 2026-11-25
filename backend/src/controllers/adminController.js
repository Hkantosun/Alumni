/**
 * AdminController - Protected Administrative Operations (/admin)
 */

const db = require('../db/db');
const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const AnnouncementModel = require('../models/announcementModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const AdminViews = require('../views/adminViews');

const VALID_ROLES = ['alumni', 'student', 'academic_staff', 'admin'];
const VALID_APP_STATUSES = ['pending', 'under_review', 'accepted', 'rejected', 'withdrawn'];

function redirectWithMsg(res, msg) {
  return res.redirect(`/admin?msg=${encodeURIComponent(msg)}`);
}

function redirectWithErr(res, err) {
  return res.redirect(`/admin?err=${encodeURIComponent(err)}`);
}

const AdminController = {
  async renderDashboard(req, res, next) {
    try {
      const [users, departments, announcements, jobPostings, applications] = await Promise.all([
        UserModel.getAll({ sortBy: 'id', order: 'asc' }),
        DepartmentModel.getAll({ sortBy: 'id', order: 'asc' }),
        AnnouncementModel.getAll({ sortBy: 'id', order: 'desc' }),
        JobPostingModel.getAll({ sortBy: 'id', order: 'desc' }),
        ApplicationModel.getAll({ sortBy: 'id', order: 'desc' })
      ]);

      res.send(AdminViews.renderDashboard({
        currentUser: req.user,
        users,
        departments,
        announcements,
        jobPostings,
        applications,
        msg: req.query.msg || null,
        err: req.query.err || null
      }));
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      const role = String(req.body.role || '').trim().toLowerCase();
      if (!VALID_ROLES.includes(role)) {
        return redirectWithErr(res, 'Geçersiz rol değeri.');
      }

      const { rows } = await db.query(
        'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, role;',
        [role, targetId]
      );
      if (rows.length === 0) {
        return redirectWithErr(res, 'Kullanıcı bulunamadı.');
      }
      return redirectWithMsg(res, `Kullanıcı #${targetId} rolü '${role}' olarak güncellendi.`);
    } catch (err) {
      next(err);
    }
  },

  async toggleUserActive(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (targetId === Number(req.user.id)) {
        return redirectWithErr(res, 'Kendi aktif oturum hesabınızı pasif yapamazsınız.');
      }

      const { rows } = await db.query(
        'UPDATE users SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING is_active;',
        [targetId]
      );
      if (rows.length === 0) {
        return redirectWithErr(res, 'Kullanıcı bulunamadı.');
      }
      return redirectWithMsg(res, `Kullanıcı #${targetId} durumu '${rows[0].is_active ? 'Aktif' : 'Pasif'}' yapıldı.`);
    } catch (err) {
      next(err);
    }
  },

  async toggleUserVerified(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      const { rows } = await db.query(
        'UPDATE users SET is_verified = NOT is_verified, updated_at = NOW() WHERE id = $1 RETURNING is_verified;',
        [targetId]
      );
      if (rows.length === 0) {
        return redirectWithErr(res, 'Kullanıcı bulunamadı.');
      }
      return redirectWithMsg(res, `Kullanıcı #${targetId} doğrulama durumu '${rows[0].is_verified ? 'Onaylı' : 'Onaysız'}' yapıldı.`);
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (targetId === Number(req.user.id)) {
        return redirectWithErr(res, 'Kendi hesabınızı silemezsiniz.');
      }
      const deleted = await UserModel.delete(targetId);
      if (!deleted) {
        return redirectWithErr(res, 'Kullanıcı bulunamadı.');
      }
      return redirectWithMsg(res, `Kullanıcı #${targetId} (${deleted.email}) silindi.`);
    } catch (err) {
      return redirectWithErr(res, `Kullanıcı silinemedi: ${err.message}`);
    }
  },

  async createDepartment(req, res) {
    try {
      const { code, name, faculty, description } = req.body;
      if (!code || !name || !faculty) {
        return redirectWithErr(res, 'Bölüm kodu, adı ve fakülte zorunludur.');
      }
      const dept = await DepartmentModel.create({ code, name, faculty, description });
      return redirectWithMsg(res, `Bölüm '${dept.code} — ${dept.name}' eklendi.`);
    } catch (err) {
      return redirectWithErr(res, `Bölüm eklenemedi: ${err.message}`);
    }
  },

  async deleteDepartment(req, res) {
    try {
      const deleted = await DepartmentModel.delete(req.params.id);
      if (!deleted) return redirectWithErr(res, 'Bölüm bulunamadı.');
      return redirectWithMsg(res, `Bölüm '${deleted.code}' silindi.`);
    } catch (err) {
      return redirectWithErr(res, `Bölüm silinemedi (bağlı profiller olabilir): ${err.message}`);
    }
  },

  async createAnnouncement(req, res) {
    try {
      const { title, content, category } = req.body;
      if (!title || !content) {
        return redirectWithErr(res, 'Duyuru başlığı ve içeriği zorunludur.');
      }
      const ann = await AnnouncementModel.create({
        author_id: req.user.id,
        title: title.trim(),
        content: content.trim(),
        category: (category || 'Sistem').trim(),
        is_pinned: true
      });
      return redirectWithMsg(res, `Duyuru #${ann.id} yayınlandı.`);
    } catch (err) {
      return redirectWithErr(res, `Duyuru oluşturulamadı: ${err.message}`);
    }
  },

  async toggleAnnouncementPin(req, res, next) {
    try {
      const { rows } = await db.query(
        'UPDATE announcements SET is_pinned = NOT is_pinned, updated_at = NOW() WHERE id = $1 RETURNING is_pinned;',
        [parseInt(req.params.id, 10)]
      );
      if (rows.length === 0) return redirectWithErr(res, 'Duyuru bulunamadı.');
      return redirectWithMsg(res, `Duyuru #${req.params.id} sabitleme durumu güncellendi.`);
    } catch (err) {
      next(err);
    }
  },

  async deleteAnnouncement(req, res, next) {
    try {
      await db.query('DELETE FROM announcements WHERE id = $1;', [parseInt(req.params.id, 10)]);
      return redirectWithMsg(res, `Duyuru #${req.params.id} silindi.`);
    } catch (err) {
      next(err);
    }
  },

  async toggleJobPostingActive(req, res, next) {
    try {
      const { rows } = await db.query(
        'UPDATE job_postings SET is_active = NOT is_active WHERE id = $1 RETURNING is_active;',
        [parseInt(req.params.id, 10)]
      );
      if (rows.length === 0) return redirectWithErr(res, 'İlan bulunamadı.');
      return redirectWithMsg(res, `İlan #${req.params.id} durumu '${rows[0].is_active ? 'Yayında' : 'Pasif'}' yapıldı.`);
    } catch (err) {
      next(err);
    }
  },

  async deleteJobPosting(req, res, next) {
    try {
      await db.query('DELETE FROM job_postings WHERE id = $1;', [parseInt(req.params.id, 10)]);
      return redirectWithMsg(res, `İlan #${req.params.id} silindi.`);
    } catch (err) {
      next(err);
    }
  },

  async updateApplicationStatus(req, res, next) {
    try {
      const status = String(req.body.status || '').trim().toLowerCase();
      if (!VALID_APP_STATUSES.includes(status)) {
        return redirectWithErr(res, 'Geçersiz başvuru durumu.');
      }
      const { rows } = await db.query(
        'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id;',
        [status, parseInt(req.params.id, 10)]
      );
      if (rows.length === 0) return redirectWithErr(res, 'Başvuru bulunamadı.');
      return redirectWithMsg(res, `Başvuru #${req.params.id} durumu '${status}' olarak güncellendi.`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminController;
