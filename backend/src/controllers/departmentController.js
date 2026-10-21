/**
 * DepartmentController - Web Controller for Department HTML Pages
 * Supports:
 *   - Direct Route: GET /departments
 *   - Direct Route: GET /departments/:id
 *   - Nested Route: GET /departments/:departmentId/job-postings
 */

const DepartmentModel = require('../models/departmentModel');
const JobPostingModel = require('../models/jobPostingModel');
const DepartmentViews = require('../views/departmentViews');
const JobPostingViews = require('../views/jobPostingViews');

const DepartmentController = {
  /**
   * GET /departments (Direct Route)
   */
  async renderDepartmentList(req, res) {
    try {
      const departments = await DepartmentModel.getAll();
      const html = DepartmentViews.renderDepartmentListPage(departments);
      res.send(html);
    } catch (err) {
      console.error('Error in renderDepartmentList:', err);
      res.status(500).send('Bölümler listelenirken hata oluştu.');
    }
  },

  /**
   * GET /departments/:id (Direct Route)
   */
  async renderDepartmentDetail(req, res) {
    try {
      const departmentId = req.params.id;
      const department = await DepartmentModel.getById(departmentId);

      if (!department) {
        return res.status(404).send('Bölüm bulunamadı.');
      }

      const jobPostings = await JobPostingModel.getByDepartmentId(departmentId);
      const html = DepartmentViews.renderDepartmentDetailPage(department, jobPostings);
      res.send(html);
    } catch (err) {
      console.error('Error in renderDepartmentDetail:', err);
      res.status(500).send('Bölüm detayı alınırken hata oluştu.');
    }
  },

  /**
   * GET /departments/:departmentId/job-postings (Nested Route)
   */
  async renderDepartmentJobPostings(req, res) {
    try {
      const departmentId = req.params.departmentId || req.params.id;
      const department = await DepartmentModel.getById(departmentId);

      if (!department) {
        return res.status(404).send('Bölüm bulunamadı.');
      }

      const [jobPostings, departments] = await Promise.all([
        JobPostingModel.getByDepartmentId(departmentId),
        DepartmentModel.getAll()
      ]);

      const html = JobPostingViews.renderJobPostingListPage(jobPostings, {
        departments,
        currentDepartment: department,
        isNested: true
      });
      res.send(html);
    } catch (err) {
      console.error('Error in renderDepartmentJobPostings:', err);
      res.status(500).send('Bölüm ilanları listelenirken hata oluştu.');
    }
  }
};

module.exports = DepartmentController;
