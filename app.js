const path = require("path")
const hbs = require("hbs")
const express = require("express");
const app = express()

const staticPath = path.join("public")     
app.use(express.static(staticPath))
app.set('view engine', "hbs");

const partialPath = "partials"
hbs.registerPartials(partialPath);

app.get("", (req,res)=>{
    res.render("loginPage")
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
// app.get("/curriculum/semester/subject", (req,res)=>{
//     res.render("subject.hbs")
// })
// app.get("/semester", (req,res)=>{
//     res.render("semester.hbs")
// })
app.get("/subject", (req,res)=>{
    res.render("subject.hbs")
})
app.get("/feedback", (req,res)=>{
    res.render("feedback.hbs")
})
app.get("*", (req,res)=>{
    res.render("404.hbs")
})

app.listen(8000, ()=>{
    console.log("Listening to port 8000"); 
})
