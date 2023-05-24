const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const auth = require ('../services/authentication.js')
const checkRole = require ('../services/checkRole.js')

router.post('/generatereport',auth, billController.getBillPdf)
router.post('/getpdf',auth, billController.getPdfFile);
router.get('/getallbill',auth, billController.getallBill);
router.delete('/delete/:id',auth, billController.deleteBill);


module.exports = router;

