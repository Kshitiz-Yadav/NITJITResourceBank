const subject_name = document.getElementById("subName").value;
const subject_id = document.getElementById("subID").value;
document.getElementById("subject_name").innerHTML = `${subject_name}`;

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
		document.getElementById("subjectTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("subjectAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("subjectTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("subjectThumbnail").setAttribute("src", event.target.getAttribute('data-thumbnail'));
		document.getElementById("subjectDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById("subjectID").setAttribute("value", event.target.getAttribute('data-id'));
		document.getElementById("subjectFullName").setAttribute("value", event.target.getAttribute('data-fullName'));
	}
	else if (event.target.classList.contains('show-url-details')) {
		document.getElementById("urlTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("urlAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("urlTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("urlDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById('visitURLBtn').setAttribute("href", `${event.target.getAttribute('data-url')}`);
	}
})


document.getElementById('openFileBtn').addEventListener('click', () => {
	const fileId = document.getElementById("subjectID").value;
	openBlobInNewTab(fileId);
});

document.getElementById('downloadFileBtn').addEventListener('click', () => {
	const fileId = document.getElementById("subjectID").value;
	const fileName = `${document.getElementById("subjectFullName").value}`;
	downloadBlob(fileId, fileName);
});

function dynamicCreate(Files, type) {
	for (var i = 0; i < Files.length; i++) {
		let name = Files[i].name;
		let id = Files[i].id;
		let fullName = Files[i].originalFilename;
		console.log(Files[i].fileExtension);
		let thumbnail = Files[i].thumbnailLink ? Files[i].thumbnailLink : 'img/preview_thumbnail.png';
		var fileDiv = document.createElement("div");
		fileDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><img class="img-fluid click_cursor show-file-details" data-bs-toggle="modal" data-bs-target="#showFileModal" data-title="${name}" data-thumbnail="${thumbnail}" data-id="${Files[i].id}" data-author="${Files[i].properties.fileAuthor}" data-description="${Files[i].description}" data-topics="${Files[i].properties.fileTopics}" data-fullName="${fullName}" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><button class="btn btn-sm-square btn-primary mx-1" onclick="downloadBlob('${id}', '${fullName}')"><i class="fa fa-download "></i></button></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
		document.getElementById(type).appendChild(fileDiv);
		document.getElementById(type).appendChild(document.createElement("br"));
	}
}

async function convertYoutubeUrlToEmbed(url) {
	try {
		const apiUrl = "https://www.youtube.com/oembed?url=" + url + "&format=json";
		const code = await fetch(apiUrl)
			.then(response => response.json())
			.then(data => data.html);
		return code;
	} catch (err) {
		throw err;
	}
}

async function createYTElements(Files) {
	for (var i = 0; i < Files.length; i++) {
		let name = Files[i].name;
		let url = Files[i].properties.URL;
		let ytlink = await convertYoutubeUrlToEmbed(url);
		ytlink = ytlink.substring(0, 8) + 'width="500" height="300"' + ytlink.substring(32);
		var fileDiv = document.createElement("div");
		fileDiv.className = "col-lg-6 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		fileDiv.innerHTML = `<div class="team-item bg-light" style="padding-top: 5%" ><div class="overflow-hidden text-center">'${ytlink}'</div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><button class="btn btn-square btn-primary mx-1 show-url-details" data-bs-toggle="modal" data-bs-target="#showURLModal" data-title="${name}" data-url="${url}" data-author="${Files[i].properties.fileAuthor}" data-description="${Files[i].description}" data-topics="${Files[i].properties.fileTopics}"><i class="fa fa-info-circle"></i></button></div></div><div class="text-center p-4"><hr style="margin: 0em"><h2 class="mb-0">${name}</h2></div></div>`;
		document.getElementById("ytplaylist").appendChild(fileDiv);
		document.getElementById("ytplaylist").appendChild(document.createElement("br"));
	}
}

async function createOthersElements(Files) {
	for (var i = 0; i < Files.length; i++) {
		let name = Files[i].name;
		let url = Files[i].properties.URL;
		var fileDiv = document.createElement("div");
		fileDiv.className = "row g-4 service-item justify-content-lg-center";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		fileDiv.innerHTML = `<div class="col-lg-8 col-sm-8 col-md-8 wow fadeInUp click_cursor" data-wow-delay="0.3s">
		<a href=${url} target="_blank">
		<div class=" text-left">
			<div class="p-1">
				<h5 class="mb-3 ms-5">${name}</h5>
			</div>
		</div>
		</a>
	</div>
	<div class="col-lg-3 col-sm-3 col-md-3 wow fadeInUp" data-wow-delay="0.3s">
		<div class="d-flex justify-content-center px-1">
			<a class="btn btn-square btn-secondary mx-1"><i class="fa fa-thumbs-up "></i>
			</a>
			<a class="btn btn-square btn-secondary mx-1"><i class="fa fa-thumbs-down "></i>
			</a>
			<button class="btn btn-square btn-secondary mx-1 show-url-details" data-bs-toggle="modal"
				data-bs-target="#showURLModal" data-title="${name}" data-url="${url}"
				data-author="${Files[i].properties.fileAuthor}"
				data-description="${Files[i].description}"
				data-topics="${Files[i].properties.fileTopics}"><i class="fa fa-info-circle"></i>
			</button>
		</div>
	</div>`
		document.getElementById("others").appendChild(fileDiv);
		document.getElementById("others").appendChild(document.createElement("br"));
	}
}

async function fetchFiles(subID, type) {
	fetch(`/get-subFiles?subject=${subID}&type=${type}`, {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			dynamicCreate(data, type);
		})
		.catch(error => console.error('Error fetching files:', error));
}


async function fetchYTLinks(subID, type) {
	fetch(`/get-subFiles?subject=${subID}&type=${type}`, {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			createYTElements(data);
		})
		.catch(error => console.error('Error fetching files:', error));
}

async function fetchOtherLinks(subID, type) {
	fetch(`/get-subFiles?subject=${subID}&type=${type}`, {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			createOthersElements(data);
		})
		.catch(error => console.error('Error fetching files:', error));
}

fetchFiles(subject_id, "Notes");
fetchFiles(subject_id, "PPT");
fetchFiles(subject_id, "BOOKS");
fetchYTLinks(subject_id, "YTPlaylist");
fetchOtherLinks(subject_id, "Others")