const express=require('express');
const dbConnect = require('./config/database');
const path = require("path");
const userRouter = require('./controller/userApi');
const cookieParser=require('cookie-parser')
const app=express(); 
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"/views"))
const {port}=require('./utils/variable')




app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser());
app.use(express.static("public"))

dbConnect()
.then(()=>{
   console.log('Connected to the database');
   app.listen(port,()=>{
    console.log(`App is running on the PORT ${port}`);
    require('child_process').exec('start http://localhost:7777/register')
   })
}).catch((error)=>{
    console.log(`Error ${error}`)
})

app.use('/',userRouter)