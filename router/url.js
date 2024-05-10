const express = require('express');
const router = express.Router();
const { register, login, dashBoard, logout } = require('../controller/user.controller');

router.post('/v1/register', register);
router.post('/v1/login', login);
router.get('/v1/dashboard', dashBoard);
router.put('/v1/logout', logout)

module.exports = router;