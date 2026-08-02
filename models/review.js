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
    
    reply:{
        text:{type:String,default:null},
        repliedAt :{type:Date,default:null}
    }
    

},{ timestamps: true }
)

const Review = mongoose.model("reviews",reviewSchema)
export default Review;