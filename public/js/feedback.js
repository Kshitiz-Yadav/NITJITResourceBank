function onClickSendMail(){
    let form = document.getElementById("")
    form.setAttribute("action", "/feedback")
    form.submit()
}

function main(){
    let sendBut = document.getElementById("sendMail")
    sendBut.onclick = () => onClickSendMail()
}

main()