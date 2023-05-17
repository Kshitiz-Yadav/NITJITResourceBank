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
var model = document.getElementById("myModel")
var modelImg = document.getElementById("img01");
function model_img(src)
{
    model.style.display = "block";
    modelImg.src = src;
}
// Get the <span> element that closes the model
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the model
span.onclick = function() {
  model.style.display = "none";
}
model.onclick = function() {
    model.style.display = "none";
  }