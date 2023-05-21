function onClickSendMail(){
    let form = document.getElementById("")
    form.setAttribute("action", "/support")
    form.submit()
}

function main(){
    let sendBut = document.getElementById("sendMail")
    sendBut.onclick = () => onClickSendMail()
}

main()