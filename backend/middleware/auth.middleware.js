import {getAuth} from "@clerk/express";
import User from "../models/user.model.js";


export  async function protectRoute(req,res,next){
    try{
        const {userId}  = getAuth(req);
        if(!userId){
            return res.status(401).json({message:"Unauthorised"});


        }
        const user = await User.findOne({clerk:userId});

        if(!user){
            return res.status(404).json({message:"User profile not Synced yet"});


        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protect Route",error.message);

        res.status(500).json({message:"Internal Server error"});


    }
}

