const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema
({
  username:{
    type:String,
    maxlength:256,
    required:true,
  },
  email:{
    type:String,
    unique:true,
    required:true,
    max:100,
  },
  password:{
    type:String,
    required:true,
    min:8,
    max:256,
  }
},{timestamps:true})

const User=mongoose.model("User",UserSchema);
module.exports=User;