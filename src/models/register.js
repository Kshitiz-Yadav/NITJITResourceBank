
const nodemailer = require("nodemailer");

async function isMailValid(mail){
    if(mail.endsWith('@nitj.ac.in')){
        return true;
    }
    return false;
}

async function isPassStrong(pass){
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

async function isAdmin(mail){
    return false;
}

async function sendMail(toP, fromP, subjectP, bodyP){
    const PASSWORD = process.env.PASS;
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        service: "gmail",
        // port: 587,
        auth: {
            user: 'resourcebank.it@nitj.ac.in', // generated ethereal username
            pass: PASSWORD // generated ethereal password 
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: fromP, // sender address
      to: toP, // list of receivers
      subject: subjectP, // Subject line
      text: bodyP, // plain text body
      html: "", // html body
    });
}

module.exports = {isMailValid, isPassStrong, sendMail}