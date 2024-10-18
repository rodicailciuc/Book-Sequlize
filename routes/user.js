import express from 'express';

import userControllers from '../controllers/user.js';

const router = express.Router();

const { getRegisterForm, getRegister, getLoginForm, getLogin, getLogout } =
    userControllers;

// routes

router.get('/register', getRegisterForm);
router.post('/register', getRegister);
router.get('/login', getLoginForm);
router.post('/login', getLogin);
router.get('/logout', getLogout);

export default router;
