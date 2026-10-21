import mongoose from "mongoose";


export async function connectDB(){
    try{
            const mongouri = process.env.MONGO_URI;
            if(!mongouri){
                throw new Error("MongoUri is required");

            }
            const conn = await mongoose.connect(mongouri);
            console.log("Mongodb is connnected",conn.connection.host);

    }catch(err){
        console.log("Mongodb connection error:",err.message);
        process.exit(1);
    }
}