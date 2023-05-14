const subject_name = document.getElementById("subName").value
const bookF = JSON.parse(document.getElementById("bookFiles").value)
const notesF = JSON.parse(document.getElementById("notesFiles").value)
const pptF = JSON.parse(document.getElementById("pptFiles").value)
const otherF = JSON.parse(document.getElementById("otherFiles").value)
const excelF = JSON.parse(document.getElementById("excelFiles").value)
document.getElementById("subject_name").innerHTML= `${subject_name}`;


let yt = [];
for(let i=0;i<excelF.length;i++){
	if(excelF[i][1]!=null &&excelF[i][0].substring(0,8) == subject_name.substring(0,8)){
		let link = excelF[i][1];
		link = link.substring(0,8)+ 'width="500" height="300"'+link.substring(32);
		yt.push([link,excelF[i][2]]);
	}
}

function dynamicCreate(parent_id,col_width, Files) {
	for (var i = 0; i < Files.length; i++) {
		let name = Files[i].name;
		let thumbnail = Files[i].thumbnailLink;
		if(thumbnail==undefined){
			thumbnail="../img/preview_thumbnail.png"
		}
		let webview = Files[i].webViewLink;
		let webview2 = "";
		let download = Files[i].webContentLink;
        var fileDiv = document.createElement("div");
        fileDiv.className = col_width+" col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		if(webview.includes("/view")){
			webview2 = webview.replace("view", "preview");
			webview2 = webview2.replace("?usp=drivesdk", "");
        	fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a onclick="model_file('${webview2}')"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}
		else if(webview.includes("docs.google.com")){
			let start = webview.indexOf("/d/");
			let end = webview.indexOf("/edit")
			webview2 = "https://docs.google.com/gview?url=https://drive.google.com/uc?id="+webview.substring(start+3,end)+"&embedded=true";
			fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a onclick="model_file('${webview2}')"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}else{
			fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a target="_blank" href="${webview}"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}
        document.getElementById(parent_id).appendChild(fileDiv);
		document.getElementById(parent_id).appendChild(document.createElement("br"));
    }
}

dynamicCreate("notes", "col-lg-2_5", notesF);
dynamicCreate("ppts", "col-lg-2_5", pptF);
dynamicCreate("books", "col-lg-2_5", bookF);
dynamicCreate("others", "col-lg-2_5", otherF);

// for YT Playlists
for (var i = 0; i < yt.length; i++) {
	let name = yt[i][1];
	let ytlink = yt[i][0];
	var fileDiv = document.createElement("div");
	fileDiv.className = "col-lg-6 col-md-6 wow fadeInUp";
	fileDiv.setAttribute("data-wow-delay", "0.1s");
	fileDiv.innerHTML = `<div class="team-item bg-light" style="padding-top: 5%" ><div class="overflow-hidden text-center">'${ytlink}'</div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-3 px-1"><a class="btn btn-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><h2 class="mb-0">${name}</h2></div></div>`;
	document.getElementById("ytplaylist").appendChild(fileDiv);
	document.getElementById("ytplaylist").appendChild(document.createElement("br"));
}

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