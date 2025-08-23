import mongoose from "mongoose";


const connectDB = async () => {
 try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\n Mongodb connected !! Db host : ${connectionInstance.connection.host}`)
 } catch (error) {
    console.error("Error in mongodb connection " , error)
    process.exit(1)
 }  
}

export default connectDB