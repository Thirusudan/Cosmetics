import express from 'express'
import { createReview, deleteReview, getReview } from '../Controllers/reviewController.js'


const reviewRouter = express.Router()
reviewRouter.post("/",createReview)
reviewRouter.get("/",getReview)
reviewRouter.delete("/:id",deleteReview)

 export default reviewRouter;