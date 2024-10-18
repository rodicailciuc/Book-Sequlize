import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { where } from 'sequelize';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import hashPassword from '../utils/hashPassword.js';
import matchPasswords from '../utils/matchPasswords.js';

const User = db.users;

const userControllers = {
    getRegisterForm: async (req, res) => {
        res.status(200).render('register-form');
    },
    getRegister: async (req, res) => {
        const { email, password, rePassword } = req.body;
        const userExist = await User.findOne({ where: { email: email } });

        if (userExist) {
            return res.status(400).render('404', {
                title: 'Email already exists',
                message: 'Email already exists, please login'
            });
        }

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const doPasswordsMatch = matchPasswords(password, rePassword);

        if (isEmailValid && isPasswordValid && doPasswordsMatch) {
            const hashedPassword = hashPassword(password);
            const newUser = {
                email: email,
                password: hashedPassword
            };
            const user = await User.create(newUser);
            res.status(302).redirect('/api/login');
        }
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form');
    },
    getLogin: async (req, res) => {
        const { email, password } = req.body;
        const userExist = await User.findOne({ where: { email: email } });

        if (!userExist) {
            return res.status(400).render('404', {
                title: 'Email does not exist',
                message: 'Email does not exist, please register'
            });
        }

        res.cookie('userId', userExist.id);
        bcrypt.compare(password, userExist.password, (err, isValid) => {
            if (err) {
                console.error(err);
            }
            if (isValid) {
                const token = jwt.sign(
                    { email: userExist.email },
                    process.env.TOKEN_SECRET
                );

                res.cookie('token', token, { httpOnly: true });
                res.status(200).redirect('/api/book');
            }
        });
    },
    getLogout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(302).redirect('/api/book');
        } catch (err) {
            res.status(500).json('404', {
                title: 'Logout Error',
                message: 'An error occurred during logout',
                error: err.message
            });
        }
    }
};

export default userControllers;
