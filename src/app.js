const path = require("path")
const hbs = require("hbs")
const express = require("express");
// const nodeMail = require("nodemailer");
const app = express()
const PORT = process.env.PORT || 8000;

// Setting up path
const staticPath = path.join("../public")     
app.use(express.static(staticPath))
app.set('view engine', "hbs");

// Setting up partials
const partialPath = "../partials"
hbs.registerPartials(partialPath);

// Connecting to database
require("./db/conn")
const Users = require("./models/user")
app.use(express.urlencoded({extended:false}));

// async function receiveMail(name, email, subject, message) {
//     const transporter = nodeMail.createTransport({
//       service: "gmail",
//       auth: {
//         user: "resourcebank.it@nitj.ac.in",
//         pass: "ResourceBank@IT2023",
//       },
//     });
//     const mailOption = {
//       from: email,
//       to: "resourcebank.it@nitj.ac.in",
//       subject: subject,
//       html: `You got a message from 
//       Email : ${email}
//       Name: ${name}
//       Message: ${message}`,
//     };
//     try {
//       await transporter.sendMail(mailOption);
//       return Promise.resolve("Message Sent Successfully!");
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }

// Making GET requests
app.get("/login", (req,res)=>{
    res.render("login")
})
app.get("/home", (req,res)=>{
    res.render("index")
})
app.get("/curriculum", (req,res)=>{
    res.render("curriculum")
})
app.get("/semester", (req,res)=>{
    res.render("semester")
})
app.get("/subject", (req,res)=>{
    res.render("subject.hbs")
})
app.get("/feedback", (req,res)=>{
    res.render("feedback.hbs")
})
app.get("*", (req,res)=>{
    res.render("404.hbs")
})

//Making POST requests
app.post("/login", async (req, res) => {
    try{
        Users.findOne({username: req.body.mail})
            .then(function(val, err){
                if(val == null){
                    var otpGen = Math.floor(100000 + (Math.random() * (1000000 - 100000)))
                    // URL of deployed AppScript project
                    let url = "https://script.google.com/macros/s/AKfycbyWbN7L_H_TcBUsPlNIT6T_Kx2DHkBZHosz3JMSInt9IuvZW34ziCWNwgp_IL7O71jfxQ/exec";
                    // Getting form data and appending OTP to it to pass to AppScript
                    let data = new FormData()
                    data.append('otp', otpGen)
                    data.append('mail', req.body.mail)
                    // Making call to AppScript using fetch API
                    fetch(url, {
                            method: "POST",
                            mode: 'no-cors',
                            body: data,
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log('Mail sent successfully')
                            res.status(201).render("verifyOTP", {username: req.body.mail, password: req.body.pass, otp: otpGen, registered: "No"})
                        })
                        .catch(err => {
                            console.log('Failed to send email')
                            res.status(201).render("verifyOTP", {username: req.body.mail, password: req.body.pass, otp: otpGen, registered: "No"})
                        })
                    
                }
                else{
                    if(val.password == req.body.pass){
                        res.status(201).render("verifyOTP", {username: req.body.mail, password: req.body.pass, otp: otpGen, registered: "Yes"})
                    }
                    else{
                        res.status(201).render("login", {problem: "Yes", username: req.body.mail})
                    }
                } 
            })
        }                   
        catch (err){
            console.log(err)
        }
    })

app.post("/home", async (req, res)=>{
    if(req.body.otp == "Account exists"){
        res.status(201).render("index", {username: req.body.username})
    }
    else{
        try{
            const registerUser = new Users({
                username: req.body.username,
                password: req.body.password,
                otp: req.body.otp
            })
            await registerUser.save()
            .then(() => console.log("Saved successfully"))
            .catch((err) => console.log(err))
            res.status(201).render("index", {username: req.body.username})
        }
        catch(err){
            console.log(err)
        }
    }
})

app.post("/feedback", async(req, res)=>{
    try{
        await receiveMail(req.body.name, req.body.email, req.body.subject, req.body.message);
        console.log("Feedback sent successfully")
    }
    catch(err){
        console.log(err)
    }
    res.status(201).render("feedback")
})

app.listen(PORT, ()=>{
    console.log("Listening to port " + PORT); 
})
