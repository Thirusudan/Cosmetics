import express from 'express'
import { createReview, deleteReply, deleteReview, getReview, replyToReview } from '../Controllers/reviewController.js'


const reviewRouter = express.Router()
reviewRouter.post("/",createReview)
reviewRouter.get("/",getReview)
reviewRouter.delete("/:id",deleteReview)
reviewRouter.patch("/:id", replyToReview)
reviewRouter.patch("/reply/delete/:id", deleteReply)


 export default reviewRouter;