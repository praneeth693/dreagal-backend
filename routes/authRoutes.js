const express = require("express");
const router = express.Router();
const User = require("../models/User");


function generateOTP(){
    return Math.floor(1000+Math.random()*9000).toString();
}

router.post("/send-otp",async(req,res)=>{
    try{
        const{mobile}=req.body;
        // if(!mobile){
        //     return res.status(400).json({message:"Mobile Number required"});
        // }
        
        let user=await User.findOne({mobile});

        const otp=generateOTP();
        const otpExpiry=new Date(Date.now()+5*60*1000);

        if(!user){
            user=new User({mobile,otp,otpExpires:otpExpiry});
        }
        else{
            user.otp=otp;
            user.otpExpires=otpExpiry;
        }
        await user.save();
        console.log("Generate otp:",otp);
        res.json({message:"OTP sent Successfully"});

    }
    catch(error){
         res.status(500).json({message:error.message});
    }
});

router.post("/verify-otp",async(req,res)=>{
    try{
        const{mobile,otp}=req.body;

        const user=await User.findOne({mobile});
        if(!user){
            return res.status(400).json({message:"User not found"});

        }
        if(user.otp!==otp){
            return res.status(400).json({message:"Invalid OTP"});

        }
        if(user.otpExpires<new Date()){
             return res.status(400).json({message:"OTP expired"});

        }
        user.otp=null;
        user.otpExpires=null;
        await user.save();
        res.json({message:"login Successful",
            user:{
                mobile:user.mobile,
                id:user._id,
                role:user.role
            },
            });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});

router.get("/users",async(req,res)=>{
    try{
        const users=await User.find();

        res.json(users);
    }catch(error)
    {
        res.status(500).json({message:error.message});
    }
});
router.delete("/users/:id",async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({message:"User deleted Successfully"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});
router.put("/users/:id",async(req,res)=>{
    try{
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                mobile: req.body.mobile,
                role:req.body.role
            },
            {returnDocument:"after"}

        );
        res.json(updatedUser);
    }catch(error){
         res.status(500).json({message:error.message});
    }
});


module.exports=router;