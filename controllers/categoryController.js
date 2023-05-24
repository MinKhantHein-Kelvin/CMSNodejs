const db = require("../models");
const { QueryTypes } = require("sequelize");
require('dotenv').config();

const addCategory = async (req,res)=>{
    try {
        let response = ""
        let category = req.body;
        let data =await db.sequelize.query(`Insert into Category (name) VALUES (:name)`,
            {
                replacements: {
                name: category.name
                },
                type: QueryTypes.INSERT,
            }
        );
        response = {statuscode : 200, message : "Category Added Successfully"}
        return res.send(response)
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "categoryController.addCategory : " + error.message,
          });
    }
}

const getallCategory = async (req,res)=>{
    try {
        let response = ""
        let data =await db.sequelize.query(`Select * from Category order by name`,
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
            errmessage: "categoryController.getallCategory : " + error.message,
          });
    }
}

const updateCategory = async (req,res)=>{
    try {
        let response = "";
        let category = req.body;
        let data = await db.sequelize.query(`update Category set name=:name where id=:id`,{
            replacements : {
                name : category.name,
                id : category.id
            },
            type : QueryTypes.UPDATE
        });
        response = {statuscode : 200, message : "Category Updated Successfully"}
       return res.send(response);
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "categoryController.updateCategory : " + error.message,
          });
    }
}


module.exports = {
    addCategory,
    getallCategory,
    updateCategory
};