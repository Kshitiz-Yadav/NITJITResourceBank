function onClickNext(){
    let errorMsg = document.getElementById("error_box_otp");
    errorMsg.innerText = "";
    
    let form = document.getElementById("loginForm")
    let otp = document.getElementById("otpIn").value;
    if(otp === document.getElementById("receiversOTP").value){
        form.submit()
    }
    else{
        errorMsg.innerText = `Invalid OTP`;
        setTimeout(function(){
            errorMsg.innerText="";
            }, 3000);
    }
    return false
}

function main(){
    let form = document.getElementById("loginForm")
    let mail = document.getElementById("usernameIn").value;
    let pass = document.getElementById("passwordIn").value;
    form.setAttribute("method", "POST")
    form.setAttribute("action", "/home")
    var mailIn = document.createElement("input");
    mailIn.setAttribute("type", "text");
    mailIn.setAttribute("name", "username");
    mailIn.style.visibility = "hidden"
    mailIn.value = mail
    var passIn = document.createElement("input");
    passIn.setAttribute("type", "text");
    passIn.setAttribute("name", "password");
    passIn.style.visibility = "hidden"
    passIn.value = pass
    form.appendChild(mailIn)
    form.appendChild(passIn)
    
    if(document.getElementById("registeredIn").value == "Yes"){
        document.getElementById("receiversOTP").value = "Account exists"
        form.submit()
    }
    else{
        let nextButton = document.getElementById('next');
        nextButton.onclick = () => onClickNext();
    }
}

main()