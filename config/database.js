const mongoose=require('mongoose')

const url="mongodb://localhost:27017/authsystem";
const dbConnect=async()=>{
    try {
        await mongoose.connect(url)
    } catch (error) {
        console.log(error);   
    }
}

module.exports=dbConnect;       