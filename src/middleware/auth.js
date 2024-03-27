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
        return res.status(201).render("login")
    }
}

// Middleware for admin role
const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.itrbauth;
        const verifyUser = jwt.verify(token, process.env.SECRET);

        // Extract user role
        const isAdmin = verifyUser.admin;

        if (isAdmin) {
            next(); // Proceed to the next middleware or route handler
        } else {
            return res.status(403).render('access-denied');
        }
    } catch (error) {
        // Handle token verification errors
        return res.status(401).render('login');
    }
};

// Middleware for faculty role
const authFaculty = async (req, res, next) => {
    try {
        const token = req.cookies.itrbauth;
        const verifyUser = jwt.verify(token, process.env.SECRET);

        // Extract user role
        const isFaculty = verifyUser.faculty;
        const isAdmin = verifyUser.admin;

        if (isFaculty || isAdmin) {
            next(); // Proceed to the next middleware or route handler
        } else {
            return res.status(403).render('access-denied');
        }
    } catch (error) {
        // Handle token verification errors
        return res.status(401).render('login');
    }
};


module.exports = {auth, authAdmin, authFaculty};