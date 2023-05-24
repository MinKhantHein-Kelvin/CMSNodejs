const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require ('../services/authentication.js')
const checkRole = require ('../services/checkRole.js')

router.post('/add', auth, checkRole, categoryController.addCategory);
router.get('/get', auth, categoryController.getallCategory);
router.patch('/update', auth, checkRole, categoryController.updateCategory);

module.exports = router;