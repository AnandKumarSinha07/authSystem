const User = require("../model/authModel");
const jwt=require('jsonwebtoken');
const { JWT_SECRET } = require("./variable");


const userAuth=async(req,res,next)=>{
    try {   
        const {token}=req.cookies;
        console.log("token is ",token)
        const verifyToken=jwt.verify(token,JWT_SECRET);

        if(!verifyToken){
            return res.status(404).json({
                message:"Invalid Credentials!!"
            })
        }

        const {_id}=verifyToken;
        const findUser=await User.findById(_id);

        if(!findUser){
            return res.status(404).json({
                message:"Invalid credentials Register first!!"
            })
        }
        req.user=findUser;
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message:`Invalid Credentials!!`
        })
    }
}

module.exports=userAuth;