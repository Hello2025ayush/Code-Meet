import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("DATABASE CONNECTED SUCCESFULLY !!");
    }
    catch(error){
        console.log("ERROR IN DB CONNECTION !!", error.message);
        
        process.exit(1);
    }
}

export default connectDB;  