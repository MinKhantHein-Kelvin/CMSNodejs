const db = require("../models");
const { QueryTypes } = require("sequelize");
const jwt = require ('jsonwebtoken');
const nodemailer = require ('nodemailer');
require('dotenv').config();

//Sign Up
const Signup = async (req, res) => {
  try {
    let response = "";
    checkUser = await CheckExistEmail(req.body.email);
    if (checkUser.email == "") {
        ;
      let data =await db.sequelize.query(
        `INSERT INTO USER(name,contact_number,email,password,status,role) VALUES (:name, :contact_number, :email, :password, :status, :role);`,
        {
          replacements: {
            name: req.body.name,
            contact_number: req.body.contact_number,
            email: req.body.email,
            password: req.body.password,
            status: req.body.status,
            role: req.body.role,
          },
          type: QueryTypes.INSERT,
        }
      );
      response = { status: 200, message: "Sign up Successful" };
    } else {
      response = { status: 401, message: "Email Already Exist!" };
    }
    return res.send(response)
  } catch (error) {
    return res.send({
      statuscode: 500,
      message: "Server Error!",
      errmessage: "userController.Signup : " + error.message,
    });
  }
};

//login
const Login = async (req,res)=>{
    try {
        let response = "";
        checkUser = await CheckExistEmail(req.body.email);
        if(checkUser.email != req.body.email || checkUser.password != req.body.password){
            response = {status : 401, message : "Incorrect Username or Password"}
        }
        else if(checkUser.status === 'false'){
            response = {status : 401, message : "Wait for Admin Approval"}
        }
        else if(checkUser.email == req.body.email || checkUser.password == req.body.password){
            const resdata = { email : checkUser.email, role : checkUser.role}
            const accesstoken = jwt.sign(resdata, process.env.ACCESS_TOKEN, {expiresIn:'24h'})
            response = {status : 200, token : accesstoken , message : "Login Successful"}
        }
        else{
            response = {status : 401, message : "Something Went Wrong"}
        }

        return res.send(response)

        
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "userController.Login : " + error.message,
          });
    }
}

// forgotPassword
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const Forgetpassword = async(req,res)=>{
    try {
        let response = "";
        checkUser = await CheckExistEmail(req.body.email);
        if(checkUser.email == "" || checkUser.email == undefined){
            response = {status : 200, message : "Your Email Don't Sign Up"}
        }else{
            var mailOptions = {
                from : process.env.EMAIL,
                to : checkUser.email,
                subject : "Password by Cafe Management System",
                html : '<p><b>Your Login details for Cafe Management System</b> <br> <b>Email:</b>' + checkUser.email + '<br> <b>Password:</b>' + checkUser.password + '<br><a href="http://localhost:4200/">Click here to login</a></p>'
            }
            transporter.sendMail(mailOptions, (err,infor)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('Email sent' + info.response);
                }
            });
            response = {status : 200, message : "Password sent successfully to your email"}
        }
        return res.send(response);
    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server Error!",
            errmessage: "userController.Forgetpassword : " + error.message,
          });
    }
}

//get all user
const userRole = async (req, res) => {
  try {
    // await authenticationToken(req, res);
    let data = await db.sequelize.query(`select id, name, email,contact_number, status from User where role='user'`,{
      type: QueryTypes.SELECT,
    });
    let response = {status: 200, datalist: data};
    return res.send(response);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
      errmessage: "userController.userRole : " + error.message,
    });
  }  
};





const statusUpdate = async(req,res)=>{
  try {
    let response = "";
    // Verify user token
    // await auth.authenticationToken(req, res);

    let data = await db.sequelize.query(`update User set status=:status where id=:id`,{
      replacements : {
        id : req.body.id,
        status: req.body.status
      },
      type: QueryTypes.UPDATE,
    })
    response = {status : 200, message : "User updated successful"}
    return res.send(response);
  } catch (error) {
    return res.send({
      status: 500,
      message: "Server Error!",
      errmessage: "userController.statusUpdate : " + error.message,
    });
  }
}

const checkToken = async(req,res)=>{
  try {
    let response = "";
    response = {status : 200, message : "true"}
    return res.send(response);
  } catch (error) {
    return res.send({
      status: 500,
      message: "Server Error!",
      errmessage: "userController.checkToken : " + error.message,
    });
  }
}


const changePassword = async (req,res)=>{
  try {
    let response = "";
    let data = await checkExistUser(req.body, res.locals.email);
    if(data.length <= 0){
      response = {statuscode : 401, message : "Incorrect Old Password"}
    }else if(data[0].password == req.body.oldPassword){
      let data = db.sequelize.query(`update User set password = :password where email=:email`,{
        type : QueryTypes.UPDATE,
        replacements : {
          password : req.body.newPassword,
          email : res.locals.email
        }
      })
      response = {statuscode : 400, message : " Password Updated Successfully"}
    }else{
      response = {statuscode : 400, message : "Something went wrong"}
    }
    // res.send(data)
    // console.log(data[0].email);
    // response = {datalist : data}
    return res.send(response)
  } catch (error) {
    return res.send({
      status: 500,
      message: "Server Error!",
      errmessage: "userController.changePassword : " + error.message,
    });
  }
}

const CheckExistEmail = async (useremail) => {
  let checkuser = "";
  let result = await db.sequelize.query(
    `select name,contact_number,email,password,status,role from User where email=:email`,
    {
      replacements: { email: useremail },
      type: QueryTypes.SELECT,
    }
  );
  if (result && Object.keys(result).length !== 0) {
    checkuser = result[0];
  }
  return checkuser;
};

const checkExistUser = async(user,email)=>{
  let data = await db.sequelize.query(`select * from User where email = :email and password=:password`,{
    type : QueryTypes.SELECT,
    replacements : {
      email : email,
      password: user.oldPassword
    }
  });
  return data;
}

module.exports = {
  Signup,
  Login,
  Forgetpassword,
  userRole,
  statusUpdate,
  checkToken,
  changePassword
};
