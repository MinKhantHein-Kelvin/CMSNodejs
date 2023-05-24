const express = require('express');
const app = express();
const db = require('./models');
const cors = require("cors");
const bodyParser = require('body-parser');
const user = require('./routes/userRoute');
const category = require('./routes/categoryRoute');
const product = require('./routes/productRoute');
const bill = require('./routes/billRoute');

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true })); //, parameterLimit:500000
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use("/user", user);
app.use("/category", category);
app.use("/product", product);
app.use("/bill", bill);

db.sequelize.sync().then((req)=>{
    app.listen(3000, ()=>{
        console.log("Server is running at port 3000");
    })
})