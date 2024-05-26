const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const logger = require("./logger")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean
    },
    faculty: {
        type: Boolean
    },
    tokens:[{
        token: {
            type: String
        } 
    }]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({username: this.username, password: this.password, admin: this.admin, faculty: this.faculty}, process.env.SECRET)
        // console.log(token)
        return token;
    }
    catch(error){
        logger.error(error);
    }
}

const User = new mongoose.model('User', userSchema);
module.exports = User;