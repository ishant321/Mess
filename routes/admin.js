const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var _ = require("lodash");
const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");
const commentModel = mongoose.model("commentModel");
require("../middlewares/flash");


router.get("/admin", (req, res) => {
    res.render("admin/admin");
})

router.get("/adminhome", async (req, res) => {
    if(req.isAuthenticated()){
        const adminUser = await userModel.findById(req.user.id);
        if(adminUser.role == "admin"){
            const allStudent = await userModel.find({role: "student"});
            const allAccountant = await userModel.find({role: "accountant"});
            const allAdmin = await userModel.find({role: "admin"});
            const chiefWarden = await userModel.find({role: "chiefwarden"});

            const msg = req.flash("msg");
            var toastvalue = "d-block";

            if(msg.length == 0){
                toastvalue = "";
            }

            res.render("admin/adminhome", {
                allStudent: allStudent, 
                allAccountant: allAccountant,
                allAdmin: allAdmin, 
                chiefWarden: chiefWarden,
                adminUser: adminUser,
                toastvalue: toastvalue,
                msg: msg
            });
        }
        else{
            res.redirect("/");
        }
    }
    else{
        res.render("admin/admin");
    }
})

router.post("/removeuser/:id", async (req, res) => {
    if(req.isAuthenticated()){
        if(req.user.role == "admin"){
            const userId = req.params.id;
            const deleteComment = await commentModel.deleteMany({commentedby: userId});
            const allPost = await postModel.find();
            for(var i = 0; i < allPost.length; i++){
                var curPostUpvote = allPost[i].upvote;
                var curPostDownvote = allPost[i].downvote;
                if(curPostUpvote.find((user) => user == userId)){
                    await postModel.findByIdAndUpdate(allPost[i].id, {$pull: {upvote: userId}});
                }
                if(curPostDownvote.find((user) => user == userId)){
                    await postModel.findByIdAndUpdate(allPost[i].id, {$pull: {downvote: userId}});
                }
                if(allPost[i].postedby.id === userId){
                    var temp = allPost[i].id;
                    await postModel.findByIdAndDelete(temp);
                    await commentModel.deleteMany({commentedon: temp});
                }
            }
            await postModel.deleteMany({postedby: userId});
            const user = await userModel.findByIdAndDelete(req.params.id);
            req.flash("msg", "user successfully removed.");
            res.redirect("/adminhome");
        }
        else{
            res.render("index", {
                toastvalue: "show",
                msg: "Unauthorized",
                user: "notAuthenticated"
            });
        }
    }
    else{
        res.render("admin/admin");
    }
})

router.post("/admin/addnewuser", (req, res) => {
    console.log(req.body);
})


module.exports = router;