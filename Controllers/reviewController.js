import Review from "../models/review.js"
import { isAdmin } from "./userController.js"

export async function createReview(req,res){
    try{
    const review = new Review({
        name : req.body.name,
        email : req.body.email,
        rating : req.body.rating,
        review : req.body.review
    })
    await review.save()
        res.json({
            messsage : "Review submitted successfully"
        })
    }catch(err){
          console.error(err)
          res.status(500).json({message : "Failed to submit review"})
    }
}

export async function getReview(req,res){
    console.log("Fetching Reviews")
      try{
   const reviews = await Review.find().sort({ createdAt: -1 })
        res.json(reviews)
      }catch(err){
        console.error(err)
        res.status(500).json({message :"Failed to fecth reviews"})
      }
}

export async function deleteReview(req,res){
   if(!isAdmin(req)){
  return res.status(403).json({
        message:"You are not authorized to delete reviews"
    })
   }

   try{
    const deleted =  await Review.findByIdAndDelete(req.params.id)
    if(!deleted){
        return res.status(404).json({messgae:"Review Not found"})
    }
    res.json("Review deleted successuly")
     
   }catch(err){
     console.error(err)
     res.status(500).json({message: "Failed to delete review"})
   }
}

export async function replyToReview(req,res){
     if(isAdmin(req)){
    try{
     const updated = await Review.findByIdAndUpdate(
        req.params.id,{
            reply:{
                text: req.body.reply,
                repliedAt : new Date()
            }
        },
        { new: true }
     )
     if(!updated){
        return res.status(404).json({message:"Review not found"})
     }
     res.json(updated)

    }catch{
     console.error(err)
     res.status(500).json({message: "Failed to reply to review"})
   }
    }
}

export async function deleteReply(req,res){
   if(isAdmin(req)){
   try{
       const deleted = await Review.findByIdAndUpdate(
        req.params.id,
        {
            reply: {
                text: null,
                repliedAt: null
            }
        },
        { new: true }
    )
    if(!deleted){
        return res.status(404).json({messgae:"Reply Not found"})
    }
    res.json("Reply deleted successuly")
     
   }catch (error){
     console.error(error)
     res.status(500).json({message: "Failed to delete Reply"})
   }
}
}

  



