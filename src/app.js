const express = require("express");
const fs = require("fs")
const app = express()
const methodOverride = require('method-override');
const path = require("path")
const hbs = require("hbs")
const multer = require('multer');
const bcrypt = require("bcryptjs");
const register = require("./models/register")
const FileManager = require("./models/fileManager");
const { getUsersWithNoPrivileges, getUsersWithPrivileges, removeUserById, updateUserModeById } = require("./models/manageUserAccess");
const { auth, authAdmin, authFaculty } = require("./middleware/auth")
const { upvoteFile, downvoteFile, removeUpvote, removeDownvote } = require("./models/rating");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const logger = require('./models/logger');
require('dotenv').config();
app.use(cookieParser())
app.use(methodOverride('_method'));

// Setting up path
const staticPath = path.join("../public")
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', "hbs");

const upload = multer();

// Setting up partials
const partialPath = "../partials"
hbs.registerPartials(partialPath);

// Connecting to database
require("./conn")
const Users = require("./models/user")
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;
const SUPPORT_MAIL = process.nextTick.SUPPORT_MAIL || "resourcebank.it@nitj.ac.in"

// Instantiate FileManager class
const fileManager = FileManager.getInstance();

// Making GET requests
app.get("/login", (req, res) => {
    try {
        res.clearCookie('itrbauth')
    res.render("login")
    } catch (error) {
        logger.error(error.message)
    }
})
app.get("/changePassword", (req, res) => {
    try {
        let token = jwt.verify(req.cookies.itrbauth, process.env.SECRET)
    let email = token.username
    Users.findOne({ username: email })
        .then(async function (val, err) {
            if (val == null) {
                return res.status(201).render("login", { problem: "UserDNE", username: email })
            }
            else {
                var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                var otpGenSafe = await bcrypt.hash(otpGen, 10);
                await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal", "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
                    .then(data => {
                        console.log('Mail sent successfully')
                        return res.status(201).render("forgot", { username: email, password: process.env.FORGOTPASS, otp: otpGenSafe, registered: "" })
                    })
                    .catch(err => {
                        console.error('Failed to send email:\n' + err)
                        throw new Error('Failed to send email:\n' + err);
                    })
            }
        })
    } catch (error) {
        logger.error(error.message);
    }
    
})
app.get("/", auth, async (req, res) => {
    try {
        (async function () {
            res.status(201).render("index")
        })()
    } catch (error) {
        logger.error(error.message);
    }
})

app.get("/home", auth, async (req, res) => {
    try {
        (async function () {
            res.status(201).render("index")
        })()
    } catch (error) {
        logger.error(error.message);
    }
})

app.get("/admin", authAdmin, async (req, res) => {
    try {
        const allUsers = await getUsersWithNoPrivileges();
        const privilegedUsers = await getUsersWithPrivileges();
        res.status(201).render("admin", { allUsersList: JSON.stringify(allUsers), privilegedUsersList: JSON.stringify(privilegedUsers) });
    } catch (error) {
        logger.error(error.message)
        res.status(500).render("500");
    }

})

app.get("/faculty", authFaculty, async (req, res) => {
    try {
        res.status(201).render("faculty");
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }

})

app.get("/admin/academic_schema", authAdmin, async (req, res) => {
    try {
        const acadmicsSchema = await fileManager.listFolders();
        res.json(acadmicsSchema);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/admin/fetch-schedule", authAdmin, async (req, res) => {
    try {
        const schedule = await fileManager.listSchedule();
        res.json(schedule);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/admin/fetch-faculty", authAdmin, async (req, res) => {
    try {
        const faculty = await fileManager.listFaculty();
        res.json(faculty);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get('/admin/download-log',authAdmin, (req, res) => {
    try {
        const logFilePath = "./logs/app.log"
        // Check if the file exists
        if (!fs.existsSync(logFilePath)) {
            return res.status(404).send('File not found.');
          }
        
          // Set response headers
          res.setHeader('Content-Type', 'text/plain');
          
          // Get the file size and set 'Content-Length' header if possible
          const stats = fs.statSync(logFilePath);
          res.setHeader('Content-Length', stats.size);
        
          // Create a read stream and pipe it to the response
          const readStream = fs.createReadStream(logFilePath);
          readStream.pipe(res);
        
          // Handle errors
          readStream.on('error', (err) => {
            res.status(500).send('Error occurred while reading the file.');
          });
    } catch (error) {
        logger.error(error.message);
    }
    
  });

app.get("/faculty/academic_schema", authFaculty, async (req, res) => {
    try {
        const acadmicsSchema = await fileManager.listFolders();
        res.json(acadmicsSchema);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/get-academics-sem-list", auth, async (req, res) => {
    try {
        const acadmicsSemList = await fileManager.getSemList();
        res.json(acadmicsSemList);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/get-faculty-list", auth, async (req, res) => {
    try {
        const facultyList = await fileManager.getScheduleOrFaculty("faculty");
        res.json(facultyList);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/get-schedule-list", auth, async (req, res) => {
    try {
        const scheduleList = await fileManager.getScheduleOrFaculty("schedule");
        res.json(scheduleList);
    } catch (error) {
        logger.error(error.message);
        res.status(500).render("500");
    }
})

app.get("/curriculum", auth, (req, res) => {
    try {
        res.render("curriculum");
    } catch (error) {
        logger.error(error.message);
    }
})

app.get("/get-pyqs", auth, (req, res) => {
    try {
        (async function () {
            const token = req.cookies.itrbauth;
            const verifyUser = jwt.verify(token, process.env.SECRET);
            const userId = verifyUser.username;
            const PYQs = await fileManager.getPYQs(req.query.sem, userId);
            return res.status(201).json(PYQs);
        })();
    }
    catch {
        logger.error(error.message);
    }
})

app.get("/get-subFiles", auth, (req, res) => {
    try {
        (async function () {
            const token = req.cookies.itrbauth;
            const verifyUser = jwt.verify(token, process.env.SECRET);
            const userId = verifyUser.username;
            const Files = await fileManager.getSubjectFiles(req.query.subject, req.query.type, userId);
            return res.status(201).json(Files);
        })();
    }
    catch {
        logger.error(error.message);
    }
})

app.get('/downloadFile', async (req, res) => {
    try {
        const fileId = req.query.fileId;
        await fileManager.downloadFileStream(fileId, res);
    } catch (error) {
        logger.error(error.message);
        res.status(500).send('Error downloading file');
    }
});

app.get("/semester", auth, async (req, res) => {
    try {
        const subjects = await fileManager.getSubList(req.query.sem);
        await fileManager.getPYQs(req.query.sem);
        return res.status(201).render("semester", { subjects: JSON.stringify(subjects), semName: req.query.sem });
    }
    catch (error) {
        logger.error(error.message);
    }
})

app.get("/subject", auth, async (req, res) => {
    try {
        return res.status(201).render("subject", { subName: req.query.subjectName, subID: req.query.subjectID });
    }
    catch (error) {
        logger.error(error.message);
    }
})

app.get("/dsa", auth, (req, res) => {
    try {
        res.render("dsa");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/os", auth, (req, res) => {
    try {
        res.render("os");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/oops", auth, (req, res) => {
    try {
        res.render("oops");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/webd", auth, (req, res) => {
    try {
        res.render("webd");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/dbms", auth, (req, res) => {
    try {
        res.render("dbms");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/cn", auth, (req, res) => {
    try {
        res.render("cn");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/placement", auth, (req, res) => {
    try {
        res.render("placement");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/support", auth, (req, res) => {
    try {
        res.render("feedback");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("/team", auth, (req, res) => {
    try {
        res.render("team");
    } catch (error) {
        logger.error(error.message);
    }
})
app.get("*", (req, res) => {
    try {
        res.render("404.hbs")
    } catch (error) {
        logger.error(error.message);
    }
})

//Making POST requests
app.post("/login", async (req, res) => {
    try {
        let email = (req.body.mail).toLowerCase();
        let password = req.body.pass;
        if (!await register.isMailValid(email)) {
            return res.status(201).render("login", { problem: "InvalidMail", username: "" })
        }
        else if (!await register.isPassStrong(password)) {
            return res.status(201).render("login", { problem: "WeakPassword", username: email })
        }
        else {
            password = await bcrypt.hash(password, 10);
            Users.findOne({ username: email })
                .then(async function (val, err) {
                    if (val == null) {
                        var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                        var otpGenSafe = await bcrypt.hash(otpGen, 10);
                        var userEncrypted = await bcrypt.hash(email, 10);
                        await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal", "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
                            .then(data => {
                                console.log('Mail sent successfully')
                                return res.status(201).render("verifyOTP", { username: email, usernameEnc: userEncrypted, password: password, otp: otpGenSafe, registered: "No" })
                            })
                            .catch(err => {
                                console.error('Failed to send email:\n' + err)
                                return res.status(201).render("login");
                            })
                    }
                    else {
                        let match = await bcrypt.compare(req.body.pass, val.password);
                        var userEncrypted = await bcrypt.hash(email, 10);
                        if (match) {
                            return res.status(201).render("verifyOTP", { username: email, usernameEnc: userEncrypted, password: password, otp: otpGenSafe, registered: "Yes" })
                        }
                        else {
                            return res.status(201).render("login", { problem: "InvalidPassword", username: email })
                        }
                    }
                })
        }
    }
    catch (error) {
        logger.error(error.message);
    }
})

app.post("/changePassword", async (req, res) => {
    try {
        let email = (req.body.mail).toLowerCase();
        if (!await register.isMailValid(email)) {
            return res.status(201).render("login", { problem: "InvalidMail", username: "" })
        }
        else {
            Users.findOne({ username: email })
                .then(async function (val, err) {
                    if (val == null) {
                        return res.status(201).render("login", { problem: "UserDNE", username: email })
                    }
                    else {
                        var otpGen = (Math.floor(100000 + (Math.random() * (1000000 - 100000)))).toString()
                        var otpGenSafe = await bcrypt.hash(otpGen, 10);
                        var userEncrypted = await bcrypt.hash(email, 10);
                        await register.sendMail(email, SUPPORT_MAIL, "OTP for IT portal", "Your OTP to register at IT Portal is: " + otpGen + "\n\nHave a great time studying!!")
                            .then(data => {
                                console.log('Mail sent successfully')
                                return res.status(201).render("forgot", { username: email, usernameEnc: userEncrypted, password: process.env.FORGOTPASS, otp: otpGenSafe })
                            })
                            .catch(err => {
                                console.error('Failed to send email:\n' + err)
                            })
                    }
                })
        } 
    } catch (error) {
        logger.error(error.message);
    }
})

app.post("/home", async (req, res) => {
    try {
        let userOTP = req.body.otp, otpGen = req.body.otpGen, pass = req.body.password, user = req.body.username, userEnc = req.body.usernameEnc;
    let isAdmin = await register.isAdmin(user)
    if (!await bcrypt.compare(user, userEnc)) {
        return res.status(201).render("login", { problem: "Invalid User", username: user })
    }
    if (pass == process.env.FORGOTPASS) {
        let newPass = await bcrypt.hash(req.body.pass, 10);
        if (!await register.isPassStrong(newPass)) {
            return res.status(201).render("forgot", { problem: "WeakPassword", username: user, usernameEnc: userEnc, password: pass, otp: otpGen })
        }
        else if (!await bcrypt.compare(userOTP, otpGen)) {
            return res.status(201).render("forgot", { problem: "InvalidOTP", username: user, usernameEnc: userEnc, password: pass, otp: otpGen })
        }
        else {
            await Users.updateOne({ username: user }, { $set: { password: newPass } }, {});
            const registerUser = await Users.findOne({ username: user });
            const token = await registerUser.generateAuthToken()
            res.cookie("itrbauth", token, {
                expires: new Date(Date.now() + 1300000000),
                httpOnly: true
            });
            (async function () {
                return res.status(201).render("index")
            })()
        }
    }
    else {
        if (userOTP == "Account exists") {
            const registerUser = await Users.findOne({ username: user });
            const token = await registerUser.generateAuthToken()
            res.cookie("itrbauth", token, {
                expires: new Date(Date.now() + 1300000000),
                httpOnly: true
            });
            (async function () {
                return res.status(201).render("index")
            })()
        }
        else if (!await bcrypt.compare(userOTP, otpGen)) {
            return res.status(201).render("verifyOTP", { problem: "InvalidOTP" })
        }
        else {
            try {
                const registerUser = new Users({
                    username: user,
                    password: pass,
                    admin: isAdmin,
                    faculty: false
                })
                const token = await registerUser.generateAuthToken()
                res.cookie("itrbauth", token, {
                    expires: new Date(Date.now() + 1300000000),
                    httpOnly: true
                });
                await registerUser.save()
                    .then(() => console.log("Saved successfully"))
                    .catch((err) => console.error(err));
                (async function () {
                    return res.status(201).render("index")
                })()
            }
            catch (err) {
                throw err;
            }
        }
    }
    } catch (error) {
        logger.error(error.message);
    }
})

app.post("/support", auth, async (req, res) => {
    try {
        await register.sendMail(SUPPORT_MAIL, SUPPORT_MAIL, req.body.subject, req.body.name + " says,\n" + req.body.message + "\n\nSender Mail: " + req.body.email);
        console.log("Feedback sent successfully")
        res.status(201).render("feedback")
    }
    catch (error) {
        logger.error(error.message);
    }
})

app.post('/file/upvote', auth, async (req, res) => {
    try {
        const { fileId } = req.body;
    const token = req.cookies.itrbauth;
    const verifyUser = jwt.verify(token, process.env.SECRET);
    const userId = verifyUser.username;
        await upvoteFile(fileId, userId);
        res.status(200).send('Upvoted successfully');
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    }
});

app.post('/file/downvote', auth, async (req, res) => {
    try {const { fileId } = req.body;
    const token = req.cookies.itrbauth;
    const verifyUser = jwt.verify(token, process.env.SECRET);
    const userId = verifyUser.username;
        await downvoteFile(fileId, userId);
        res.status(200).send('Downvoted successfully');
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    }
});

app.post('/file/remove-upvote', auth, async (req, res) => {
    try {
        const { fileId } = req.body;
    const token = req.cookies.itrbauth;
    const verifyUser = jwt.verify(token, process.env.SECRET);
    const userId = verifyUser.username;
        await removeUpvote(fileId, userId);
        res.status(200).send('Upvote removed successfully');
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    }
});

app.post('/file/remove-downvote', auth, async (req, res) => {
    try {    
        const { fileId } = req.body;
    const token = req.cookies.itrbauth;
    const verifyUser = jwt.verify(token, process.env.SECRET);
    const userId = verifyUser.username;
        await removeDownvote(fileId, userId);
        res.status(200).send('Downvote removed successfully');
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
    }
});

app.post("/admin/add-subjects", authAdmin, async (req, res) => {
    try {
        const fileId = req.body.directoryToBeModified;
    const newName = req.body.newName;
        await fileManager.addSubject(fileId, newName);
        res.sendStatus(200);
    } catch (err) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.post("/admin/upload-timetable", authFaculty, upload.single('fileInput'), async (req, res) => {
    try {
        const { body, file } = req;
        await fileManager.uploadTimetable(body, file);
        res.sendStatus(200);
    } catch (error) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.post("/admin/upload-faculty", authFaculty, upload.single('photoInput'), async (req, res) => {
    try {
        const { body, file } = req;
        await fileManager.uploadFaculty(body, file);
        res.sendStatus(200);
    } catch (error) {
        logger.error(err.message);
        res.sendStatus(504);
    }
});

app.post("/faculty/upload", authFaculty, upload.single('fileInput'), async (req, res) => {
    try {
        const { body, file } = req;
        const fileId = await fileManager.uploadToDrive(body, file);
        const token = req.cookies.itrbauth;
    const verifyUser = jwt.verify(token, process.env.SECRET);
    const userId = verifyUser.username;
        logger.info(`File '${req.body.fileName}' added by '${userId}' with ID = '${fileId}'`)
        res.sendStatus(200);
    } catch (err) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.post("/get-files-metadata", auth, async (req, res) => {
    try {
        const files = await fileManager.getListFilesMetadata(req.body);
        res.status(200).json(files);
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).render("500");
    }
})

app.delete("/admin/remove-user", authAdmin, async (req, res) => {
    try {
        const userId = req.body.userToBeRemoved;
        await removeUserById(userId);
        // Send the ID of the deleted user as a response
        res.redirect('/admin')
    } catch (err) {
        logger.error(err.message);
        res.status(500).render('500');
    }
})


app.delete("/admin/delete-directory", authAdmin, async (req, res) => {
    try {
        const fileId = req.body.directoryToBeDeleted;
        await fileManager.deleteFile(fileId);
        res.sendStatus(200);
    } catch (err) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.delete("/faculty/delete-file", authFaculty, async (req, res) => {
    try {
        const fileId = req.body.fileToBeDeleted;
        await fileManager.deleteFile(fileId);
        logger.info(`File deleted by '${userId}' having ID = '${fileId}'`)
        res.sendStatus(200);
    } catch (err) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.put("/admin/remove-privileged-access", authAdmin, async (req, res) => {
    try {
        const userId = req.body.userToRemoveAccess;
        await updateUserModeById(userId, false);
        res.redirect('/admin')
    } catch (err) {
        logger.error(err.message);
        res.status(500).render('500');
    }
})

app.put("/admin/provide-privileged-access", authAdmin, async (req, res) => {
    try {
        const userId = req.body.userToProvideAccess;
        await updateUserModeById(userId, true);
        res.redirect('/admin')
    } catch (err) {
        logger.error(err.message);
        res.status(500).render('500');
    }
})

app.put("/admin/rename-directory", authAdmin, async (req, res) => {
    try {
        const fileId = req.body.directoryToBeModified;
        const newName = req.body.newName;
        await fileManager.renameFile(fileId, newName);
        res.sendStatus(200);
    } catch (err) {
        logger.error(err.message);
        res.sendStatus(504);
    }
})

app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})