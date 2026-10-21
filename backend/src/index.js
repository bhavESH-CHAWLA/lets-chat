import express from "express";
import "dotenv/config";
import {connectDB} from "../lib/db.js";
import { clerkMiddleware } from '@clerk/express'



const app = express();
app.use(express.json());
app.use(cors({origin:process.env.FRONTEND_URL,Credential:true}));


app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true});

})

app.listen(process.env.PORT,()=>{
    connectDB();

    console.log("server is listening up on port "+process.env.PORT);

});
