const semester_no = document.getElementById("semNum").value
let pyqFiles = JSON.parse(document.getElementById("pyqFiles").value)
let semFiles = JSON.parse(document.getElementById("semFiles").value)
document.getElementById("semester_name").innerHTML=semester_no;

let Labs = [];
let Subjects = [];

for(let i=0;i<semFiles.length;i++){
	let title = semFiles[i].name;
	if(title.slice(-3) == "Lab"){
		Labs.push(title.substring(0,8)+":"+title.substring(8));
	}
	else if(title != "Youtube Playlist" && title != "Previous Year Exams"){
		Subjects.push(title.substring(0,8)+":"+title.substring(8));
	}
}

function pyqsCreate(pyqFiles) {
	for (var i = 0; i < pyqFiles.length; i++) {
        let name = pyqFiles[i].name;
		let thumbnail = pyqFiles[i].thumbnailLink;
		let webview = pyqFiles[i].webViewLink;
		let webview2 = "";
		let download = pyqFiles[i].webContentLink;
        var pyqDiv = document.createElement("div");
        pyqDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		pyqDiv.setAttribute("data-wow-delay", "0.1s");
        if(webview.includes("/view")){
			webview2 = webview.replace("view", "preview");
			webview2 = webview2.replace("?usp=drivesdk", "");
        	pyqDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a onclick="model_file('${webview2}')"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}
		else if(webview.includes("docs.google.com")){
			let start = webview.indexOf("/d/");
			let end = webview.indexOf("/edit")
			webview2 = "https://docs.google.com/gview?url=https://drive.google.com/uc?id="+webview.substring(start+3,end)+"&embedded=true";
			pyqDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a onclick="model_file('${webview2}')"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}else{
			pyqDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a target="_blank" href="${webview}"><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		}
		document.getElementById("pyqs").appendChild(pyqDiv);
		document.getElementById("pyqs").appendChild(document.createElement("br"));
    }
}

function redirectToSubject(subject) {
	document.getElementById("subName").value = subject
	document.getElementById("semIDSend").value = document.getElementById("semIDReceive").value
	let form = document.getElementById("subjectForm")
	form.setAttribute("action", "/subject")
	form.submit()
};

pyqsCreate(pyqFiles);

// loop through the subjectsList and append the "Subjects" div for each subject
for (var i = 0; i < Subjects.length; i++) {
	var subject = Subjects[i];
	var subjectDiv = document.createElement("div");
	subjectDiv.className = "row g-4 justify-content-lg-center";
	subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`;
	document.getElementById("subjects").appendChild(subjectDiv);
	document.getElementById("subjects").appendChild(document.createElement("br"));
}

// loop through the LabsList and append the "Labs" div for each Lab
for (var i = 0; i < Labs.length; i++) {
	var subject = Labs[i];
	var subjectDiv = document.createElement("div");
	subjectDiv.className = "row g-4 justify-content-lg-center";
	subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`;
	document.getElementById("lab_subjects").appendChild(subjectDiv);
	document.getElementById("lab_subjects").appendChild(document.createElement("br"))
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