const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type: String
    },
    body:{
        type: String
    },
    photo:{
        type: String,
        default: "no photo"
    },
    status:{
        type: String,
        default:"Unsolved"
    },
    access:{
        type : String,
        default:"Public"
    },
    visibility:{
        type: String
    },
    postedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    }, 
    upvote:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"userModel"
        }
    ],
    downvote:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"userModel"
        }
    ],
    comment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "commentModel"
        }
    ]
})

mongoose.model("postModel", postSchema);