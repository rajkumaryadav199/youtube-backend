import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv'
import connectDB from "./db/index.js";

const app = express();

dotenv.config({
    path: './env'
})

connectDB();







/* iffy is good habite to write the connection of data base */

/*
( async()=>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        app.on('error', (error)=>{
            console.log(`Error in data base connection`,error );
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listenig on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log('Error' , error);
        throw error;
    }
})
*/