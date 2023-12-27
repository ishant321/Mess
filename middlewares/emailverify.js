const nodeMailer = require("nodemailer");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userModel = mongoose.model("userModel");
const axios = require("axios");


router.get("/verify-email", async (req, res)=> {
    try{
        //To verify if the mail is valid or not
        await axios.get('https://api.hunter.io/v2/email-verifier?email='+req.user.email+'&api_key='+process.env.EMAIL_VERIFICATION_API+'')
        .then(async response => {
            if(response.data.data.status !== "valid"){
                const user = await userModel.findByIdAndDelete(req.user.id);
                req.flash("msg", "Invalid email");
                return res.redirect("/signup");
            }
        })
        .catch(error => {
            console.log(error);
        });

        //To verify the domain name of email
        const domain = req.user.email.slice(req.user.email.indexOf("@") + 1);
        if(domain !== "mnnit.ac.in"){
            const user = await userModel.findByIdAndDelete(req.user.id);
            req.flash("msg", "Invalid domain name");
            return res.redirect("/signup");
        }
        else{
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "themessrelay@gmail.com",
                    pass: process.env.SMTP_MAIL_PASSWORD
                }
            })

            const mailOptions = {
                from: "themessrelay@gmail.com",
                to: req.user.email,
                subject: "For email verification: Mess Relay",
                html: '<p>Hii '+req.user.name+', please click here to <a href="http://localhost:3000/email-verify/'+req.user.id+'">verify</a> your mail.</p>'
            }

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    req.flash("msg", error);
                    return res.redirect("/signup");
                }
                else{
                    req.logout(function(err) {
                        if (err) { 
                            console.log(err);
                         }
                         req.flash("msg","Email sent for verification");
                         res.redirect("/signup");
                    });
                }
            })
        }
    }
    catch(error){
        console.log(error);
    }
})

router.get("/email-verify/:userId", async (req, res) => {
    const user = await userModel.findByIdAndUpdate(req.params.userId, { $set: { is_verified: true }});
    console.log(user);
    res.redirect("/login");
})

module.exports = router;
