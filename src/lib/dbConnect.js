import mongoose from "mongoose";
import { NextResponse } from "next/server";

const connectDB=async()=>{
    if (mongoose.connection.readyState >= 1) {
        return NextResponse.json({ message: "Already connected to database" });
    }
    else{
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("DB connected");
            return NextResponse.json({message:"Database connected"})
        } catch (error) {
            console.error("DB connection error:", error);
            // return NextResponse.json({message:error})
            process.exit(1);
        }
    }
}

export default connectDB;