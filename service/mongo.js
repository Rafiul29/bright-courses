import mongoose from "mongoose";


export async function dbConnect(){
  try{
    const conn = mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING));
    console.log("Connnected MongoDB Database")
    return conn;

  }catch(error){
    console.log(error.message)
  }
}