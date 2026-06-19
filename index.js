import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import studentRouter from "./routers/studentRouter.js";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config() 

const app= express()

app.use(bodyParser.json())
app.use(cors())

app.use(
    (req,res,next)=>{
        
        const value = req.header("Authorization")
        if(value != null){
            const token = value .replace("Bearer ","")
            jwt.verify(
                token,
                process.env.JWT_SECRET,  //2
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

const connectionString = process.env.MONGO_URI  //1 

mongoose.connect(connectionString).then( 
    ()=>{
    console.log("Connected to database")
}
).catch(
    ()=>{
     console.log("Failed to connect to the database")
}) 

app.use("/api/users",userRouter)
app.use("/api/students",studentRouter)
app.use("/api/products",productRouter)





app.listen(5000,()=>{
    console.log("server started")
})

//1 - BEFORE IN THIS LINE HAVE THE MONGODB URL BUT THERE IS A PROBLEM WHEN WE SAVE GIT THE MONGO DB URL IS IN PUBLIC SO WE HAVE TO HIDE CREATE .env FOLDER AND THE PASTE THE URL TO .ENV AND IN THIS STEP WE HAVE TO USE dotenv LIBRARY AND THE dotenv.config()
// 2 - 2ND ALSO SAME AS IN 1ST METHOD