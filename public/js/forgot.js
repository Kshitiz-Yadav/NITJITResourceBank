function main(){
    let form = document.getElementById("loginForm")
    form.setAttribute("method", "POST")
    form.setAttribute("action", "/home")

    let validPass = document.getElementById('error_box_pass');
    let errorMsg = document.getElementById("error_box_otp");
    errorMsg.innerText = "";
    validPass.innerText = "";
    
    let problem = document.getElementById("problem").value
    if(problem == "InvalidOTP"){
        errorMsg.innerText = `Invalid OTP`;
        setTimeout(function(){
            errorMsg.innerText="";
            }, 3000);
    }
    else if(problem == "WeakPassword"){
        validPass.innerText = `Choose a stronger blend of characters and numbers!`;
        setTimeout(function(){
            validPass.innerText="";
            }, 3000);
    }
    
    (document.getElementById('next')).onclick = () => onClickNext(() => {
        form.submit();
        return false;
    });
}

main()