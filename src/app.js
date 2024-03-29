const express = require("express");
const app = express()
const path = require("path")
const hbs = require("hbs")
const bcrypt = require("bcryptjs");
const register = require("./models/register")
const fm = require("./models/fileManager")
const {auth, authAdmin, authFaculty} = require("./middleware/auth")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require('dotenv').config();
app.use(cookieParser())

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

const PORT = process.env.PORT || 8000;
const SUPPORT_MAIL = process.nextTick.SUPPORT_MAIL || "resourcebank.it@nitj.ac.in"

// Making GET requests
app.get("/login", (req,res)=>{
    res.clearCookie('itrbauth')
    res.render("login")
})
app.get("/changePassword", (req, res)=>{
    let token = jwt.verify(req.cookies.itrbauth, process.env.SECRET)
    let email = token.username
    Users.findOne({username: email})
    .then(async function(val, err){
        if(val == null){
            return res.status(201).render("login", {problem: "UserDNE", username: email})
        }
        else{
            var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
            var otpGenSafe = await bcrypt.hash(otpGen, 10);
            await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal" , "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
            .then(data => {
                console.log('Mail sent successfully')
                return res.status(201).render("forgot", {username: email, password: process.env.FORGOTPASS, otp: otpGenSafe, registered: ""})
            })
            .catch(err => {
                console.log('Failed to send email:\n' + err)
            })  
         }
    })
})
app.get("/home", auth, async (req,res)=>{
    let token = jwt.verify(req.cookies.itrbauth, process.env.SECRET)
    let isAdmin = token.admin;
    (async function(){
        const {facultyF, faculty_xl} = await fm.getFacultyData() 
        res.status(201).render("index", {username: req.body.username, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin})
    })()
})
app.get("/admin", authAdmin, async(req, res)=>{
        res.status(201).render("admin")
})
app.get("/curriculum", auth, (req,res)=>{
    res.render("curriculum")
})
app.get("/semester", auth, (req,res)=>{
    try{
        (async function(){
            const {semFiles, pyqFiles, child} = await fm.getSemData(req.query.semNum)
            return res.status(201).render("semester", {semNum: req.query.semNum, semID: child, pyqs: JSON.stringify(pyqFiles), semF: JSON.stringify(semFiles)})
        })()
    }
    catch{
        console.log(error)
    } 
})
app.get("/subject", auth, (req,res)=>{
    try{
        (async function() {
            const {bookF, notesF, pptF, otherF, excelF} = await fm.getSubData(req.query.semID, req.query.subName)
            return res.status(201).render("subject", {subName: req.query.subName, bookF: JSON.stringify(bookF), notesF: JSON.stringify(notesF), pptF: JSON.stringify(pptF), otherF: JSON.stringify(otherF), excelF: JSON.stringify(excelF)});
      })();
    }
    catch(err){
        console.log(err);
    }
})
app.get("/dsa",auth ,(req,res)=>{
    res.render("dsa")
})
app.get("/placement",auth ,(req,res)=>{
    res.render("placement")
})
app.get("/support", auth, (req,res)=>{
    res.render("feedback")
})
app.get("/team", auth, (req,res)=>{
    res.render("team")
})
app.get("*", (req,res)=>{
    res.render("404")
})

//Making POST requests
app.post("/login", async (req, res) => {
    try{
        let email = (req.body.mail).toLowerCase();
        let password = req.body.pass;
        if(!await register.isMailValid(email)){
            return res.status(201).render("login", {problem: "InvalidMail", username: ""})
        }
        else if(!await register.isPassStrong(password)){
            return res.status(201).render("login", {problem: "WeakPassword", username: email})
        }
        else{
            password = await bcrypt.hash(password, 10);
            Users.findOne({username: email})
            .then(async function(val, err){
                if(val == null){
                    var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                    var otpGenSafe = await bcrypt.hash(otpGen, 10);
                    var userEncrypted = await bcrypt.hash(email, 10);
                    await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal" , "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
                    .then(data => {
                        console.log('Mail sent successfully')
                        return res.status(201).render("verifyOTP", {username: userEncrypted, password: password, otp: otpGenSafe, registered: "No"})
                    })
                    .catch(err => {
                        console.log('Failed to send email:\n' + err)
                        return res.status(201).render("login");
                    })  
                }
                else{
                    let match = await bcrypt.compare(req.body.pass, val.password);
                    var userEncrypted = await bcrypt.hash(email, 10);
                    if(match){
                        return res.status(201).render("verifyOTP", {username: email, usernameEnc: userEncrypted, password: password, otp: otpGenSafe, registered: "Yes"})
                    }
                    else{
                        return res.status(201).render("login", {problem: "InvalidPassword", username: email})
                    }
                 } 
            })
        }                   
    }
    catch (err){
        // console.log(err)
    }
}) 

app.post("/changePassword", async (req, res) =>{
    let email = (req.body.mail).toLowerCase();
    if(!await register.isMailValid(email)){
        return res.status(201).render("login", {problem: "InvalidMail", username: ""})
    }
    else{
        Users.findOne({username: email})
        .then(async function(val, err){
            if(val == null){
                return res.status(201).render("login", {problem: "UserDNE", username: email})
            }
            else{
                var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                var otpGenSafe = await bcrypt.hash(otpGen, 10);
                var userEncrypted = await bcrypt.hash(email, 10);
                await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal" , "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
                .then(data => {
                    console.log('Mail sent successfully')
                    return res.status(201).render("forgot", {username: email, usernameEnc: userEncrypted, password: process.env.FORGOTPASS, otp: otpGenSafe})
                })
                .catch(err => {
                    console.log('Failed to send email:\n' + err)
                })  
             }
        })
    }
})
        
app.post("/home", async (req, res)=>{
    let userOTP = req.body.otp, otpGen = req.body.otpGen, pass = req.body.password, user = req.body.username, userEnc=req.body.usernameEnc;
    let isAdmin = await register.isAdmin(user)
    if(!await bcrypt.compare(user, userEnc)){
        return res.status(201).render("login", {problem: "Invalid User", username: user})
    }
    if(pass == process.env.FORGOTPASS){
        let newPass = await bcrypt.hash(req.body.pass, 10);
        if(!await register.isPassStrong(newPass)){
            return res.status(201).render("forgot", {problem: "WeakPassword", username: user, usernameEnc: userEnc, password: pass, otp: otpGen})
        }
        else if(!await bcrypt.compare(userOTP, otpGen)){
            return res.status(201).render("forgot", {problem: "InvalidOTP", username: user, usernameEnc: userEnc, password: pass, otp: otpGen})
        }
        else{
            await Users.updateOne({username: user}, {$set: {password: newPass}}, {});
            const registerUser = await Users.findOne({username: user});
            const token = await registerUser.generateAuthToken()
            res.cookie("itrbauth", token, {
                expires: new Date(Date.now() + 1300000000),
                httpOnly: true
            });
            (async function(){
                const {facultyF, faculty_xl} = await fm.getFacultyData() 
                return res.status(201).render("index", {username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin})
            })()
        }
    }
    else{
        const registerUser = new Users({
            username: user,
            password: pass,
            admin: isAdmin,
            faculty: false
        })
        if(userOTP == "Account exists"){
            const token = await registerUser.generateAuthToken()
            res.cookie("itrbauth", token, {
                expires: new Date(Date.now() + 1300000000),
                httpOnly: true
            });
            (async function(){
                const {facultyF, faculty_xl} = await fm.getFacultyData() 
                return res.status(201).render("index", {username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin})
            })()
        }
        else if(!await bcrypt.compare(userOTP, otpGen)){
            return res.status(201).render("verifyOTP", {problem: "InvalidOTP"})
        }
        else{
            try{
                const token = await registerUser.generateAuthToken()
                res.cookie("itrbauth", token, {
                    expires: new Date(Date.now() + 1300000000),
                    httpOnly: true
                })
                await registerUser.save()
                .then(() => console.log("Saved successfully"))
                .catch((err) => console.log(err));
                (async function(){
                    const {facultyF, faculty_xl} = await fm.getFacultyData() 
                    return res.status(201).render("index", {username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin})
                })()
            }
            catch(err){
                console.log(err)
            }
        }
    }
})

app.post("/support", auth, async(req, res)=>{
    try{
        await register.sendMail(SUPPORT_MAIL, SUPPORT_MAIL, req.body.subject, req.body.name + " says,\n" + req.body.message+"\n\nSender Mail: "+req.body.email);
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