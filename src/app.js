import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"; 

const app = express()

// Read documentation for feature.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Isse pahile body parser use karna padta tha.
// Some Page send data in following format: 
    //  - JSON 
    //  - req body mai bhejege forms se
    //  - JSON forms
    //  - Best practice we use limit for not crashing server.
// Also read documentation.
app.use(express.json({
    limit: "16kb",
}))

// URL-Encoder: kshitij+tidke kshitij%20tidke
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// We make public assets here many time we want to store files folder pdf images this are public asset any person can access this assets.
app.use(express.static("public"))

// We can perform CRUD operations securely.
app.use(cookieParser())

export { app }