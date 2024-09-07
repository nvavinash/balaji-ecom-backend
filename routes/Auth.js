const express = require('express');
const passport = require('passport');
const { createUser,loginUser,checkAuth } = require('../controller/Auth');
const router = express.Router()
router
.post('/signUp',createUser)
.post('/login',passport.authenticate('local'),loginUser)
.get('/check',passport.authenticate('jwt'),checkAuth);
exports.router = router;
