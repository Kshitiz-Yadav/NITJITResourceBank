const semester_no = document.getElementById("semName").value;
let sebjectList = JSON.parse(document.getElementById("sebjectList").value);
document.getElementById("semester_name").innerHTML = semester_no;

function downloadBlob(fileID, fileName) {
	// Create an anchor element
	var link = document.createElement('a');
	link.href = `/downloadFile?fileId=${fileID}`;
	link.download = fileName;
	link.style.display = 'none';
	link.setAttribute("target", "_blank");
	// Append the link to the document body
	document.body.appendChild(link);
	// Trigger the download
	link.click();
	// Clean up
	document.body.removeChild(link);

	document.getElementById('download_message').innerHTML=`<b>Starting Download ...</b>`;
	setTimeout(function () {
		document.getElementById('download_message').innerHTML=``;
	}, 3000);
}

function openBlobInNewTab(fileID) {
	// Open the blob object URL in a new tab
	window.open(`/downloadFile?fileId=${fileID}`, '_blank');
}

document.addEventListener('click', function (event) {
	if (event.target.classList.contains('show-file-details')) {
		document.getElementById("PYQsTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("PYQsAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("PYQsTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("PYQsThumbnail").setAttribute("src", event.target.getAttribute('data-thumbnail'));
		document.getElementById("PYQsDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById("PYQsID").setAttribute("value", event.target.getAttribute('data-id'));
		document.getElementById("PYQsExtension").setAttribute("value", event.target.getAttribute('data-extension'));
	}
})

document.getElementById('openFileBtn').addEventListener('click', () => {
	const fileId = document.getElementById("PYQsID").value;
	openBlobInNewTab(fileId);
});

document.getElementById('downloadFileBtn').addEventListener('click', () => {
	const fileId = document.getElementById("PYQsID").value;
	const fileName = `${document.getElementById("PYQsTitle").textContent}${document.getElementById("PYQsExtension").value}`;
	downloadBlob(fileId, fileName);
});

let Labs = [];
let Subjects = [];

for (let i = 0; i < sebjectList.length; i++) {
	let title = sebjectList[i].name;
	if (title.slice(-3) == "Lab") {
		Labs.push([title, sebjectList[i].id]);
	}
	else if (title != "Previous Year Exams") {
		Subjects.push([title, sebjectList[i].id]);
	}
}

// loop through the subjectsList and append the "Subjects" div for each subject
for (var i = 0; i < Subjects.length; i++) {
	var subject = Subjects[i][0];
	var subID = Subjects[i][1];
	var subjectDiv = document.createElement("div");
	subjectDiv.className = "row g-4 justify-content-lg-center";
	subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}', '${subID}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`;
	document.getElementById("subjects").appendChild(subjectDiv);
	document.getElementById("subjects").appendChild(document.createElement("br"));
}

// loop through the LabsList and append the "Labs" div for each Lab
for (var i = 0; i < Labs.length; i++) {
	var subject = Subjects[i][0];
	var subID = Subjects[i][1];
	var subjectDiv = document.createElement("div");
	subjectDiv.className = "row g-4 justify-content-lg-center";
	subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}', '${subID}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`;
	document.getElementById("lab_subjects").appendChild(subjectDiv);
	document.getElementById("lab_subjects").appendChild(document.createElement("br"))
}

function pyqsCreate(pyqFiles) {
	for (var i = 0; i < pyqFiles.length; i++) {
		let name = pyqFiles[i].name;
		let id = pyqFiles[i].id;
		let fullName = `${name}${pyqFiles[i].fileExtension ? pyqFiles[i].fileExtension : ''}`
		let thumbnail = pyqFiles[i].thumbnailLink?pyqFiles[i].thumbnailLink:'img/preview_thumbnail.png';
		var pyqDiv = document.createElement("div");
		pyqDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		pyqDiv.setAttribute("data-wow-delay", "0.1s");
		pyqDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><img class="img-fluid click_cursor show-file-details" data-bs-toggle="modal" data-bs-target="#showFileModal" data-title="${name}" data-thumbnail="${thumbnail}" data-id="${pyqFiles[i].id}" data-author="${pyqFiles[i].properties.fileAuthor}" data-description="${pyqFiles[i].description}" data-topics="${pyqFiles[i].properties.fileTopics}" data-extension="${pyqFiles[i].fileExtension ? pyqFiles[i].fileExtension : ''}" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><button class="btn btn-sm-square btn-primary mx-1" onclick="downloadBlob('${id}', '${fullName}')" target="_blank"><i class="fa fa-download "></i></button></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		document.getElementById("pyqs").appendChild(pyqDiv);
		document.getElementById("pyqs").appendChild(document.createElement("br"));
	}
}

fetch(`/get-pyqs?sem=${semester_no}`, {
	method: 'GET'
})
	.then(response => response.json())
	.then(data => {
		pyqsCreate(data);
	})
	.catch(error => console.error('Error fetching academics menu:', error));

function redirectToSubject(subject, subID) {
	$('#spinner').addClass('show');
	document.getElementById("subIDSend").value = subID;
	document.getElementById("subNameSend").value = subject;
	let form = document.getElementById("subjectForm")
	form.setAttribute("action", "/subject")
	form.submit()
};