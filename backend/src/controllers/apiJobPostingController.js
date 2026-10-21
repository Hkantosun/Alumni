/**
 * ApiJobPostingController - REST API Controller for Job Posting resources
 * Supports both Direct routes (/api/job-postings) and Nested routes:
 *   - /api/departments/:departmentId/job-postings
 *   - /api/users/:userId/job-postings
 */

const JobPostingModel = require('../models/jobPostingModel');
const DepartmentModel = require('../models/departmentModel');
const UserModel = require('../models/userModel');

const ApiJobPostingController = {
  /**
   * GET /api/job-postings
   * Supports:
   *   - Direct: /api/job-postings
   *   - Nested: /api/departments/:departmentId/job-postings
   *   - Nested: /api/users/:userId/job-postings
   */
  async getJobPostings(req, res) {
    try {
      const departmentId = req.params.departmentId || req.query.departmentId;
      const userId = req.params.userId || req.query.userId;
      const { sortBy = 'id', order = 'desc', jobType, isActive } = req.query;

      const jobPostings = await JobPostingModel.getAll({
        departmentId,
        userId,
        jobType,
        isActive,
        sortBy,
        order
      });

      res.json({
        count: jobPostings.length,
        nestedContext: {
          departmentId: departmentId ? parseInt(departmentId, 10) : null,
          userId: userId ? parseInt(userId, 10) : null
        },
        sortBy,
        order,
        jobPostings
      });
    } catch (err) {
      console.error('Error in getJobPostings:', err);
      res.status(500).json({ error: 'İlanlar veritabanından sorgulanırken hata oluştu.' });
    }
  },

  /**
   * GET /api/job-postings/:id (Direct Route)
   */
  async getJobPostingById(req, res) {
    try {
      const jobId = req.params.id;
      const job = await JobPostingModel.getById(jobId);

      if (!job) {
        return res.status(404).json({
          error: `ID'si ${jobId} olan ilan bulunamadı.`
        });
      }

      res.json({ jobPosting: job });
    } catch (err) {
      console.error('Error in getJobPostingById:', err);
      res.status(500).json({ error: 'İlan detayı sorgulanırken hata oluştu.' });
    }
  },

  /**
   * POST /api/job-postings (Direct or Nested)
   * If called on nested route /api/departments/:departmentId/job-postings, departmentId is inherited.
   * If called on nested route /api/users/:userId/job-postings, posted_by_user_id is inherited.
   */
  async createJobPosting(req, res) {
    try {
      const body = req.body || {};
      const departmentId = req.params.departmentId || body.department_id || null;
      const userId = req.params.userId || body.posted_by_user_id;

      if (!userId || !body.title || !body.company) {
        return res.status(400).json({
          error: 'Yayınlayan kullanıcı ID (posted_by_user_id), ilan başlığı (title) ve şirket (company) zorunludur.'
        });
      }

      // Check if user exists
      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          error: `ID'si ${userId} olan kullanıcı bulunamadı.`
        });
      }

      // If departmentId specified, check if department exists
      if (departmentId) {
        const dept = await DepartmentModel.getById(departmentId);
        if (!dept) {
          return res.status(404).json({
            error: `ID'si ${departmentId} olan bölüm bulunamadı.`
          });
        }
      }

      const newJob = await JobPostingModel.create({
        posted_by_user_id: userId,
        department_id: departmentId,
        title: body.title,
        company: body.company,
        location: body.location,
        job_type: body.job_type,
        description: body.description,
        application_link: body.application_link,
        is_active: body.is_active !== undefined ? body.is_active : true,
        expires_at: body.expires_at
      });

      res.status(201).json({
        message: 'İlan başarıyla oluşturuldu.',
        jobPosting: newJob
      });
    } catch (err) {
      console.error('Error in createJobPosting:', err);
      res.status(500).json({ error: 'İlan kaydedilirken hata oluştu.' });
    }
  },

  /**
   * PUT /api/job-postings/:id (Direct Route)
   */
  async updateJobPosting(req, res) {
    try {
      const jobId = req.params.id;
      const updated = await JobPostingModel.update(jobId, req.body);

      if (!updated) {
        return res.status(404).json({
          error: `ID'si ${jobId} olan ilan bulunamadı.`
        });
      }

      res.json({
        message: 'İlan başarıyla güncellendi.',
        jobPosting: updated
      });
    } catch (err) {
      console.error('Error in updateJobPosting:', err);
      res.status(500).json({ error: 'İlan güncellenirken hata oluştu.' });
    }
  },

  /**
   * PATCH /api/job-postings/:id (Direct Route)
   */
  async patchJobPosting(req, res) {
    try {
      const jobId = req.params.id;
      const patched = await JobPostingModel.patch(jobId, req.body);

      if (!patched) {
        return res.status(404).json({
          error: `ID'si ${jobId} olan ilan bulunamadı.`
        });
      }

      res.json({
        message: 'İlan başarıyla kısmi olarak güncellendi.',
        jobPosting: patched
      });
    } catch (err) {
      console.error('Error in patchJobPosting:', err);
      res.status(500).json({ error: 'İlan güncellenirken hata oluştu.' });
    }
  },

  /**
   * DELETE /api/job-postings/:id (Direct Route)
   */
  async deleteJobPosting(req, res) {
    try {
      const jobId = req.params.id;
      const deleted = await JobPostingModel.delete(jobId);

      if (!deleted) {
        return res.status(404).json({
          error: `ID'si ${jobId} olan ilan bulunamadı.`
        });
      }

      res.json({
        message: 'İlan başarıyla silindi.',
        deletedJobPosting: deleted
      });
    } catch (err) {
      console.error('Error in deleteJobPosting:', err);
      res.status(500).json({ error: 'İlan silinirken hata oluştu.' });
    }
  }
};

module.exports = ApiJobPostingController;
