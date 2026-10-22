/**
 * ApplicationController - Web Controller for Application HTML Pages
 * Supports:
 *   - Direct Route: GET /applications
 *   - Nested Route: GET /job-postings/:jobPostingId/applications
 *   - Nested Route: GET /users/:userId/applications
 *   - Detail Route: GET /applications/:id
 *   - CRUD Actions: Create, Update, Delete via web actions
 */

const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');
const ApplicationViews = require('../views/applicationViews');

const ApplicationController = {
  /**
   * GET /applications (Direct or Nested)
   */
  async renderApplicationList(req, res) {
    try {
      const jobPostingId = req.params.jobPostingId || req.query.jobPostingId;
      const userId = req.params.userId || req.query.userId;

      let currentJob = null;
      let currentUser = null;

      if (jobPostingId) {
        currentJob = await JobPostingModel.getById(jobPostingId);
      }

      if (userId) {
        currentUser = await UserModel.getById(userId);
      }

      const [applications, jobPostings, users] = await Promise.all([
        ApplicationModel.getAll({ jobPostingId, userId }),
        JobPostingModel.getAll(),
        UserModel.getAll()
      ]);

      const html = ApplicationViews.renderApplicationListPage(applications, {
        currentJob,
        currentUser,
        jobPostings,
        users,
        isNested: Boolean(jobPostingId || userId)
      });

      res.send(html);
    } catch (err) {
      console.error('Error in renderApplicationList:', err);
      res.status(500).send('Başvurular listelenirken hata oluştu: ' + err.message);
    }
  },

  /**
   * GET /applications/:id (Direct Route)
   */
  async renderApplicationDetail(req, res) {
    try {
      const applicationId = req.params.id;
      const application = await ApplicationModel.getById(applicationId);

      if (!application) {
        return res.status(404).send('Başvuru bulunamadı.');
      }

      const html = ApplicationViews.renderApplicationDetailPage(application);
      res.send(html);
    } catch (err) {
      console.error('Error in renderApplicationDetail:', err);
      res.status(500).send('Başvuru detayı alınırken hata oluştu: ' + err.message);
    }
  },

  /**
   * GET /applications/:id/edit (Direct Route)
   */
  async renderEditForm(req, res) {
    try {
      const applicationId = req.params.id;
      const [application, jobPostings, users] = await Promise.all([
        ApplicationModel.getById(applicationId),
        JobPostingModel.getAll(),
        UserModel.getAll()
      ]);

      if (!application) {
        return res.status(404).send('Düzenlenecek başvuru bulunamadı.');
      }

      const html = ApplicationViews.renderEditForm(application, { jobPostings, users });
      res.send(html);
    } catch (err) {
      console.error('Error in renderEditForm:', err);
      res.status(500).send('Form yüklenirken hata oluştu: ' + err.message);
    }
  },

  /**
   * POST /applications (Create Web Action)
   */
  async createApplication(req, res) {
    try {
      const { job_posting_id, applicant_user_id, resume_url, cover_letter } = req.body;

      if (!job_posting_id || !applicant_user_id) {
        return res.status(400).send('İlan ID ve Aday ID zorunludur.');
      }

      const newApp = await ApplicationModel.create({
        job_posting_id,
        applicant_user_id,
        resume_url,
        cover_letter
      });

      res.redirect(`/applications/${newApp.id}`);
    } catch (err) {
      console.error('Error in createApplication action:', err);
      if (err.code === '23505') {
        return res.status(409).send(`
          <!DOCTYPE html>
          <html lang="tr">
          <head><meta charset="UTF-8"><title>Çift Başvuru Uyarısı</title></head>
          <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 4rem;">
            <div style="max-width: 500px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155;">
              <h2 style="color: #f59e0b;">⚠️ Zaten Başvurdunuz</h2>
              <p style="color: #cbd5e1;">Bu ilana daha önce bu aday adıyla bir başvuru yapılmış. Sistemde mükerrer başvuruya izin verilmemektedir.</p>
              <a href="/applications" style="background: #38bdf8; color: #0f172a; text-decoration: none; padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 1rem;">Başvurular Listesine Dön</a>
            </div>
          </body>
          </html>
        `);
      }
      res.status(500).send('Başvuru oluşturulurken hata oluştu: ' + err.message);
    }
  },

  /**
   * POST /applications/:id/update (Update Web Action)
   */
  async updateApplication(req, res) {
    try {
      const applicationId = req.params.id;
      await ApplicationModel.update(applicationId, req.body);
      res.redirect(`/applications/${applicationId}`);
    } catch (err) {
      console.error('Error in updateApplication action:', err);
      res.status(500).send('Başvuru güncellenirken hata oluştu: ' + err.message);
    }
  },

  /**
   * POST /applications/:id/delete (Delete Web Action)
   */
  async deleteApplication(req, res) {
    try {
      const applicationId = req.params.id;
      await ApplicationModel.delete(applicationId);
      res.redirect('/applications');
    } catch (err) {
      console.error('Error in deleteApplication action:', err);
      res.status(500).send('Başvuru silinirken hata oluştu: ' + err.message);
    }
  }
};

module.exports = ApplicationController;
