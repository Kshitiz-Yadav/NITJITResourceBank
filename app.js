const path = require("path")
const express = require("express");
const app = express()

const staticPath = path.join("public")     
app.use(express.static(staticPath))

app.set('view engine', "hbs");

app.get("", (req,res)=>{
    res.render("loginPage")
})

app.get("/home", (req,res)=>{
    res.render("index.hbs")
})

app.listen(8000, ()=>{
    console.log("Listening to port 8000"); 
})
