import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import studentRouter from "./routers/studentRouter.js";

const app= express()

app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){
            const token = value .replace("Bearer ","")
            jwt.verify(token,"cbc-6503",
            (err,decoded)=>{
                if(decoded == null){
                    res.status(403).json(
                        {
                            message : "Unauthorized"
                        })
                }else{
                   req.user = decoded
                        console.log(decoded)                 
                        next()
                }
               
            }
        )
        }else{
         next()
        }
}
)

const connectionString = "mongodb+srv://admin:123@cluster0.cagkpoc.mongodb.net/?appName=Cluster0"
 
mongoose.connect(connectionString).then( 
    ()=>{
    console.log("Connected to database")
}
).catch(
    ()=>{
     console.log("Failed to connect to the database")
}) 

app.use("/users",userRouter)
app.use("/students",studentRouter)






app.listen(5000,()=>{
    console.log("server started")
})

