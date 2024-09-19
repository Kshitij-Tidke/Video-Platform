import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})

connectDB()























// First Approach with mess 
/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants"
import express from "express";
const app = express()

// First approach 
function connectDB() {}
connectDB()

// Second approach
// ; is for cleaning perpose 
// Database se connect karne ke pahile try catch, promises,
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Unable to talk with database");
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR || ",error);
        throw error
    }
})()
*/
