/**
 * ApiDepartmentController - REST API Controller for Department resources
 * Direct Routes: /api/departments, /api/departments/:id
 * Nested Routes: /api/departments/:departmentId/job-postings
 */

const DepartmentModel = require('../models/departmentModel');
const JobPostingModel = require('../models/jobPostingModel');

const ApiDepartmentController = {
  /**
   * GET /api/departments (Direct Route)
   */
  async getDepartments(req, res) {
    try {
      const { sortBy = 'name', order = 'asc' } = req.query;
      const departments = await DepartmentModel.getAll({ sortBy, order });

      res.json({
        count: departments.length,
        sortBy,
        order,
        departments
      });
    } catch (err) {
      console.error('Error in getDepartments:', err);
      res.status(500).json({ error: 'Bölümler veritabanından alınırken hata oluştu.' });
    }
  },

  /**
   * GET /api/departments/:id (Direct Route)
   */
  async getDepartmentById(req, res) {
    try {
      const departmentId = req.params.id;
      const department = await DepartmentModel.getById(departmentId);

      if (!department) {
        return res.status(404).json({
          error: `ID'si ${departmentId} olan bölüm bulunamadı.`
        });
      }

      res.json({ department });
    } catch (err) {
      console.error('Error in getDepartmentById:', err);
      res.status(500).json({ error: 'Bölüm sorgulanırken hata oluştu.' });
    }
  },

  /**
   * GET /api/departments/:departmentId/job-postings (Nested Route)
   */
  async getDepartmentJobPostings(req, res) {
    try {
      const departmentId = req.params.departmentId || req.params.id;
      const department = await DepartmentModel.getById(departmentId);

      if (!department) {
        return res.status(404).json({
          error: `ID'si ${departmentId} olan bölüm bulunamadı.`
        });
      }

      const jobPostings = await JobPostingModel.getByDepartmentId(departmentId);

      res.json({
        department: {
          id: department.id,
          code: department.code,
          name: department.name,
          faculty: department.faculty
        },
        count: jobPostings.length,
        jobPostings
      });
    } catch (err) {
      console.error('Error in getDepartmentJobPostings:', err);
      res.status(500).json({ error: 'Bölüme ait ilanlar sorgulanırken hata oluştu.' });
    }
  },

  /**
   * POST /api/departments (Direct Route)
   */
  async createDepartment(req, res) {
    try {
      const { code, name, faculty, description } = req.body;

      if (!code || !name || !faculty) {
        return res.status(400).json({
          error: 'Bölüm kodu (code), bölüm adı (name) ve fakülte (faculty) zorunludur.'
        });
      }

      const existing = await DepartmentModel.getByCode(code);
      if (existing) {
        return res.status(409).json({
          error: `'${code}' koduna sahip bir bölüm zaten kayıtlı.`
        });
      }

      const department = await DepartmentModel.create({ code, name, faculty, description });
      res.status(201).json({
        message: 'Bölüm başarıyla oluşturuldu.',
        department
      });
    } catch (err) {
      console.error('Error in createDepartment:', err);
      res.status(500).json({ error: 'Bölüm eklenirken hata oluştu.' });
    }
  },

  /**
   * PUT /api/departments/:id (Direct Route)
   */
  async updateDepartment(req, res) {
    try {
      const departmentId = req.params.id;
      const { code, name, faculty, description } = req.body;

      const updated = await DepartmentModel.update(departmentId, { code, name, faculty, description });
      if (!updated) {
        return res.status(404).json({
          error: `ID'si ${departmentId} olan bölüm bulunamadı.`
        });
      }

      res.json({
        message: 'Bölüm başarıyla güncellendi.',
        department: updated
      });
    } catch (err) {
      console.error('Error in updateDepartment:', err);
      res.status(500).json({ error: 'Bölüm güncellenirken hata oluştu.' });
    }
  },

  /**
   * DELETE /api/departments/:id (Direct Route)
   */
  async deleteDepartment(req, res) {
    try {
      const departmentId = req.params.id;
      const deleted = await DepartmentModel.delete(departmentId);

      if (!deleted) {
        return res.status(404).json({
          error: `ID'si ${departmentId} olan bölüm bulunamadı.`
        });
      }

      res.json({
        message: 'Bölüm başarıyla silindi.',
        deletedDepartment: deleted
      });
    } catch (err) {
      console.error('Error in deleteDepartment:', err);
      res.status(500).json({ error: 'Bölüm silinirken hata oluştu.' });
    }
  }
};

module.exports = ApiDepartmentController;
