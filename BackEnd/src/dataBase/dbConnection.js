import mongoose from 'mongoose'

console.log(process.env.DB_URL);

const dbConnection=async()=>{
    try {
       await mongoose.connect(`${process.env.DB_URL}`);
        console.log("DB connected")
    } catch (error) {
        console.log("DB Connection Failed => ",error) 
        process.exit(1)
    }
} 

export default dbConnection