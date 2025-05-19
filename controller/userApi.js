const express=require('express');
const User = require('../model/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userAuth = require('../utils/auth');
const { JWT_SECRET } = require('../utils/variable');



const userRouter=express.Router();


userRouter.get("/register",(req,res)=>{
    res.render("register",{message:null});
})

userRouter.get("/login",(req,res)=>{
    res.render("login",{message:null   })
})


userRouter.post("/register",async(req,res)=>{
    try {
        const {username, email, password}=req.body;
        if(!username || !email || !password){
            return res.render("register",{
                message:"Please Fill all the required Details"
            })
        }


        if(password.length<8){
            return res.render("register",{
                message:"Password Lenght Must be greater than 8"
            })
        }

        if(!email.endsWith('@gmail.com')){
            return res.render("register",{
                message:"Enter valid email format"
            })
        }
        const findEmail=await User.findOne({email});
        if(findEmail){  
            return res.render("register",{ message: "Email or username already exists." });
        }

        const hasPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            username:username,
            email:email,
            password:hasPassword
        })

        await newUser.save();
        res.redirect("login")
    } catch (error) {
        res.render("register",{message:`Bad Request Error in the Register Paper ${error}`})
    }
})

userRouter.post("/login",async(req,res)=>{
  try{
      
     
      const {email,password}= req.body;

      console.log(email,password);

      
      const findEmail=await User.findOne({email:email});
      console.log("findEmail",findEmail);
      
      
      if(!findEmail){
        return res.render("login",{error:"Email Not found"})
      }

      const PasswordCompare=await bcrypt.compare(password,findEmail.password);
      const userId=findEmail._id;
      const userEmail=findEmail.email;
      console.log("user id",userId);
      console.log("user email",userEmail);
     
      if(!PasswordCompare){
        return res.render("login",{
            message:"Enter Correct Password!!"
        })
      }else{
         const token= await jwt.sign(
            {
                _id:userId,
                email:userEmail,
            },  JWT_SECRET,{expiresIn:"15m"});
         res.cookie("token",token,{
             expires:new Date(Date.now()+15*60*1000)
         });
      }
      res.redirect("profile")
  }catch(err){
      console.log("Error inside Login Api",err);
      res.status(404).send("Not Authorized Please Enter yout details Properly")
  }
})

userRouter.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user;
        console.log("user is ", user);
        res.render("profile", { user });

    } catch (error) {
        console.log(`Error in the get profile api ${error}`);
        return res.status(404).json({
            message: "Error in the get profile api"
        });
    }
});


userRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,
        {
            expiresIn:new Date()
        }
    )
    return res.redirect("/login");
})

module.exports=userRouter;