const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate, checkAccountStatus } = require('../middlewares/authMiddleware');

router.get('/register', AuthController.renderRegister);
router.post('/register', AuthController.register);

router.get('/login', AuthController.renderLogin);
router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);

router.get('/me', authenticate, checkAccountStatus(), (req, res) => {
  return res.redirect(`/users/${req.user.id}`);
});

module.exports = router;
