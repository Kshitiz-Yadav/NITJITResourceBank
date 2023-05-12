function isValid(mail){
    if(mail.endsWith('@nitj.ac.in')){
        return true;
    }
    return false;
}

function isPassValid(pass){
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

function onClickNext(){
    document.getElementById("error_box_user").innerText="";
    document.getElementById("error_box_pass").innerText="";
    let mail = document.getElementById('receiversMail').value;
    mail = mail.toLowerCase()
    let pass = document.getElementById('receiversPass').value;
    let isMailValid = isValid(mail);
    let isPasswordValid = isPassValid(pass)
    if(!isMailValid){
        isMailValid = false;
        let validMsg = document.getElementById('error_box');
        validMsg.innerText = `Enter valid NITJ EMail ID!`;
        setTimeout(function(){
            validMsg.innerText="";
            }, 3000);
    }
    else if(!isPasswordValid){
        let validMsg = document.getElementById('error_box_pass');
        validMsg.innerText = `Choose a stronger blend of characters and numbers!`;
        setTimeout(function(){
            validMsg.innerText="";
            }, 3000);
    }
    else{
        let form = document.getElementById("loginForm")
        form.setAttribute("method", "POST")
        form.setAttribute("action", "/login")
        form.submit()
    }
    return false
}

function main(){
    if(document.getElementById("problem").value == "Yes"){
        let validMsg = document.getElementById('error_box_pass');
        validMsg.innerText = `Invalid password!`;
        setTimeout(function(){
            validMsg.innerText="";
            }, 3000);
    }
    let nextButton = document.getElementById('next');
    nextButton.onclick = () => onClickNext();
}

main()