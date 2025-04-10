import express from "express"
import dotenv from "dotenv"
import AuthRoutes from "./routes/auth.routes.js"
import connectMongoDB from "./db/connectMongoDB.js"


dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000

app.post("/api/auth", AuthRoutes)


app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT} `)
    connectMongoDB()
})