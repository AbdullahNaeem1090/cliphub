import dbConnection from "./dataBase/dbConnection.js";
import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";


dbConnection()
.then(() => {
    app.listen(process.env.PORT,
    () => console.log("App is listening on port", process.env.PORT||8000))//why cant we use it outside listen
}).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

