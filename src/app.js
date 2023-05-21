const path = require("path")
const hbs = require("hbs")
var {google} = require("googleapis");
var key = require("../private_key.json");
var XLSX = require('xlsx');
var fs = require("fs");
require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs")
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

// Loading the root google drive directory
var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/drive'],
    null
  );
var parent = process.env.PARENT;
var facultyID = process.env.FACULTY;

async function loadChild(parent, jwtClient){
    try {
      await jwtClient.authorize();
      var service = google.drive("v3");
      var response = await service.files.list({
        auth: jwtClient,
        pageSize: 900,
        q: `'${parent}' in parents`,
        fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)'
      });
      var files = response.data.files;
      return files;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  
async function downloadFile(fileId){
    try{
        await jwtClient.authorize();
        var service = google.drive("v3");
        var response = await service.files.get(
            {fileId: fileId, alt: 'media', auth: jwtClient},
            {responseType: 'arraybuffer'});
        const workbook = XLSX.read(response.data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const array = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        return array;
    }catch(err){
        console.log(err);
    }
}

function isMailValid(mail){
    if(mail.endsWith('@nitj.ac.in')){
        return true;
    }
    return false;
}

function isPassStrong(pass){
    // if(pass.length < 8){
    //     return false;
    // }
    // let a = 0, A = 0, n = 0;
    // for(let i=0;i<pass.length;i++){
    //     if(pass.charAt(i) >= 'a' && pass.chatAt(i) <= 'z'){
    //         a++;
    //     }
    //     if(pass.charAt(i) >= 'A' && pass.chatAt(i) <= 'Z'){
    //         A++;
    //     }
    //     if(pass.charAt(i) >= '0' && pass.chatAt(i) <= '9'){
    //         n++;
    //     }
    // }
    // if(a == 0 || A == 0 || n == 0){
    //     return false
    // }
    return true
}
 async function convertYoutubeUrlToEmbed(url) {
    try{
        let apiUrl = "https://www.youtube.com/oembed?url=" + url + "&format=json"; // construct the API URL
        let code = await fetch(apiUrl) // make a request to the API
          .then(response => response.json()) // parse the response as JSON
          .then(data => {
            return data.html; // return the embed code
          })
        return code;
    }catch(err) {
        console.error(err); // handle errors
    };
  }

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
app.get("/home", async (req,res)=>{
    let facultyF = await loadChild(facultyID, jwtClient);
    let facultyExcelID = ""
    for(let i=0;i<facultyF.length;i++){
        if(facultyF[i].name == "faculty_list.xlsx"){
            facultyExcelID = facultyF[i].id
            break
        }
    }
    let faculty_xl = await downloadFile(facultyExcelID);
    res.status(201).render("index", {facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl)})
})
app.get("/curriculum", (req,res)=>{
    res.render("curriculum")
})
app.get("/semester", (req,res)=>{
    res.render("semester")
})
app.get("/subject", (req,res)=>{
    res.render("subject")
})
app.get("/feedback", (req,res)=>{
    res.render("feedback")
})
app.get("/team", (req,res)=>{
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
        if(!isMailValid(email)){
            res.status(201).render("login", {problem: "InvalidMail", username: ""})
        }
        else if(!isPassStrong(password)){
            res.status(201).render("login", {problem: "WeakPassword", username: email})
        }
        else{
            password = await bcrypt.hash(password, 10);
            Users.findOne({username: email})
            .then(async function(val, err){
                if(val == null){
                    var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                    var otpGenSafe = await bcrypt.hash(otpGen, 10);
                    // URL of deployed AppScript project
                    let url = process.env.MAIL_URL;
                    // Getting form data and appending OTP to it to pass to AppScript
                    let data = new FormData()
                    data.append('otp', otpGen)
                    data.append('mail', email)
                    // Making call to AppScript using fetch API
                    fetch(url, {
                            method: "POST",
                            mode: 'no-cors',
                            body: data,
                        })
                        .then(res => res.text())
                        .then(data => {
                            console.log('Mail sent successfully')
                            res.status(201).render("verifyOTP", {username: email, password: password, otp: otpGenSafe, registered: "No"})
                        })
                        .catch(err => {
                            console.log('Failed to send email')
                            res.status(201).render("verifyOTP", {username: email, password: password, otp: otpGenSafe, registered: "No"})
                        })   
                    }
                    else{
                        let match = await bcrypt.compare(req.body.pass, val.password);
                        if(match){
                            res.status(201).render("verifyOTP", {username: email, password: password, otp: otpGenSafe, registered: "Yes"})
                        }
                        else{
                            res.status(201).render("login", {problem: "InvalidPassword", username: email})
                        }
                    } 
                })
            }                   
        }
        catch (err){
            console.log(err)
        }
    })
        
app.post("/home", async (req, res)=>{
    let facultyF = await loadChild(facultyID, jwtClient);
    let facultyExcelID = ""
    for(let i=0;i<facultyF.length;i++){
        if(facultyF[i].name == "faculty_list.xlsx"){
            facultyExcelID = facultyF[i].id
            break
        }
    }
    let faculty_xl = await downloadFile(facultyExcelID);
    let userOTP = req.body.otp, otpGen = req.body.otpGen;
    if(userOTP == "Account exists"){
        res.status(201).render("index", {username: req.body.username, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl)})
    }
    else if(!await bcrypt.compare(userOTP, otpGen)){
        res.status(201).render("verifyOTP", {problem: "InvalidOTP"})
    }
    else{
        try{
            const registerUser = new Users({
                username: req.body.username,
                password: req.body.password,
                otp: req.body.otpGen
            })
            await registerUser.save()
            .then(() => console.log("Saved successfully"))
            .catch((err) => console.log(err))
            res.status(201).render("index", {username: req.body.username, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl)})
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

app.post("/semester", (req, res)=>{
    try{
        (async function() {
            let child = "";
            let files = await loadChild(parent, jwtClient);
            for(let i=0;i<files.length;i++){
                if(files[i].name == req.body.semNum){
                    child = files[i].id
                    break
                }
            }

            let semFiles = await loadChild(child, jwtClient);
            let pyqID = ""
            for(let i=0;i<semFiles.length;i++){
                if(semFiles[i].name == "Previous Year Exams"){
                    pyqID = semFiles[i].id
                    break
                }
            }

            let pyqFiles = await loadChild(pyqID, jwtClient);

            res.status(201).render("semester", {semNum: req.body.semNum, semID: child, pyqs: JSON.stringify(pyqFiles), semF: JSON.stringify(semFiles)})
        })();
    }
    catch(err){
        console.log(err);
    }
})

app.post("/subject", (req, res)=>{
    try{
        (async function() {
        let semfiles = await loadChild(req.body.semID, jwtClient);
        let excelID = "";
        let child = "";
        for(let i=0;i<semfiles.length;i++){
            if((semfiles[i].name).substring(0,8) == (req.body.subName).substring(0,8)){
                child = semfiles[i].id
            }
            if((semfiles[i].name) == "Youtube Playlist"){
                excelID = semfiles[i].id
            }
        }

        let innerFiles = await loadChild(child, jwtClient);
        let excelFl = await loadChild(excelID, jwtClient);
        let excelF = await downloadFile(excelFl[0].id);
        let bookID = "", otherID = "", pptID = "", notesID = "";
        for(let i=0;i<innerFiles.length;i++){
            switch(innerFiles[i].name){
                case "BOOKS":
                    bookID = innerFiles[i].id;
                    break;
                case "PPT":
                    pptID = innerFiles[i].id;
                    break;
                case "Others":
                    otherID = innerFiles[i].id;
                    break;
                case "Notes":
                    notesID = innerFiles[i].id;
                    break;
                default:
            }
        }

        
        for(let i=1;i<excelF.length;i++){
            excelF[i][1] = await convertYoutubeUrlToEmbed(excelF[i][1]);
        }

        let bookF, notesF, otherF, pptF;
        bookF = await loadChild(bookID, jwtClient);
        notesF = await loadChild(notesID, jwtClient);
        otherF = await loadChild(otherID, jwtClient);
        pptF = await loadChild(pptID, jwtClient);
        res.status(201).render("subject", {subName: req.body.subName, bookF: JSON.stringify(bookF), notesF: JSON.stringify(notesF), pptF: JSON.stringify(pptF), otherF: JSON.stringify(otherF), excelF: JSON.stringify(excelF)});
      })();
    }
    catch(err){
        console.log(err);
    }
});

app.listen(PORT, ()=>{
    console.log("Listening to port " + PORT); 
})
