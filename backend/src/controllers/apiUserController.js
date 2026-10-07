/**
 * ApiUserController - REST API Controller for User resources
 * Handles JSON requests, payload validations, and HTTP response formatting.
 */

const UserModel = require('../models/userModel');

const ApiUserController = {
  /**
   * GET /api/users
   * Retrieve all users with optional sorting (sortBy, order).
   */
  getUsers(req, res) {
    const { sortBy = 'id', order = 'asc' } = req.query;
    const users = UserModel.getAll({ sortBy, order });

    res.json({
      count: users.length,
      sortBy,
      order,
      users
    });
  },

  /**
   * GET /api/users/:id
   * Retrieve a single user entity by ID.
   */
  getUserById(req, res) {
    const userId = parseInt(req.params.id, 10);
    const user = UserModel.getById(userId);

    if (!user) {
      return res.status(404).json({
        error: `ID'si ${userId} olan kullanıcı bulunamadı.`
      });
    }

    res.json({ user });
  },

  /**
   * POST /api/users
   * Create a new user record.
   */
  createUser(req, res) {
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'Gönderilen veri boş olamaz.'
      });
    }

    const newUser = UserModel.create(payload);

    res.status(201).json({
      message: 'Veri başarıyla alındı ve kaydedildi',
      user: newUser
    });
  },

  /**
   * PUT /api/users/:id
   * Fully update an existing user record by ID.
   */
  updateUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'PUT isteğinde güncellenecek veri (body) boş olamaz.'
      });
    }

    const updatedUser = UserModel.update(userId, payload);

    if (!updatedUser) {
      return res.status(404).json({
        error: `ID'si ${userId} olan kullanıcı bulunamadı.`
      });
    }

    res.json({
      message: 'Kullanıcı verisi tamamen güncellendi (PUT)',
      user: updatedUser
    });
  },

  /**
   * PATCH /api/users/:id
   * Partially update specified attributes of a user by ID.
   */
  patchUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'PATCH isteğinde güncellenecek veri alanı bulunamadı.'
      });
    }

    const updatedUser = UserModel.patch(userId, payload);

    if (!updatedUser) {
      return res.status(404).json({
        error: `ID'si ${userId} olan kullanıcı bulunamadı.`
      });
    }

    res.json({
      message: 'Kullanıcı verisi kısmen güncellendi (PATCH)',
      user: updatedUser
    });
  },

  /**
   * DELETE /api/users/:id
   * Remove a user record by ID.
   */
  deleteUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = UserModel.delete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        error: `ID'si ${userId} olan kullanıcı bulunamadı.`
      });
    }

    res.json({
      message: `ID'si ${userId} olan kullanıcı başarıyla silindi.`,
      deletedUser,
      remainingCount: UserModel.count()
    });
  }
};

module.exports = ApiUserController;
