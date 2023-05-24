const db = require("../models");
const { QueryTypes } = require("sequelize");
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const fs = require('fs');
const uuid = require('uuid');

const getBillPdf = async (req, res) => {
  try {
    let response = "";
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    let data = await db.sequelize.query(
      `Insert into Bill(name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) Values (:name, :uuid, :email, :contactNumber, :paymentMethod , :total , :productDetails, :createdBy)`,
      {
        replacements: {
          name: orderDetails.name,
          uuid: generatedUuid,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          paymentMethod: orderDetails.paymentMethod,
          total: orderDetails.total,
          productDetails: orderDetails.productDetails,
          createdBy: res.locals.email,
        },
        type: QueryTypes.INSERT,
      }
    );

    ejs.renderFile(
      path.join(__dirname, "report.ejs"),
      {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.total,
        paymentMethod: orderDetails.paymentMethod,
        total: orderDetails.total,
      },
      (err, result) => {
        if (err) {
          response = { statuscode: 500, message: "errorpdf" };
        } else {
          pdf.create(result).toFile('./generatedpdf/' + generatedUuid + ".pdf", (err, data) => {
            if (err) {
              response = { statuscode: 500, message: "error" };
            } else {
              response = { statuscode: 200, message: "Successfully Downloaded PDF", uuid: generatedUuid };
            }
          });
          response = { statuscode: 200, message: "Successfully Downloaded PDF", uuid: generatedUuid };
        }
      }
    );
    return res.send(response);
  } catch (error) {
    return res.send({
      statuscode: 500,
      message: "Server Error!",
      errmessage: "billController.getBillPdf: " + error.message,
    });
  }
}


const getPdfFile = async (req,res)=>{
    const orderDetails = req.body;
    const pdfPath = './generatedpdf/' + orderDetails.uuid + ".pdf";
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
   
    }else{
        const productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(
            path.join(__dirname, "report.ejs"),
            {
              productDetails: productDetailsReport,
              name: orderDetails.name,
              email: orderDetails.email,
              contactNumber: orderDetails.total,
              paymentMethod: orderDetails.paymentMethod,
              total: orderDetails.total,
            },
            (err, result) => {
              if (err) {
                response = { statuscode: 500, message: "errorpdf" };
              } else {
                pdf.create(result).toFile('./generatedpdf/' + orderDetails.uuid + ".pdf", (err, data) => {
                  if (err) {
                    response = { statuscode: 500, message: "error" };
                  } else {
                    res.contentType("application/pdf");
                    fs.createReadStream(pdfPath).pipe(res);
                  }
                });
              }
            }
          );
    }
}

const getallBill = async (req,res)=>{
    try {
        let response = ""
        let data = await db.sequelize.query(`select * from Bill order by id desc`,{
            type : QueryTypes.SELECT
        });
        response = {statuscode : 200, datalist : data}
        return res.send(response)
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "billController.getallBill: " + error.message,
          });
    }
}

const deleteBill = async (req,res)=>{
    try {
        let response = ""
        let data = await db.sequelize.query(`delete from Bill where id=:id`,{
            type : QueryTypes.DELETE,
            replacements : {
                id : req.params.id
            }
        });
        response = {statuscode : 200, message : "Deleted Successrully"}
        return res.send(response)
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "billController.getallBill: " + error.message,
          });
    }
}

module.exports = {
  getBillPdf,
  getPdfFile,
  getallBill,
  deleteBill
};
