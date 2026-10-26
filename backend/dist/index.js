import express from "express";
import "dotenv/config";
import {connectDB} from "../lib/db.js";
import { clerkMiddleware } from '@clerk/express'
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(),"public");


const app = express();
app.use(express.json());
app.use(cors({origin:process.env.FRONTEND_URL,Credential:true}));



app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true});

});

// if the public directory exits then serve the static files
// production bulid;

if(fs.existsSync(publicDir)){
app.use(express.static(publicDir));
app.get("/{*any}",(req,res,next)=>{
    res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));

});
}



app.listen(process.env.PORT,()=>{
    connectDB();

    console.log("server is listening up on port "+process.env.PORT);

});
