import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        // It give you return object
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // console.log(connectionInstance);
        console.log(`MongoDB connected`);
        // console.log(`DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error" ,error);
        //Node.js 
        process.exit(1)        
    }
}

export default connectDB