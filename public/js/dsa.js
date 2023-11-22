function show_answer(element_id){
    if(document.getElementById(element_id).style.display == "block"){
        document.getElementById(element_id).style.display = "none";
    }
    else{
        document.getElementById(element_id).style.display = "block";
    }
}