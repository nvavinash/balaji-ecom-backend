const express = require('express');
const { createUser,loginUser } = require('../controller/Auth');
const router = express.Router()
router
.post('/signUp',createUser)
.post('/login',loginUser);
exports.router = router;
