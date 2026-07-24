import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true 
    },

    email :{
        type : String,
        required : true
    },

    rating : {
        type: Number,
        min:1, max:5
        
    },

    review :{
        type : String,
        required : true 
    }, 

},{ timestamps: true }
)

const Review = mongoose.model("review",reviewSchema)
export default Review;