const jwt = require("jsonwebtoken")

const auth = async(req, res, next) => {
    try{
        const token = req.cookies.itrbauth
        const verifyUser = jwt.verify(token, process.env.SECRET)
        // console.log(verifyUser)
        next()
    }
    catch(error){
        // console.log(error)
        res.status(201).render("login")
        next()
    }
}

module.exports = auth