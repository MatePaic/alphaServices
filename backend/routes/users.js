const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");

// http://localhost:3000/api/v1/users

router.get('/', usersController.getUsers);

router.get('/:id', usersController.getUser);

router.post('/signup', usersController.createUser);

router.post('/login', usersController.userLogin);

router.post('/reset-password-email', usersController.sendEmailForResetPassword);

router.post('/reset-password-set-password', usersController.setPasswordForResetPassword);

module.exports = router;