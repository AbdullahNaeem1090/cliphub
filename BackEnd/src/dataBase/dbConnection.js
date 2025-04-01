import mongoose from 'mongoose'

const dbConnection=async()=>{
    try {
       await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log("DB connected")
    } catch (error) {
        console.log("DB Connection Failed => ",error)
        process.exit(1)
    }
}

export default dbConnection