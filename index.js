const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");
const { forEach, iteratee } = require("lodash");
require("dotenv").config();
require("./models/user");
require("./models/post");
require("./models/comment");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "CLIENT/views"));
app.use(express.static(path.join(__dirname, "CLIENT/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({useTempFiles: true}));

// mongoose.connect("mongodb://127.0.0.1:27017/messDB").then(() => console.log("Connected!")); 

mongoose.connect("mongodb+srv://ishant:"+process.env.MONGO_PASSWORD+"@cluster0.qho5cx4.mongodb.net/MessDB").then(() => console.log("Connected to mongoDB atlas"));



const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");
const commentModel = mongoose.model("commentModel");

// ===== ROUTER FILES =========
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/profile"));
app.use(require("./routes/about"));
app.use(require("./routes/admin"));
app.use(require("./routes/chiefwarden"));
app.use(require("./middlewares/flash"));
// ===== ! ROUTER FILES =======


app.get("/", async (req, res) => {
    const msg = req.flash("msg");
    var toastvalue = "";

    if(req.isAuthenticated()){
        const currUserId = req.user.id;
       
        if(!req.user.hostel){
            return res.redirect("/googleform");
        }
        if(!req.user.hostel && req.user.role == "student"){
            res.redirect("/googleform");
        }
        if(req.user.role == "admin"){
            res.redirect("/adminhome");
        }else if(req.user.role == "chiefwarden"){
            const user = await userModel.find({role: "student"}).exec();
            // const post = await postModel.find().populate("postedby").exec();
            const allPost = await postModel.find().populate("postedby").populate({path: "comment", populate: {path: "commentedby"}});
            // console.log(user);
            // console.log(post);
            // console.log(user[0].name);
            res.render("chiefwarden",
            {
                Alluser: user,
                Allpost: allPost
            }
            ); 
        }
        else{
            const allPost = await postModel.find().populate("postedby").populate({path: "comment", populate: {path: "commentedby"}});
            const newArrayNotificationPost = [];
            allPost.forEach(item =>{
                if( currUserId == item.postedby.id ){
                    // console.log(item);
                    newArrayNotificationPost.push(item);
                }
            })
            res.render("index",{
                allPost: allPost,
                notificationPost : newArrayNotificationPost,
                user: "authenticated",
                toastvalue: "",
                msg: ""
            })
        }
    }
    else{
        if(msg.length > 0){
            toastvalue = "d-block";
        }
        res.render("index",{
            toastvalue: toastvalue,
            user: "notAuthenticated",
            msg: msg
        })
    }
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running.....");
});