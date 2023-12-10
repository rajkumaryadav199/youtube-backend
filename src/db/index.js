import mongoose from "mongoose";
import express from "express";

import { DB_NAME } from "../constants.js";

const connectDB = async() =>{
    try {
        const connectInstant = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        console.log(`\n MongoDb connected || DB HOST : ${connectInstant.connection.host}`)
    } catch (error) {
        console.log('MONGODB connection error', error);
        process.exit(1);
    }
}

export default connectDB;