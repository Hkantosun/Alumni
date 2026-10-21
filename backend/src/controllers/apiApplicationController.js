/**
 * ApiApplicationController - REST API Controller for Application resources
 * Direct Routes: /api/applications, /api/applications/:id
 * Nested Routes:
 *   - /api/job-postings/:jobPostingId/applications
 *   - /api/users/:userId/applications
 */

const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');

const ApiApplicationController = {
  /**
   * GET /api/applications
   * Supports:
   *   - Direct: /api/applications
   *   - Nested: /api/job-postings/:jobPostingId/applications
   *   - Nested: /api/users/:userId/applications
   */
  async getApplications(req, res) {
    try {
      const jobPostingId = req.params.jobPostingId || req.query.jobPostingId;
      const userId = req.params.userId || req.query.userId;
      const { status, sortBy = 'id', order = 'desc' } = req.query;

      const applications = await ApplicationModel.getAll({
        jobPostingId,
        userId,
        status,
        sortBy,
        order
      });

      res.json({
        count: applications.length,
        nestedContext: {
          jobPostingId: jobPostingId ? parseInt(jobPostingId, 10) : null,
          userId: userId ? parseInt(userId, 10) : null
        },
        statusFilter: status || null,
        applications
      });
    } catch (err) {
      console.error('Error in getApplications:', err);
      res.status(500).json({ error: 'Başvurular sorgulanırken hata oluştu.' });
    }
  },

  /**
   * GET /api/applications/:id (Direct Route)
   */
  async getApplicationById(req, res) {
    try {
      const applicationId = req.params.id;
      const application = await ApplicationModel.getById(applicationId);

      if (!application) {
        return res.status(404).json({
          error: `ID'si ${applicationId} olan başvuru bulunamadı.`
        });
      }

      res.json({ application });
    } catch (err) {
      console.error('Error in getApplicationById:', err);
      res.status(500).json({ error: 'Başvuru detayı sorgulanırken hata oluştu.' });
    }
  },

  /**
   * POST /api/applications (Direct or Nested)
   * If called on /api/job-postings/:jobPostingId/applications, job_posting_id is inherited.
   * If called on /api/users/:userId/applications, applicant_user_id is inherited.
   */
  async createApplication(req, res) {
    try {
      const body = req.body || {};
      const jobPostingId = req.params.jobPostingId || body.job_posting_id;
      const applicantUserId = req.params.userId || body.applicant_user_id;

      if (!jobPostingId || !applicantUserId) {
        return res.status(400).json({
          error: 'İlan ID (job_posting_id) ve Başvuran Kullanıcı ID (applicant_user_id) zorunludur.'
        });
      }

      // Check job exists
      const job = await JobPostingModel.getById(jobPostingId);
      if (!job) {
        return res.status(404).json({
          error: `ID'si ${jobPostingId} olan ilan bulunamadı.`
        });
      }

      // Check user exists
      const user = await UserModel.getById(applicantUserId);
      if (!user) {
        return res.status(404).json({
          error: `ID'si ${applicantUserId} olan kullanıcı bulunamadı.`
        });
      }

      const application = await ApplicationModel.create({
        job_posting_id: jobPostingId,
        applicant_user_id: applicantUserId,
        resume_url: body.resume_url,
        cover_letter: body.cover_letter,
        status: body.status || 'pending'
      });

      res.status(201).json({
        message: 'Başvuru başarıyla oluşturuldu.',
        application
      });
    } catch (err) {
      console.error('Error in createApplication:', err);
      if (err.code === '23505') {
        return res.status(409).json({
          error: 'Bu ilana zaten daha önce başvurdunuz. Çift başvuru yapılamaz.'
        });
      }
      res.status(500).json({ error: 'Başvuru kaydedilirken hata oluştu: ' + err.message });
    }
  },

  /**
   * PUT /api/applications/:id (Direct Route)
   */
  async updateApplication(req, res) {
    try {
      const applicationId = req.params.id;
      const updated = await ApplicationModel.update(applicationId, req.body);

      if (!updated) {
        return res.status(404).json({
          error: `ID'si ${applicationId} olan başvuru bulunamadı.`
        });
      }

      res.json({
        message: 'Başvuru başarıyla güncellendi.',
        application: updated
      });
    } catch (err) {
      console.error('Error in updateApplication:', err);
      res.status(500).json({ error: 'Başvuru güncellenirken hata oluştu.' });
    }
  },

  /**
   * PATCH /api/applications/:id (Direct Route)
   */
  async patchApplication(req, res) {
    try {
      const applicationId = req.params.id;
      const patched = await ApplicationModel.patch(applicationId, req.body);

      if (!patched) {
        return res.status(404).json({
          error: `ID'si ${applicationId} olan başvuru bulunamadı.`
        });
      }

      res.json({
        message: 'Başvuru başarıyla kısmi olarak güncellendi.',
        application: patched
      });
    } catch (err) {
      console.error('Error in patchApplication:', err);
      res.status(500).json({ error: 'Başvuru güncellenirken hata oluştu.' });
    }
  },

  /**
   * DELETE /api/applications/:id (Direct Route)
   */
  async deleteApplication(req, res) {
    try {
      const applicationId = req.params.id;
      const deleted = await ApplicationModel.delete(applicationId);

      if (!deleted) {
        return res.status(404).json({
          error: `ID'si ${applicationId} olan başvuru bulunamadı.`
        });
      }

      res.json({
        message: 'Başvuru başarıyla silindi.',
        deletedApplication: deleted
      });
    } catch (err) {
      console.error('Error in deleteApplication:', err);
      res.status(500).json({ error: 'Başvuru silinirken hata oluştu.' });
    }
  }
};

module.exports = ApiApplicationController;
