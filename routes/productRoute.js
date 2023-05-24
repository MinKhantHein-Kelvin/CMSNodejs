const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require ('../services/authentication.js')
const checkRole = require ('../services/checkRole.js')

router.post('/add', auth, checkRole, productController.addProduct);
router.get('/get', auth, productController.getallProduct);
router.get('/getbycategory/:id', auth, productController.getdetailsProductwithCategory);
router.get('/getbyid/:id', auth, productController.getdetailsProduct);
router.patch('/update', auth, checkRole, productController.updateProduct);
router.delete('/delete/:id', auth, checkRole, productController.deleteProduct);
router.patch('/updatestatus', auth, checkRole, productController.productStatusUpdate);

module.exports = router;