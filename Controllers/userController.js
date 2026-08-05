import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import axios from "axios";
import nodemailer from "nodemailer"
import OTP from "../models/otp.js";
const pw = "bcriqmybpnhmoqem"

dotenv.config();

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure:false,
    auth:{

        user:"thirusudan110@gmail.com",
        pass:pw,
    }
})

 export function createUser(req,res){
     const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

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
        res.status(400).json({
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
                        message:"Login succesfull",
                        role:user.role,
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
// to identify the user name
export function getUser(req,res){
    if(req.user == null){
        res.status(404).json({
            message:"User not found"
        })
    }else{
        res.json(req.user)
    }
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

//4
 export async function googleLogin(req,res){
    const googleToken = req.body.token //read the token come from front end
   
    try{
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
        headers :{
            Authorization : `Bearer ${googleToken}`
        }
    })

/*5*/
    const user = await User.findOne({
        email:response.data.email,
    })

/*6*/   if(user !=null){
        const token = jwt.sign({
            email:user.email,
            firstName:user.firstName,
            lastName : user.lastName,
            role : user.role,
            isBlocked : user.isBlocked,
            isEmailVerified : user.isEmailVerified,
            image: user.image,
        },
    process.env.JWT_SECRET
      )
      res.json({
        token: token,
        message : "Login succesfull",
        role:user.role,
      })
/*7*/    }else {
        const newUser = new User({
            email : response.data.email,
            firstName:response.data.given_name,
            lastName : response.data.family_name,
            image: response.data.picture,
            role : "user",
            isBlocked : false,
            isEmailVerified : true ,
            password : "123"
        })
        
    await newUser.save();

    const token = jwt.sign(
                {
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    role: newUser.role,
                    isBlocked: newUser.isBlocked,
                    isEmailVerified: newUser.isEmailVerified,
                    image: newUser.image,
                },
                process.env.JWT_SECRET
            );

            res.json({
                token: token,
                message: "User created successfully",
                role: newUser.role,
            });
    }

        }catch (error){
        console.error("Error fetching Google user info:",error);
        res.status(500).json({
            message : "Failed to authenticate with google",
        })
    }
}
    
export async function sendOTP(req,res){
    const email = req.body.email
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    //delete all otps from the email
    try{
         await OTP.deleteMany({email:email})        
         const newOTP = new OTP({email:email, otp:otpCode}); 
        await newOTP.save();

        const message = {
            from : "thirusudan110@gmail.com",
            to:email,
            subject : "Your OTP code",
            text : `your OTP CODE IS ${otpCode}`, 
        }
        transporter.sendMail(message,(error,info)=>{
            if(error){
                console.error("Error sending email:", error);
                res.status(500).json({message:"Failed to send OTP"})
            }else{
                console.log("Email sent:",info.response)
                res.json({message:"OTP sent successfully"})
            }
        })
    }catch(err){
        console.error("sendOTP error:", err)
        res.status(500).json({message:"Failed to delete previous OTPS"})
    }
}

export async function resetPassword(req,res){
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const otp = Number(req.body.otp); 


    try{
        const otpRecord = await OTP.findOne({ email: email, otp: otp });
        if(!otpRecord){
            return res.status(404).json({ message: "Invalid OTP" });
        }

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.updateOne({ email: email }, { password: hashedPassword });
        await OTP.deleteMany({ email: email });

        res.json({ message: "Password reset successfully" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to reset password" });
    }
}



//reset password and sendotp function are explained in frotendforgetpassword page


/*

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


     4.Step 4 (step 1,2,3,4 are in the frontend) — Backend receives the token and asks Google who it belongs to javascript -   The backend takes the Google token it received, and asks Google's own server: "who does this token belong to?" Google replies with real info — response.data.email, given_name, family_name, picture.
   
     5 - Step 5 — Backend checks its own database for that email This single line decides which of the two branches below will run.


     6. Since the user was found, it just logs them in — generates the app's own JWT token using their existing database record, including whatever role they already have ("admin" or "user"). No new account is created.

    7-  Branch B — the email does NOT exist yet (brand new person, first-time Google login)
    Since no matching email was found, a brand new account gets created automatically — using Google's info for the name/picture, role is hardcoded to "user" (new signups can never become admin this way), isEmailVerified: true (since Google already verified it — no separate verification email needed), and a placeholder password: "123" (they'll only ever log in via Google, so a real password isn't needed).

    8.step 6 — Backend sends the response back, frontend finishes the job
Both branches send back the same shape: { token, message, role }. Back on the frontend (step 3's .then()), this is received: the app's token gets saved in localStorage, a success toast shows, and the person is redirected — /admin if role is "admin", / if role is "user".
 res.json({...}) is Express's way of sending data back as the HTTP response. Whatever object is inside res.json(...) becomes the actual body of the response that travels back over the network to whoever made the request — in this case, the frontend's axios.post(...) call.

 step 7 will be in frontend
     */