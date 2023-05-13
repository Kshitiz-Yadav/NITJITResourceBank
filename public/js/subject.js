const subject_name = document.getElementById("subName").value
const bookF = JSON.parse(document.getElementById("bookFiles").value)
const notesF = JSON.parse(document.getElementById("notesFiles").value)
const pptF = JSON.parse(document.getElementById("pptFiles").value)
const otherF = JSON.parse(document.getElementById("otherFiles").value)
const excelF = JSON.parse(document.getElementById("excelFiles").value)
document.getElementById("subject_name").innerHTML= `${subject_name}`;

function dynamicCreate(parent_id, Files) {
	for (var i = 0; i < Files.length; i++) {
        let name = Files[i].name;
		let thumbnail = Files[i].thumbnailLink;
		let webview = Files[i].webViewLink;
		webview = webview.replace("view", "preview");
		webview = webview.replace("?usp=drivesdk", "");
		let download = Files[i].webContentLink;
        var fileDiv = document.createElement("div");
        fileDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
        fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a onclick="model_file('${webview}')"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
        document.getElementById(parent_id).appendChild(fileDiv);
		document.getElementById(parent_id).appendChild(document.createElement("br"));
    }
}

dynamicCreate("notes", notesF);
dynamicCreate("ppts", pptF);
dynamicCreate("books", bookF);
dynamicCreate("others", otherF);


// Showing Model Files
var modal = document.getElementById("myModal")
var modalFile = document.getElementById("file01");
function model_file(src)
{
    modal.style.display = "block";
    modalFile.src = src;
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