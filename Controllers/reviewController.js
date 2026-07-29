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
     
   }catch{
    (err)
     console.error(err)
     res.status(500).json({message: "Failed to delete review"})
   }


}
