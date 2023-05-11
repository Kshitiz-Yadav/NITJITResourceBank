const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://resourcebankit:ResourceBank2023@cluster0.yn9mlqo.mongodb.net/Users", {useUnifiedTopology: true})
.then(() => console.log("Connection Successfull!"))
.catch((err) => console.log(err));