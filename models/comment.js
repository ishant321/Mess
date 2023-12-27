const mongoose = require("mongoose");
const userModel = mongoose.model("userModel");

const commentSchema = new mongoose.Schema({
    body:{
        type: String
    },
    commentedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    }
})

mongoose.model("commentModel", commentSchema);