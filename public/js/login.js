function onClickNext(){
    let form = document.getElementById("loginForm")
    form.setAttribute("method", "POST")
    form.setAttribute("action", "/login")
    form.submit()
    return false
}

function onClickForgot(){
    let form = document.getElementById("loginForm")
    form.setAttribute("method", "POST")
    form.setAttribute("action", "/forgotPassword")
    form.submit()
    return false
}

function main(){
    let validMail = document.getElementById('error_box_user');
    let validPass = document.getElementById('error_box_pass');
    validMail.innerText = "";
    validPass.innerText = "";

    let problem = document.getElementById("problem").value
    
    if(problem == "InvalidPassword"){
        validPass.innerText = `Invalid password!`;
        setTimeout(function(){
            validPass.innerText="";
            }, 3000);
    }
    else if(problem == "InvalidMail"){
        validMail.innerText = `Enter valid NITJ EMail ID!`;
        setTimeout(function(){
            validMail.innerText="";
            }, 3000);
    }
    else if(problem == "UserDNE"){
        validMail.innerText = `User does not exist! Please SignUp!`;
        setTimeout(function(){
            validMail.innerText="";
            }, 3000);
    }
    else if(problem == "WeakPassword"){
        validPass.innerText = `Choose a stronger blend of characters and numbers!`;
        setTimeout(function(){
            validPass.innerText="";
            }, 3000);
    }
    
    (document.getElementById('next')).onclick = () => onClickNext();
    (document.getElementById('FGPassword')).onclick = () => onClickForgot();
}

main()