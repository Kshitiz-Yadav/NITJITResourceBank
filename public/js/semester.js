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

async function removeUpvote(fileID){
	fetch('/file/remove-upvote',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fileId: fileID }),
	})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function removeDownvote(fileID){
	fetch('/file/remove-downvote',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fileId: fileID }),
	})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function upvoteFile(fileID){
	fetch('/file/upvote',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fileId: fileID }),
	})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function downvoteFile(fileID){
	fetch('/file/downvote',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ fileId: fileID }),
	})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

document.addEventListener('click', async function (event) {
	if (event.target.classList.contains('show-file-details')) {
		document.getElementById("PYQsTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("PYQsAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("PYQsTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("PYQsThumbnail").setAttribute("src", event.target.getAttribute('data-thumbnail'));
		document.getElementById("PYQsDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById("PYQsID").setAttribute("value", event.target.getAttribute('data-fileId'));
		document.getElementById("PYQsExtension").setAttribute("value", event.target.getAttribute('data-extension'));
		document.getElementById("PYQsUpvotes").innerHTML = `<b>Upvotes: </b>${event.target.getAttribute('data-upvotesCount')}`;
		document.getElementById("PYQsDownvotes").innerHTML = `<b>Downvotes: </b>${event.target.getAttribute('data-downvotesCount')}`;
		document.getElementById("modal-buttons").innerHTML=`
		<button type="button" id='up_${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn"
                        data-userStatus="${event.target.getAttribute('data-userStatus')}" data-fileId="${event.target.getAttribute('data-fileId')}"
                        style="color: ${event.target.getAttribute('data-colorUp')};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${event.target.getAttribute('data-colorUp')};"
                            id='upv${event.target.getAttribute('data-index')}' data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
                    <button id='down_${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn"
                        data-fileId="${event.target.getAttribute('data-fileId')}" data-userStatus="${event.target.getAttribute('data-userStatus')}"
                        style="color: ${event.target.getAttribute('data-colorDown')};"><i class="fa fa-thumbs-down downvote-file-btn" id='downv${event.target.getAttribute('data-index')}'
                            style="color: ${event.target.getAttribute('data-colorDown')};" data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
                    <button type="button" id="openFileBtn" onclick="openBlobInNewTab('${event.target.getAttribute('data-fileId')}')" class="btn btn-primary">Open File</button>
                    <button type="button" id="downloadFileBtn" onclick="downloadBlob('${event.target.getAttribute('data-fileId')}', '${event.target.getAttribute('data-fullName')}')" class="btn btn-primary">Download File</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        data-bs-target="#showFileModal" aria-label="Close" id="showFileModalClose">Close</button>`
	}
	else if(event.target.classList.contains('upvote-file-btn')){
		if(event.target.getAttribute('data-userStatus')=='upvoted'){
			document.getElementById(`up-${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`upi${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			if(document.getElementById(`up_${event.target.id.substring(3)}`)){
				document.getElementById(`up_${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`upv${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`up_${event.target.id.substring(3)}`).setAttribute('data-userStatus', "none");
			document.getElementById(`upv${event.target.id.substring(3)}`).setAttribute('data-userStatus', "none");
			}
			document.getElementById(`up-${event.target.id.substring(3)}`).setAttribute('data-userStatus', "none");
			document.getElementById(`upi${event.target.id.substring(3)}`).setAttribute('data-userStatus', "none");
			await removeUpvote(event.target.getAttribute('data-fileId'));
			DynamicCreatePYQs();
		}
		else {
			document.getElementById(`up-${event.target.id.substring(3)}`).setAttribute("style", "color:#673AB7;");
			document.getElementById(`upi${event.target.id.substring(3)}`).setAttribute("style", "color:#673AB7;");
			if(document.getElementById(`up_${event.target.id.substring(3)}`)){
				document.getElementById(`up_${event.target.id.substring(3)}`).setAttribute("style", "color:#673AB7;");
			document.getElementById(`upv${event.target.id.substring(3)}`).setAttribute("style", "color:#673AB7;");
			document.getElementById(`up_${event.target.id.substring(3)}`).setAttribute('data-userStatus', "upvoted");
			document.getElementById(`upv${event.target.id.substring(3)}`).setAttribute('data-userStatus', "upvoted");
			document.getElementById(`down_${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`downv${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			}
			document.getElementById(`up-${event.target.id.substring(3)}`).setAttribute('data-userStatus', "upvoted");
			document.getElementById(`upi${event.target.id.substring(3)}`).setAttribute('data-userStatus', "upvoted");
			document.getElementById(`down-${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`downi${event.target.id.substring(3)}`).setAttribute("style", "color:#ffffff;");
			await upvoteFile(event.target.getAttribute('data-fileId'));
			DynamicCreatePYQs();
		}
	}
	else if(event.target.classList.contains('downvote-file-btn')){
		if(event.target.getAttribute('data-userStatus')=='downvoted'){
			if(document.getElementById(`down_${event.target.id.substring(5)}`)){
				document.getElementById(`down_${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
				document.getElementById(`downv${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
				document.getElementById(`down_${event.target.id.substring(5)}`).setAttribute('data-userStatus', "none");
				document.getElementById(`downv${event.target.id.substring(5)}`).setAttribute('data-userStatus', "none");
			}
			document.getElementById(`down-${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`downi${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`down-${event.target.id.substring(5)}`).setAttribute('data-userStatus', "none");
			document.getElementById(`downi${event.target.id.substring(5)}`).setAttribute('data-userStatus', "none");
			await removeDownvote(event.target.getAttribute('data-fileId'));
			DynamicCreatePYQs();
		}
		else {
			if(document.getElementById(`down_${event.target.id.substring(5)}`)){
				document.getElementById(`down_${event.target.id.substring(5)}`).setAttribute("style", "color:#673AB7;");
				document.getElementById(`downv${event.target.id.substring(5)}`).setAttribute("style", "color:#673AB7;");
				document.getElementById(`down_${event.target.id.substring(5)}`).setAttribute('data-userStatus', "downvoted");
				document.getElementById(`downv${event.target.id.substring(5)}`).setAttribute('data-userStatus', "downvoted");
				document.getElementById(`up_${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
				document.getElementById(`upv${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
			}
			document.getElementById(`down-${event.target.id.substring(5)}`).setAttribute("style", "color:#673AB7;");
			document.getElementById(`downi${event.target.id.substring(5)}`).setAttribute("style", "color:#673AB7;");
			document.getElementById(`down-${event.target.id.substring(5)}`).setAttribute('data-userStatus', "downvoted");
			document.getElementById(`downi${event.target.id.substring(5)}`).setAttribute('data-userStatus', "downvoted");
			document.getElementById(`up-${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
			document.getElementById(`upi${event.target.id.substring(5)}`).setAttribute("style", "color:#ffffff;");
			await downvoteFile(event.target.getAttribute('data-fileId'));
			DynamicCreatePYQs();
		}
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
		var colorUp="#ffffff", colorDown="#ffffff";
		if(pyqFiles[i].userStatus=='upvoted') colorUp='#673AB7';
		if(pyqFiles[i].userStatus=='downvoted') colorDown='#673AB7';
		pyqDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		pyqDiv.setAttribute("data-wow-delay", "0.1s");
		pyqDiv.innerHTML = `<div class="team-item bg-light">
		<div class="overflow-hidden text-center"><img class="img-fluid click_cursor show-file-details"
				id="pyq_${i}"
				data-bs-toggle="modal" data-bs-target="#showFileModal" data-title="${name}"
				data-thumbnail="${thumbnail}" data-userStatus="${pyqFiles[i].userStatus}" 
				data-fileId="${pyqFiles[i].id}"
				data-author="${pyqFiles[i].properties.fileAuthor}"
				data-description="${pyqFiles[i].description}"
				data-topics="${pyqFiles[i].properties.fileTopics}"
				data-upvotesCount="${pyqFiles[i].upvotesCount}"
				data-downvotesCount="${pyqFiles[i].downvotesCount}"
				data-colorUp="${colorUp}"
				data-colorDown="${colorDown}"
				data-index="${i}"
				data-fullName="${fullName}"
				data-extension="${pyqFiles[i].fileExtension ? pyqFiles[i].fileExtension : ''}"
				src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail"></div>
		<div class="position-relative d-flex justify-content-center" style="margin-top: -23px;">
			<div class="bg-light d-flex justify-content-center pt-2 px-1"><button id='up-${i}'
					class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-userStatus="${pyqFiles[i].userStatus}" data-fileId="${pyqFiles[i].id}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upi${i}' data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}"></i></button><button id='down-${i}'
					class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downi${i}' style="color: ${colorDown};" data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}"></i></button><button
					class="btn btn-sm-square btn-primary mx-1"
					onclick="downloadBlob('${id}', '${fullName}')" target="_blank"><i
						class="fa fa-download "></i></button></div>
		</div>
		<div class="text-center p-4">
			<hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small>
		</div>
	</div>`;
		document.getElementById("pyqs").appendChild(pyqDiv);
		document.getElementById("pyqs").appendChild(document.createElement("br"));
	}
}

function DynamicCreatePYQs(){
	fetch(`/get-pyqs?sem=${semester_no}`, {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			document.getElementById("pyqs").innerHTML=``;
			pyqsCreate(data);
		})
		.catch(error => console.error('Error fetching academics menu:', error));
}

function redirectToSubject(subject, subID) {
	$('#spinner').addClass('show');
	document.getElementById("subIDSend").value = subID;
	document.getElementById("subNameSend").value = subject;
	let form = document.getElementById("subjectForm")
	form.setAttribute("action", "/subject")
	form.submit()
};

DynamicCreatePYQs();
