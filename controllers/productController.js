const db = require("../models");
const { QueryTypes } = require("sequelize");
require('dotenv').config();

const addProduct = async (req,res)=>{
    try {
        let response = ""
        let product = req.body;
        let data =await db.sequelize.query(`Insert into Product (name,categoryId,description,price,status) VALUES (:name,:categoryId,:description,:price,:status)`,
            {
                replacements: {
                name: product.name,
                categoryId: product.categoryId,
                description: product.description,
                price: product.price,
                status: 'true',
                },
                type: QueryTypes.INSERT,
            }
        );
        response = {statuscode : 200, message : "Product Added Successfully"}
        return res.send(response)
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.addProduct : " + error.message,
          });
    }
}

const getallProduct = async (req,res)=>{
    try {
        let response = ""
        let data =await db.sequelize.query(`Select p.id, p.name, c.id as categoryId, p.description, p.price, p.status, c.name as categoryName from product as p INNER JOIN Category as c on p.categoryId = c.id`,
            {
                type: QueryTypes.SELECT,
            }
        );
        // let result = [];
        // data.map(x=>{
        //     result = x;
        // })
        response = {statuscode : 200, datalist : data}
        return res.send(response);  
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.getallProduct : " + error.message,
          });
    }
}

const getdetailsProductwithCategory = async (req,res)=>{
    try {
        let response = "";
        let categoryid = req.params.id;
        let data = await db.sequelize.query(`select id,name from Product where categoryId = :categoryid and status = 'true'`,{
            replacements : {
                categoryid : categoryid
            },
            type : QueryTypes.SELECT
        });
        let result = "";
        data.map(x=>{
            result = x
        })
        response = {statuscode : 200, datalist : result}
        return res.send(response); 
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.getdetailsProduct : " + error.message,
        });
    }
}

const getdetailsProduct = async (req,res)=>{
    try {
        let response = "";
        let id = req.params.id;
        let data = await db.sequelize.query(`select id,name,description,price from Product where id = :id`,{
            replacements : {
                id : id
            },
            type : QueryTypes.SELECT
        });
        let result = "";
        data.map(x=>{
            result = x
        })
        response = {statuscode : 200, datalist : result}
        return res.send(response); 
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.getdetailsProduct : " + error.message,
        });
    }
}

const updateProduct = async (req,res)=>{
    try {
        let response = "";
        let product = req.body;
        let data = await db.sequelize.query(`update Product set name=:name, description=:description, categoryId= :categoryId, price = :price where id=:id`,{
            replacements : {
                id : product.id,
                name : product.name,
                categoryId : product.categoryId,
                description : product.description,
                price : product.price                
            },
            type : QueryTypes.UPDATE
        });
        response = {statuscode : 200, message : "Product Updated Successfully"}
       return res.send(response);
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.updateProduct : " + error.message,
        });
    }
}

const deleteProduct = async (req,res)=>{
    try {
        let response = "";
        let id = req.params.id;
        let data = await db.sequelize.query(`delete from Product where id = :id`,{
            replacements : {
                id : id
            },
            type : QueryTypes.DELETE
        }); 
        response = {statuscode : 200, message : "Product Deleted Successfully"}
       return res.send(response);
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.deleteProduct : " + error.message,
        });
    }
}

const productStatusUpdate = async (req,res)=>{
    try {
        let response = "";
        let product = req.body;
        let data = await db.sequelize.query(`update Product set status=:status where id = :id`,{
            replacements : {
                status : product.status,
                id : product.id
            },
            type : QueryTypes.UPDATE
        }); 
        response = {statuscode : 200, message : "Product Status Updated Successfully"}
       return res.send(response);
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "productController.deleteProduct : " + error.message,
        });
    }
}


module.exports = {
    addProduct,
    getallProduct,
    getdetailsProductwithCategory,
    getdetailsProduct,
    updateProduct,
    deleteProduct,
    productStatusUpdate
};