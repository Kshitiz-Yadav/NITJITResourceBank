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
		document.getElementById("subjectTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("subjectAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("subjectTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("subjectThumbnail").setAttribute("src", event.target.getAttribute('data-thumbnail'));
		document.getElementById("subjectDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById("subjectID").setAttribute("value", event.target.getAttribute('data-id'));
		document.getElementById("subjectFullName").setAttribute("value", event.target.getAttribute('data-fullName'));
		document.getElementById("subjectUpvotes").innerHTML = `<b>Upvotes: </b>${event.target.getAttribute('data-upvotesCount')}`;
		document.getElementById("subjectDownvotes").innerHTML = `<b>Downvotes: </b>${event.target.getAttribute('data-downvotesCount')}`;
		document.getElementById("modal-buttons-subject").innerHTML=`
		<button type="button" id='up_${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn"
                        data-userStatus="${event.target.getAttribute('data-userStatus')}" data-type="${event.target.getAttribute('data-type')}" data-fileId="${event.target.getAttribute('data-fileId')}"
                        style="color: ${event.target.getAttribute('data-colorUp')};"><i class="fa fa-thumbs-up upvote-file-btn" data-type="${event.target.getAttribute('data-type')}" style="color: ${event.target.getAttribute('data-colorUp')};"
                            id='upv${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
                    <button data-type="${event.target.getAttribute('data-type')}" id='down_${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn"
                        data-fileId="${event.target.getAttribute('data-fileId')}" data-userStatus="${event.target.getAttribute('data-userStatus')}"
                        style="color: ${event.target.getAttribute('data-colorDown')};"><i data-type="${event.target.getAttribute('data-type')}" class="fa fa-thumbs-down downvote-file-btn" id='downv${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}'
                            style="color: ${event.target.getAttribute('data-colorDown')};" data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
                    <button type="button" id="openFileBtn" class="btn btn-primary">Open File</button>
                    <button type="button" id="downloadFileBtn" class="btn btn-primary">Download File</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        data-bs-target="#showFileModal" aria-label="Close" id="showFileModalClose">Close</button>`
	}
	else if (event.target.classList.contains('show-url-details')) {
		document.getElementById("urlTitle").innerHTML = event.target.getAttribute('data-title');
		document.getElementById("urlAuther").innerHTML = `<b>Uploaded By: </b>${event.target.getAttribute('data-author')}`;
		document.getElementById("urlTopics").innerHTML = `<b>Topics Covered: </b>${event.target.getAttribute('data-topics')}`;
		document.getElementById("urlUpvotes").innerHTML = `<b>Upvotes: </b>${event.target.getAttribute('data-upvotesCount')}`;
		document.getElementById("urlDownvotes").innerHTML = `<b>Downvotes: </b>${event.target.getAttribute('data-downvotesCount')}`;
		document.getElementById("urlDesc").innerHTML = `<b>Description: </b>${event.target.getAttribute('data-description')}`;
		document.getElementById('visitURLBtn').setAttribute("href", `${event.target.getAttribute('data-url')}`);
		document.getElementById("modal-buttons-url").innerHTML=`
		<button type="button" data-type="${event.target.getAttribute('data-type')}" id='up_${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn"
                        data-userStatus="${event.target.getAttribute('data-userStatus')}" data-fileId="${event.target.getAttribute('data-fileId')}"
                        style="color: ${event.target.getAttribute('data-colorUp')};"><i data-type="${event.target.getAttribute('data-type')}" class="fa fa-thumbs-up upvote-file-btn" style="color: ${event.target.getAttribute('data-colorUp')};"
                            id='upv${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
                    <button data-type="${event.target.getAttribute('data-type')}" id='down_${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn"
                        data-fileId="${event.target.getAttribute('data-fileId')}" data-userStatus="${event.target.getAttribute('data-userStatus')}"
                        style="color: ${event.target.getAttribute('data-colorDown')};"><i data-type="${event.target.getAttribute('data-type')}" class="fa fa-thumbs-down downvote-file-btn" id='downv${event.target.getAttribute('data-type')}${event.target.getAttribute('data-index')}'
                            style="color: ${event.target.getAttribute('data-colorDown')};" data-fileId="${event.target.getAttribute('data-fileId')}"
                            data-userStatus="${event.target.getAttribute('data-userStatus')}"></i></button>
							<a id="visitURLBtn" target="_blank" class="btn btn-primary">Visit</a>
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
								data-bs-target="#showURLModal" aria-label="Close" id="showURLModalClose">Close</button>`
	}

	else if(event.target.classList.contains('upvote-file-btn')){
		var type = event.target.getAttribute('data-type');
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
			if(type=="YTPlaylist"){
				fetchYTLinks(subject_id, "YTPlaylist");
			}
			else if(type=="Others"){
				fetchOtherLinks(subject_id, "Others")
			}
			else{
				fetchFiles(subject_id, type);
			}
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
			if(type=="YTPlaylist"){
				fetchYTLinks(subject_id, "YTPlaylist");
			}
			else if(type=="Others"){
				fetchOtherLinks(subject_id, "Others")
			}
			else{
				fetchFiles(subject_id, type);
			}
		}
	}
	else if(event.target.classList.contains('downvote-file-btn')){
		var type = event.target.getAttribute('data-type');
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
			if(type=="YTPlaylist"){
				fetchYTLinks(subject_id, "YTPlaylist");
			}
			else if(type=="Others"){
				fetchOtherLinks(subject_id, "Others")
			}
			else{
				fetchFiles(subject_id, type);
			}
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
			if(type=="YTPlaylist"){
				fetchYTLinks(subject_id, "YTPlaylist");
			}
			else if(type=="Others"){
				fetchOtherLinks(subject_id, "Others")
			}
			else{
				fetchFiles(subject_id, type);
			}
		}
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
		let thumbnail = Files[i].thumbnailLink ? Files[i].thumbnailLink : 'img/preview_thumbnail.png';
		var fileDiv = document.createElement("div");
		var colorUp="#ffffff", colorDown="#ffffff";
		if(Files[i].userStatus=='upvoted') colorUp='#673AB7';
		if(Files[i].userStatus=='downvoted') colorDown='#673AB7';
		var fileDiv = document.createElement("div");
		fileDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		fileDiv.innerHTML = `<div class="team-item bg-light">
		<div class="overflow-hidden text-center"><img class="img-fluid click_cursor show-file-details"
				id="${type}${i}"
				data-bs-toggle="modal" data-bs-target="#showFileModal" data-title="${name}"
				data-thumbnail="${thumbnail}" data-userStatus="${Files[i].userStatus}" 
				data-fileId="${Files[i].id}"
				data-author="${Files[i].properties.fileAuthor}"
				data-description="${Files[i].description}"
				data-topics="${Files[i].properties.fileTopics}"
				data-upvotesCount="${Files[i].upvotesCount}"
				data-downvotesCount="${Files[i].downvotesCount}"
				data-colorUp="${colorUp}"
				data-colorDown="${colorDown}"
				data-index="${i}"
				data-type="${type}"
				data-extension="${Files[i].fileExtension ? Files[i].fileExtension : ''}"
				src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail"></div>
		<div class="position-relative d-flex justify-content-center" style="margin-top: -23px;">
			<div class="bg-light d-flex justify-content-center pt-2 px-1"><button id='up-${type}${i}'
					class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-type="${type}" data-userStatus="${Files[i].userStatus}" data-fileId="${Files[i].id}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upi${type}${i}' data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button><button id='down-${type}${i}'
					class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downi${type}${i}' style="color: ${colorDown};" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button><button
					class="btn btn-sm-square btn-primary mx-1"
					onclick="downloadBlob('${id}', '${fullName}')" target="_blank"><i
						class="fa fa-download "></i></button></div>
		</div>
		<div class="text-center p-4">
			<hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small>
		</div>
	</div>`;
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
		let type="YTPlaylist"
		let ytlink = await convertYoutubeUrlToEmbed(url);
		ytlink = ytlink.substring(0, 8) + 'width="500" height="300"' + ytlink.substring(32);
		var colorUp="#ffffff", colorDown="#ffffff";
		if(Files[i].userStatus=='upvoted') colorUp='#673AB7';
		if(Files[i].userStatus=='downvoted') colorDown='#673AB7';
		var fileDiv = document.createElement("div");
		fileDiv.className = "col-lg-6 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
		fileDiv.innerHTML = `
		<div class="team-item bg-light" style="padding-top: 5%">
    <div class="overflow-hidden text-center">'${ytlink}'</div>
    <div class="position-relative d-flex justify-content-center" style="margin-top: -23px;">
        <div class="bg-light d-flex justify-content-center pt-2 px-1">
		<button id='up-${type}${i}'
					class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-type="${type}" data-userStatus="${Files[i].userStatus}" data-fileId="${Files[i].id}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upi${type}${i}' data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button><button id='down-${type}${i}'
					class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downi${type}${i}' style="color: ${colorDown};" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button>
		<button class="btn btn-square btn-primary mx-1 show-url-details"
                data-bs-toggle="modal" data-bs-target="#showURLModal" data-title="${name}" data-url="${url}"
                data-userStatus="${Files[i].userStatus}" 
				data-fileId="${Files[i].id}"
				data-author="${Files[i].properties.fileAuthor}"
				data-description="${Files[i].description}"
				data-topics="${Files[i].properties.fileTopics}"
				data-upvotesCount="${Files[i].upvotesCount}"
				data-downvotesCount="${Files[i].downvotesCount}"
				data-colorUp="${colorUp}"
				data-colorDown="${colorDown}"
				data-type="${type}"
				data-index="${i}"><i class="fa fa-info-circle"></i></button></div>
    </div>
    <div class="text-center p-4">
        <hr style="margin: 0em">
        <h2 class="mb-0">${name}</h2>
    </div>
</div>`;
		document.getElementById("YTPlaylist").appendChild(fileDiv);
		document.getElementById("YTPlaylist").appendChild(document.createElement("br"));
	}
}

async function createOthersElements(Files) {
	for (var i = 0; i < Files.length; i++) {
		let name = Files[i].name;
		let url = Files[i].properties.URL;
		var type= "Others"
		var colorUp="#ffffff", colorDown="#ffffff";
		if(Files[i].userStatus=='upvoted') colorUp='#673AB7';
		if(Files[i].userStatus=='downvoted') colorDown='#673AB7';
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
		<button id='up-${type}${i}'
		class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-type="${type}" data-userStatus="${Files[i].userStatus}" data-fileId="${Files[i].id}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upi${type}${i}' data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button><button id='down-${type}${i}'
		class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downi${type}${i}' style="color: ${colorDown};" data-type="${type}" data-fileId="${Files[i].id}" data-userStatus="${Files[i].userStatus}"></i></button>
			<button class="btn btn-square btn-secondary mx-1 show-url-details" data-bs-toggle="modal"
				data-bs-target="#showURLModal" data-title="${name}" data-url="${url}"
				data-userStatus="${Files[i].userStatus}" 
				data-fileId="${Files[i].id}"
				data-author="${Files[i].properties.fileAuthor}"
				data-description="${Files[i].description}"
				data-topics="${Files[i].properties.fileTopics}"
				data-upvotesCount="${Files[i].upvotesCount}"
				data-downvotesCount="${Files[i].downvotesCount}"
				data-colorUp="${colorUp}"
				data-colorDown="${colorDown}"
				data-type="${type}"
				data-index="${i}><i class="fa fa-info-circle"></i>
			</button>
		</div>
	</div>`
		document.getElementById("Others").appendChild(fileDiv);
		document.getElementById("Others").appendChild(document.createElement("br"));
	}
}

async function fetchFiles(subID, type) {
	fetch(`/get-subFiles?subject=${subID}&type=${type}`, {
		method: 'GET'
	})
		.then(response => response.json())
		.then(data => {
			document.getElementById(type).innerHTML=``
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
			document.getElementById("YTPlaylist").innerHTML=``;
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
			document.getElementById("Others").innerHTML=``;
			createOthersElements(data);
		})
		.catch(error => console.error('Error fetching files:', error));
}

fetchFiles(subject_id, "Notes");
fetchFiles(subject_id, "PPT");
fetchFiles(subject_id, "BOOKS");
fetchYTLinks(subject_id, "YTPlaylist");
fetchOtherLinks(subject_id, "Others")