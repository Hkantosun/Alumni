/**
 * JobPostingController - Web Controller for Job Posting HTML Pages
 * Supports:
 *   - Direct Route: GET /job-postings
 *   - Nested Route: GET /departments/:departmentId/job-postings
 *   - Nested Route: GET /users/:userId/job-postings
 *   - Detail Route: GET /job-postings/:id
 *   - CRUD Actions: Create, Update, Delete via web forms
 */

const JobPostingModel = require('../models/jobPostingModel');
const DepartmentModel = require('../models/departmentModel');
const UserModel = require('../models/userModel');
const ApplicationModel = require('../models/applicationModel');
const JobPostingViews = require('../views/jobPostingViews');

const JobPostingController = {
  /**
   * GET /job-postings (Direct & Nested)
   */
  async renderJobPostingList(req, res) {
    try {
      const departmentId = req.params.departmentId || req.query.departmentId;
      const userId = req.params.userId || req.query.userId;

      let currentDepartment = null;
      let currentUser = null;

      if (departmentId) {
        currentDepartment = await DepartmentModel.getById(departmentId);
      }

      if (userId) {
        currentUser = await UserModel.getById(userId);
      }

      const [jobPostings, departments, users, allApplications] = await Promise.all([
        JobPostingModel.getAll({ departmentId, userId }),
        DepartmentModel.getAll(),
        UserModel.getAll(),
        ApplicationModel.getAll()
      ]);

      // Calculate application count for each job posting
      const appCountMap = {};
      allApplications.forEach(a => {
        appCountMap[a.job_posting_id] = (appCountMap[a.job_posting_id] || 0) + 1;
      });
      jobPostings.forEach(j => {
        j.applicationsCount = appCountMap[j.id] || 0;
      });

      const html = JobPostingViews.renderJobPostingListPage(jobPostings, {
        departments,
        currentDepartment,
        currentUser,
        users,
        isNested: Boolean(departmentId || userId)
      });

      res.send(html);
    } catch (err) {
      console.error('Error in renderJobPostingList:', err);
      res.status(500).send('İlanlar listelenirken hata oluştu: ' + err.message);
    }
  },

  /**
   * GET /job-postings/:id (Direct Route)
   */
  async renderJobPostingDetail(req, res) {
    try {
      const jobId = req.params.id;
      const [job, applications, users] = await Promise.all([
        JobPostingModel.getById(jobId),
        ApplicationModel.getByJobPostingId(jobId),
        UserModel.getAll()
      ]);

      if (!job) {
        return res.status(404).send('İlan bulunamadı.');
      }

      const html = JobPostingViews.renderJobPostingDetailPage(job, { applications, users });
      res.send(html);
    } catch (err) {
      console.error('Error in renderJobPostingDetail:', err);
      res.status(500).send('İlan detayı alınırken hata oluştu: ' + err.message);
    }
  },

  /**
   * GET /job-postings/:id/edit (Direct Route)
   */
  async renderEditForm(req, res) {
    try {
      const jobId = req.params.id;
      const [job, departments, users] = await Promise.all([
        JobPostingModel.getById(jobId),
        DepartmentModel.getAll(),
        UserModel.getAll()
      ]);

      if (!job) {
        return res.status(404).send('Düzenlenecek ilan bulunamadı.');
      }

      const html = JobPostingViews.renderEditForm(job, departments, users);
      res.send(html);
    } catch (err) {
      console.error('Error in renderEditForm:', err);
      res.status(500).send('Düzenleme formu yüklenirken hata oluştu.');
    }
  },

  /**
   * POST /job-postings (Create Web Action)
   */
  async createJobPosting(req, res) {
    try {
      const { title, company, location, job_type, department_id, posted_by_user_id, application_link, description } = req.body;

      if (!title || !company || !posted_by_user_id || !description) {
        return res.status(400).send('Lütfen gerekli alanları (başlık, şirket, kullanıcı ID, açıklama) doldurun.');
      }

      const newJob = await JobPostingModel.create({
        title,
        company,
        location,
        job_type,
        department_id: department_id || null,
        posted_by_user_id,
        application_link,
        description
      });

      // Redirect to newly created job detail page
      res.redirect(`/job-postings/${newJob.id}`);
    } catch (err) {
      console.error('Error in createJobPosting action:', err);
      res.status(500).send('İlan kaydedilirken bir hata oluştu: ' + err.message);
    }
  },

  /**
   * POST /job-postings/:id/update (Update Web Action)
   */
  async updateJobPosting(req, res) {
    try {
      const jobId = req.params.id;
      await JobPostingModel.update(jobId, req.body);
      res.redirect(`/job-postings/${jobId}`);
    } catch (err) {
      console.error('Error in updateJobPosting action:', err);
      res.status(500).send('İlan güncellenirken hata oluştu.');
    }
  },

  /**
   * POST /job-postings/:id/delete (Delete Web Action)
   */
  async deleteJobPosting(req, res) {
    try {
      const jobId = req.params.id;
      await JobPostingModel.delete(jobId);
      res.redirect('/job-postings');
    } catch (err) {
      console.error('Error in deleteJobPosting action:', err);
      res.status(500).send('İlan silinirken hata oluştu.');
    }
  }
};

module.exports = JobPostingController;
