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

let facultyF = JSON.parse(document.getElementById("facultyFiles").value);
let faculty_xl = JSON.parse(document.getElementById("faculty_excel").value);
let isAdmin = document.getElementById("isAdmin").value;
if(isAdmin == 'true'){
    document.getElementById('adminPrivDrop').style = "display: block;"
}

let faculty = [];
for(let i=1;i<faculty_xl.length;i++){
    let name = faculty_xl[i][0];
    let ProfileLink = faculty_xl[i][1];
    let Designation = faculty_xl[i][2];
    let EMail = faculty_xl[i][3];
    let Mobile = faculty_xl[i][4];
    let Image = ""
    for(let j=1;j<facultyF.length;j++){
        if(facultyF[j].name==faculty_xl[i][5]){
            Image = facultyF[j].webContentLink;
        }
    }
    faculty.push([name, ProfileLink, Designation, EMail, Mobile, Image])
}


// loop through the facultyList and append the "Faculty" div for each subject
for (var i = 0; i < faculty.length; i++) {
	var facultyDiv = document.createElement("div");
	facultyDiv.className = "col-lg-3 col-md-6 wow fadeInUp";
    facultyDiv.setAttribute("data-wow-delay", "0.1s");
	facultyDiv.innerHTML = `<div class="team-item bg-light">
    <div class="overflow-hidden">
        <a target="_blank" href= '${faculty[i][1]}'><img class="img-fluid" src='${faculty[i][5]}' alt="No Image Found!"></a>
    </div>
    <div class="position-relative d-flex justify-content-center" style="margin-top: -23px;">
        <div class="bg-light d-flex justify-content-center pt-2 px-1">
            <span class="btn btn-faculty-wide btn-primary mx-1" onclick="show_contact('${'mail_faculty_'+(i+1).toString()}','${'phone_faculty_'+(i+1).toString()}')"></a><i class="fa fa-envelope ">&nbsp; Contact</i></span>
        </div>
    </div>
    <i class="fa fa-envelope text-center team-contact" id='${'mail_faculty_'+(i+1).toString()}'>&nbsp;<small>${faculty[i][3]}</small></i>
    <i class="fa fa-phone text-center team-contact"  id='${'phone_faculty_'+(i+1).toString()}'>&nbsp;<small>${faculty[i][4]}</small></i>
    <div class="text-center p-4">
        <h5 class="mb-0">${faculty[i][0]}</h5>
        <small>${faculty[i][2]}</small>
    </div>
</div>`;
	document.getElementById("teachers").appendChild(facultyDiv);
	document.getElementById("teachers").appendChild(document.createElement("br"));
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
