
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SUPPORT_MAIL = process.env.SUPPORT_MAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function isMailValid(mail){
    if(mail.endsWith('@nitj.ac.in')){
        return true;
    }
    return false;
}

async function isPassStrong(pass){
    if(pass.length < 8){
        return false;
    }
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
    if(mail.toLowerCase()==SUPPORT_MAIL){
        return true;
    }
    return false;
}

async function sendMail(toP, fromP, subjectP, bodyP){
    try {
        const accessToken = await oAuth2Client.getAccessToken();
    
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: fromP,
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
    
        const mailOptions = {
          from: `IT Resource Bank <${fromP}>`,
          to: toP,
          subject: subjectP,
          text: bodyP,
          html: `<h1>${bodyP}</h1>`,
        };
    
        const result = await transport.sendMail(mailOptions);
        return result;
      } catch (error) {
        return error;
      }
}


module.exports = {isMailValid, isPassStrong, sendMail, isAdmin}