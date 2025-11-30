import express from "express"
import { configDotenv } from "dotenv"
import connectDB from "./src/configs/db.mjs"
configDotenv()
const PORT=process.env.PORT
connectDB()
const app=express()
app.get("/", (req, res) => {
  res.json({
    msg:"The server is running"
  });
});
app.listen(PORT,()=>{
  console.log(`The server begun at  http://localhost/${PORT}`)
})