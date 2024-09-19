import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})

const port = process.env.PORT || 8000

// We use async/awit that in connectDB method and when async/await method completed then it return Promise.
connectDB() 
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR ON:", error);
            throw error
        })

        app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        })
    })
    .catch((error) => {
        console.log("MONGODB connection failed || ", error);
    })
























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
