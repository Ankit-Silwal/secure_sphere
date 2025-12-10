import express from "express"
import { configDotenv } from "dotenv"
import connectDB from "./src/configs/db.mjs"
import { initRedis } from "./src/configs/redis.mjs"
import router from "./src/routes/auth.mjs"
import cookieParser from "cookie-parser"
import actrouter from "./src/routes/activity.mjs"
configDotenv()
const PORT=process.env.PORT
connectDB()
initRedis()
const app=express()
app.use(express.json())
app.use(cookieParser())
app.get("/", (req, res) => {
  res.json({
    message:"The server is running"
  });
});
app.use("/api/auth",router)
app.use("/api",actrouter)
app.listen(PORT,()=>{
  console.log(`The server begun at  http://localhost/${PORT}`)
})