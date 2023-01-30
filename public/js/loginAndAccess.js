function isValid(mail){
    if(mail.endsWith('@nitj.ac.in')){
        return true;
    }
    return false;
}

var otpGen;
function sendMail(){
    otpGen = Math.floor(100000 + (Math.random() * (1000000 - 100000)))
    // URL of deployed AppScript project
    let url = "https://script.google.com/macros/s/AKfycbyWbN7L_H_TcBUsPlNIT6T_Kx2DHkBZHosz3JMSInt9IuvZW34ziCWNwgp_IL7O71jfxQ/exec";
    
    // Getting form data and appending OTP to it to pass to AppScript
    let form = document.getElementById('loginForm');
    let data = new FormData(form)
    data.append('otp', otpGen)

    // Making call to AppScript using fetch API
    fetch(url, {
            method: "POST",
            mode: 'no-cors',
            body: data,
        })
        .then(res => res.text())
        .then(data => {
            console.log('Mail sent successfully')
        })
        .catch(err => {
            console.log('Failed to send email')
        })
}

function checkUser(mail){
    let temp = mail.replace("@nitj.ac.in", '')
    let regex = /\.[a-z]{2,3}\./
    return regex.test(temp)
}

function setPassword(mail){
    let form = document.getElementById('loginForm')
    let element1 = document.getElementById('userOTP')
    element1.setAttribute('hidden','hidden')
    let element2 = document.getElementById('otp_text')
    element2.setAttribute('hidden','hidden')
    document.getElementById("error_box").innerText="";
    let ibox = document.getElementById('inputBox1')
    let passInput = document.createElement('input')
    passInput.setAttribute('type', 'password')
    passInput.setAttribute('id', 'userPassword')
    passInput.setAttribute('required','required')
    passInput.setAttribute('name', 'password')
    ibox.appendChild(passInput)
    let passText = document.createElement('span')
    passText.innerText = 'Set Password'
    passText.setAttribute('id', 'password_text')
    ibox.appendChild(passText)
    let signUpBtn = document.getElementById("next")
    signUpBtn.innerText = 'Sign Up'
    form.appendChild(signUpBtn)
    
    let userType = checkUser(mail)
    if(userType){
        localStorage.setItem(mail+"Pass", 'Student')
    }
    else{
        localStorage.setItem(mail+"Pass", 'Teacher')
    }

    signUpBtn.onclick = () => {
        localStorage.setItem(mail, passInput.value)
        if(userType){
            console.log('Successfully Signed in as Student')
            window.location.href = "/home"
        }
        else{
            console.log('Successfully Signed in as Teacher')
        }
        return false;
    }
}

function checkOTP(mail, userOTP){
    if(otpGen == userOTP){
        setPassword(mail);
        console.log('OTP Matched')
    }
    else{
        console.log('OTP Not matched')
        let verifyMsg = document.getElementById('error_box');
        verifyMsg.innerText = 'Invalid OTP!!';
        setTimeout(function(){
            verifyMsg.innerText="";
            },3000);
    }
}

function verifyMail(mail){
    let form = document.getElementById('loginForm');
    let element1 = document.getElementById('uname');
    element1.setAttribute('hidden','hidden');
    let element2 = document.getElementById('receiversMail');
    element2.setAttribute('hidden','hidden');
    document.getElementById("error_box").innerText="";
    let ibox = document.getElementById('inputBox1');
    let otpInput = document.createElement('input');
    otpInput.setAttribute('type', 'number');
    otpInput.setAttribute('id', 'userOTP');
    otpInput.setAttribute('class', 'no-spinner');
    otpInput.setAttribute('required','required');
    otpInput.setAttribute('name', 'otpin');
    ibox.appendChild(otpInput);
    let otpText = document.createElement('span');
    otpText.innerText = 'Enter OTP';
    otpText.setAttribute('id', 'otp_text');
    ibox.appendChild(otpText);
    let verifyBtn = document.getElementById("next");
    verifyBtn.innerText = 'Verify';
    form.appendChild(verifyBtn);
    sendMail();
    
    verifyBtn.onclick = () => {
        checkOTP(mail, otpInput.value);
        return false;
    }
}

function enterPassword(mail){
    let form = document.getElementById('loginForm');
    let element1 = document.getElementById('uname');
    element1.setAttribute('hidden','hidden');
    let element2 = document.getElementById('receiversMail');
    element2.setAttribute('hidden','hidden');
    document.getElementById("error_box").innerText="";
    let ibox = document.getElementById('inputBox1');
    let passInput = document.createElement('input');
    passInput.setAttribute('type', 'password');
    passInput.setAttribute('id', 'userPass');
    passInput.setAttribute('required','required')
    ibox.appendChild(passInput);
    let passText = document.createElement('span');
    passText.innerText = 'Enter password';
    passText.setAttribute('id' , 'passkey');
    ibox.appendChild(passText);
    let links = document.createElement('div');
    links.setAttribute('class','links');
    form.appendChild(links)
    let link1 = document.createElement('a');
    link1.setAttribute('id', 'forgot_pass');
    link1.setAttribute('href', '#');
    link1.innerText = "Forgot Password ?";
    links.appendChild(link1);
    let link2 = document.createElement('a');
    link2.setAttribute('id', 'SignUp_');
    link2.setAttribute('href', '#');
    link2.innerText = "Sign UP";
    links.appendChild(link2);
    let signInBtn = document.getElementById("next");
    signInBtn.innerText = 'Sign In';
    form.appendChild(signInBtn);
    
    signInBtn.onclick = () => {   
        if(localStorage.getItem(mail) != passInput.value){
            let validPassMsg = document.getElementById('error_box');
            validPassMsg.innerText = `Invalid Password`;
            setTimeout(function(){
                validPassMsg.innerText="";
                },3000);
        }
        else{
            if(localStorage.getItem(mail+"Pass") == "Student"){
                console.log('Successfully Signed in as Student');
                window.location.href = "/home"
            }
            else{
                console.log('Successfully Signed in as Teacher');
            }
        }
        return false;
    }
}

function checkExistence(mail){
    if(localStorage.getItem(mail) != null){
        return true;
    }
    return false;
}

function onClickNext(){
    document.getElementById("error_box").innerText="";
    let mail = document.getElementById('receiversMail').value;
    let isMailValid = isValid(mail);
    if(!isMailValid){
        isMailValid = false;
        let validMsg = document.getElementById('error_box');
        validMsg.innerText = `Enter valid NITJ EMail ID.`;
        setTimeout(function(){
            validMsg.innerText="";
            },3000);
    }
    else{
        let mailExists = checkExistence(mail);
        if(!mailExists){
            verifyMail(mail);
        }
        else{
            enterPassword(mail);

        }
    }
    return false
}

function main(){
    let nextButton = document.getElementById('next');
    nextButton.onclick = () => onClickNext();
    console.log('Hello');
}
main()