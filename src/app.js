const express = require("express");
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
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
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
require("./db/conn")
const Users = require("./models/user")
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;
const SUPPORT_MAIL = process.nextTick.SUPPORT_MAIL || "resourcebank.it@nitj.ac.in"

// Instantiate FileManager class
const fileManager = FileManager.getInstance();

// Making GET requests
app.get("/login", (req, res) => {
    res.clearCookie('itrbauth')
    res.render("login")
})
app.get("/changePassword", (req, res) => {
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
                    })
            }
        })
})
app.get("/home", auth, async (req, res) => {
    (async function () {
        const { facultyFiles, facultyExcelData } = await fileManager.getFacultyData()
        res.status(201).render("index", { username: req.body.username, facultyFiles: JSON.stringify(facultyFiles), facultyExcelData: JSON.stringify(facultyExcelData) })
    })()
})

app.get("/admin", authAdmin, async (req, res) => {
    try {
        const allUsers = await getUsersWithNoPrivileges();
        const privilegedUsers = await getUsersWithPrivileges();
        res.status(201).render("admin", { allUsersList: JSON.stringify(allUsers), privilegedUsersList: JSON.stringify(privilegedUsers) });
    } catch (error) {
        console.error(error);
        res.status(500).render("500");
    }

})

app.get("/faculty", authFaculty, async (req, res) => {
    try {
        res.status(201).render("faculty");
    } catch (error) {
        console.error(error);
        res.status(500).render("500");
    }

})

app.get("/admin/academic_schema", authAdmin, async (req, res) => {
    try {
        const acadmicsSchema = await fileManager.listFolders();
        res.json(acadmicsSchema);
    } catch (error) {
        console.error(error);
        res.status(500).render("500");
    }

})

app.get("/faculty/academic_schema", authFaculty, async (req, res) => {
    try {
        const acadmicsSchema = await fileManager.listFolders();
        res.json(acadmicsSchema);
    } catch (error) {
        console.error(error);
        res.status(500).render("500");
    }
})

app.get("/get-academics-sem-list", auth, async (req, res) => {
    try {
        const acadmicsSemList = await fileManager.getSemList();
        res.json(acadmicsSemList);
    } catch (error) {
        console.error(error);
        res.status(500).render("500");
    }
})

app.get("/curriculum", auth, (req, res) => {
    res.render("curriculum")
})

app.get("/get-pyqs", auth, (req, res) => {
    try {
        (async function () {
            const PYQs = await fileManager.getPYQs(req.query.sem);
            return res.status(201).json(PYQs);
        })();
    }
    catch {
        console.error(error)
    }
})

app.get("/get-subFiles", auth, (req, res) => {
    try {
        (async function () {
            const Files = await fileManager.getSubjectFiles(req.query.subject, req.query.type);
            return res.status(201).json(Files);
        })();
    }
    catch {
        console.error(error)
    }
})

app.get('/downloadFile', async (req, res) => {
    try {
        const fileId = req.query.fileId;
        await fileManager.downloadFileStream(fileId, res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error downloading file');
    }
});

app.get("/semester", auth, async (req, res) => {
    try {
        const subjects = await fileManager.getSubList(req.query.sem);
        await fileManager.getPYQs(req.query.sem);
        return res.status(201).render("semester", { subjects: JSON.stringify(subjects), semName: req.query.sem });
    }
    catch {
        console.error(error)
    }
})

app.get("/subject", auth, async (req, res) => {
    try {
        return res.status(201).render("subject", {subName: req.query.subjectName , subID: req.query.subjectID});
    }
    catch (err) {
        console.error(err);
    }
})

app.get("/dsa", auth, (req, res) => {
    res.render("dsa")
})
app.get("/placement", auth, (req, res) => {
    res.render("placement")
})
app.get("/support", auth, (req, res) => {
    res.render("feedback")
})
app.get("/team", auth, (req, res) => {
    res.render("team")
})
app.get("*", (req, res) => {
    res.render("404")
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
    catch (err) {
        console.error(err)
    }
})

app.post("/changePassword", async (req, res) => {
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
})

app.post("/home", async (req, res) => {
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
                const { facultyF, faculty_xl } = await fileManager.getFacultyData()
                return res.status(201).render("index", { username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin })
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
                const { facultyF, faculty_xl } = await fileManager.getFacultyData()
                return res.status(201).render("index", { username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin })
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
                    const { facultyF, faculty_xl } = await fileManager.getFacultyData()
                    return res.status(201).render("index", { username: user, facultyF: JSON.stringify(facultyF), faculty_xl: JSON.stringify(faculty_xl), isAdmin: isAdmin })
                })()
            }
            catch (err) {
                console.error(err)
            }
        }
    }
})

app.post("/support", auth, async (req, res) => {
    try {
        await register.sendMail(SUPPORT_MAIL, SUPPORT_MAIL, req.body.subject, req.body.name + " says,\n" + req.body.message + "\n\nSender Mail: " + req.body.email);
        console.log("Feedback sent successfully")
    }
    catch (err) {
        console.error(err)
    }
    res.status(201).render("feedback")
})

app.post("/admin/add-subjects", authAdmin, async (req, res) => {
    const fileId = req.body.directoryToBeModified;
    const newName = req.body.newName;
    try {
        await fileManager.addSubject(fileId, newName);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(504);
    }
})

app.post("/faculty/upload", authFaculty, upload.single('fileInput'), async (req, res) => {
    try {
        const { body, file } = req;
        await fileManager.uploadToDrive(body, file);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(504);
    }
})

app.post("/get-files-metadata", auth, async (req, res) => {
    try {
        const files = await fileManager.getListFilesMetadata(req.body);
        res.status(200).json(files);
    }
    catch (err) {
        console.error(err);
        res.status(500).render("500");
    }
})

app.delete("/admin/remove-user", authAdmin, async (req, res) => {
    const userId = req.body.userToBeRemoved;
    try {
        await removeUserById(userId);
        // Send the ID of the deleted user as a response
        res.redirect('/admin')
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
})


app.delete("/admin/delete-directory", authAdmin, async (req, res) => {
    const fileId = req.body.directoryToBeDeleted;
    try {
        await fileManager.deleteFile(fileId);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(504);
    }
})

app.delete("/faculty/delete-file", authFaculty, async (req, res) => {
    const fileId = req.body.fileToBeDeleted;
    try {
        await fileManager.deleteFile(fileId);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(504);
    }
})

app.put("/admin/remove-privileged-access", authAdmin, async (req, res) => {
    const userId = req.body.userToRemoveAccess;
    try {
        await updateUserModeById(userId, false);
        // Send the ID of the deleted user as a response
        res.redirect('/admin')
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
})

app.put("/admin/provide-privileged-access", authAdmin, async (req, res) => {
    const userId = req.body.userToProvideAccess;
    try {
        await updateUserModeById(userId, true);
        // Send the ID of the deleted user as a response
        res.redirect('/admin')
    } catch (err) {
        console.error(err);
        res.status(500).render('500');
    }
})

app.put("/admin/rename-directory", authAdmin, async (req, res) => {
    const fileId = req.body.directoryToBeModified;
    const newName = req.body.newName;
    try {
        await fileManager.renameFile(fileId, newName);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(504);
        console.error(err);
    }
})

app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})