const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require ('../services/authentication.js')
const checkRole = require ('../services/checkRole.js')

router.post('/signup', userController.Signup)
router.post('/login', userController.Login)
router.post('/forgetpassword', userController.Forgetpassword)

router.get('/get',auth,checkRole, userController.userRole);
router.patch('/update',auth,checkRole, userController.statusUpdate);
router.get('/checktoken',auth, userController.checkToken);
router.post('/changepassword',auth, userController.changePassword);


module.exports = router;