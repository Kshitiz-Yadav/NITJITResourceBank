// Showing / hiding faculty contact details
function show_contact(element_id1,element_id2){
    if(document.getElementById(element_id1).style.display == "block"){
        document.getElementById(element_id1).style.display = "none";
        document.getElementById(element_id2).style.display = "none";
    }
    else{
        document.getElementById(element_id1).style.display = "block";
        document.getElementById(element_id2).style.display = "block";
    }
}


// Showing Model Image

var modal = document.getElementById("myModal")
var modalImg = document.getElementById("img01");
function model_img(src)
{
    modal.style.display = "block";
    modalImg.src = src;
}
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
modal.onclick = function() {
    modal.style.display = "none";
  }