import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
configDotenv.config();

 export function createUser(req,res){
    //1
   const passwordHash = bcrypt.hashSync(req.body.password,10)

   const userData ={
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : passwordHash,
   }

   const user = new User(userData)

    user.save().then(()=>{
        res.json({
            message : "User created successfullly"
        })
    }).catch(()=>{
        res.json({
            message : "Failed to create user"
        })
    })

 }

 export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email: email
        }
    ).then(
        (user)=>{
        if(user== null){
            res.status(404).json( 
                {
                    message : "User not found"
                })
                
        }else{
            //2
            const isPasswordCorrect = bcrypt.compareSync(password,user.password)
            if(isPasswordCorrect){
                
                // //Encrption code  
                const token = jwt.sign(
                    {
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        isBlocked : user.isBlocked,
                        isEmailVerified : user.isEmailVerified,
                        image : user.image
                    },
                    process.env.JWT_SECRET
                   
                )

                res.json(
                    {
                        token : token,
                        message:"Login succesfull"
                    })
            }else{
                res.status(403).json( 
                    {
                        message : "Incorrect password" 
                    })
            }
        }
    })
 }

//3
 export function isAdmin(req){
    if(req.user == null ){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
 }




//1 -  Hashing + Salt
 //2 -Authentication — creating token
 //3 - it is the Authorization process in every controller pages we no need to create a function for Authorization we create in userController and import theisAdmin function that we want 
// ex BEFORE WE USE A FUNCTION AFTER WE CREATED ISADMIN USE FUNCTION B YOU CAN SEE IN PRODUCT CONTROLLER 
//  A. if(req.user == null){
 //       res.status(403).json({
 //           message : "Please login to create a product"
 //       })
 //       return;
 //   }

   // if(req.user.role != "admin"){
   //     res.status(403).json({
   //         message : "You are not authorized to create a product"
   //     })
   // }

   //B. if(isAdmin(req)){
     //      return res.status(403).json({message:"Access denied. Admin only "})
     //  }
   