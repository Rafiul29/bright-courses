// import mongoose from "mongoose";


// export async function dbConnect(){
//   try{
    
//     const conn = mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING));
//     console.log("Connnected MongoDB Database")
//     return conn;

//   }catch(error){
//     console.log('error')
//     console.log(error.message)
//   }
// }


import mongoose from "mongoose";

export async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    throw error;
  }
}
