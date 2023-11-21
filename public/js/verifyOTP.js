function main(){
    let form = document.getElementById("loginForm")
    form.setAttribute("method", "POST")
    form.setAttribute("action", "/home")

    let errorMsg = document.getElementById("error_box_otp");
    errorMsg.innerText = "";
    let problem = document.getElementById("problem").value
    
    if(document.getElementById("registeredIn").value == "Yes"){
        document.getElementById("receiversOTP").value = "Account exists"
        document.getElementById("next").style = "Display: None;"
        document.getElementById("inputBox1").style = "Display: None;"
        document.getElementById("verifyMsg").innerText = "Verifying Email\nPlease Wait..."
        form.submit()
    }
    else if(problem == "InvalidOTP"){
        errorMsg.innerText = `Invalid OTP`;
        setTimeout(function(){
            errorMsg.innerText="";
            }, 3000);
    }
    (document.getElementById('next')).onclick = () => onClickNext(() => {
        form.submit();
        return false;
    });
}

main()