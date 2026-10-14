/**
 * ApiUserController - REST API Controller for User resources
 * Handles JSON requests, payload validations, and PostgreSQL database operations.
 */

const UserModel = require('../models/userModel');

const ApiUserController = {
  /**
   * GET /api/users
   * Retrieve all users with optional sorting (sortBy, order).
   */
  async getUsers(req, res) {
    try {
      const { sortBy = 'id', order = 'asc' } = req.query;
      const users = await UserModel.getAll({ sortBy, order });

      res.json({
        count: users.length,
        sortBy,
        order,
        users
      });
    } catch (err) {
      console.error('Error in getUsers:', err);
      res.status(500).json({ error: 'Kullanıcılar veritabanından alınırken hata oluştu.' });
    }
  },

  /**
   * GET /api/users/:id
   * Retrieve a single user entity by ID.
   */
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserModel.getById(userId);

      if (!user) {
        return res.status(404).json({
          error: `ID'si ${userId} olan kullanıcı bulunamadı.`
        });
      }

      res.json({ user });
    } catch (err) {
      console.error('Error in getUserById:', err);
      res.status(500).json({ error: 'Kullanıcı sorgulanırken hata oluştu.' });
    }
  },

  /**
   * POST /api/users
   * Create a new user record in PostgreSQL.
   */
  async createUser(req, res) {
    try {
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'Gönderilen veri boş olamaz.'
        });
      }

      const newUser = await UserModel.create(payload);

      res.status(201).json({
        message: 'Veri başarıyla alındı ve veritabanına kaydedildi',
        user: newUser
      });
    } catch (err) {
      console.error('Error in createUser:', err);
      res.status(500).json({ error: 'Kullanıcı veritabanına kaydedilirken hata oluştu: ' + err.message });
    }
  },

  /**
   * PUT /api/users/:id
   * Fully update an existing user record by ID.
   */
  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'PUT isteğinde güncellenecek veri (body) boş olamaz.'
        });
      }

      const updatedUser = await UserModel.update(userId, payload);

      if (!updatedUser) {
        return res.status(404).json({
          error: `ID'si ${userId} olan kullanıcı bulunamadı.`
        });
      }

      res.json({
        message: 'Kullanıcı verisi tamamen güncellendi (PUT)',
        user: updatedUser
      });
    } catch (err) {
      console.error('Error in updateUser:', err);
      res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu: ' + err.message });
    }
  },

  /**
   * PATCH /api/users/:id
   * Partially update specified attributes of a user by ID.
   */
  async patchUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const payload = req.body;

      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
          error: 'PATCH isteğinde güncellenecek veri boş olamaz.'
        });
      }

      const updatedUser = await UserModel.patch(userId, payload);

      if (!updatedUser) {
        return res.status(404).json({
          error: `ID'si ${userId} olan kullanıcı bulunamadı.`
        });
      }

      res.json({
        message: 'Kullanıcı verisi kısmi olarak güncellendi (PATCH)',
        user: updatedUser
      });
    } catch (err) {
      console.error('Error in patchUser:', err);
      res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu: ' + err.message });
    }
  },

  /**
   * DELETE /api/users/:id
   * Delete a specific user by ID.
   */
  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const deletedUser = await UserModel.delete(userId);

      if (!deletedUser) {
        return res.status(404).json({
          error: `ID'si ${userId} olan kullanıcı bulunamadı.`
        });
      }

      res.json({
        message: `ID'si ${userId} olan kullanıcı başarıyla silindi.`,
        deletedUser
      });
    } catch (err) {
      console.error('Error in deleteUser:', err);
      res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu: ' + err.message });
    }
  }
};

module.exports = ApiUserController;
