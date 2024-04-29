const schema = [];
const semSelect = document.getElementById("semesterSelect");
const subDiv = document.getElementById("subjectDiv");
const subSelect = document.getElementById("subjectSelect");
const semDiv = document.getElementById("semesterDiv");
const uploadResButton = document.getElementById("upload-resources-btn");
const typeDiv = document.getElementById("typeDiv");
const typeSelect = document.getElementById("typeSelect");
const fileAuthorDiv = document.getElementById("fileAuthorDiv");
const fileNameDiv = document.getElementById("fileNameDiv");
const fileTopicsDiv = document.getElementById("fileTopicsDiv");
const fileDescDiv = document.getElementById("fileDescDiv");
const fileDesc = document.getElementById("fileDesc");
const fileTopics = document.getElementById("fileTopics");
const fileAuthor = document.getElementById("fileAuthor");
const fileName = document.getElementById("fileName");
const fileInputDiv = document.getElementById("fileInputDiv");
const fileUploadForm = document.getElementById("fileUploadForm");
const fileNameLabel = document.getElementById("fileNameLabel");

function setUploadInfo(){
    fileNameDiv.classList.remove('hidden');
    fileAuthorDiv.classList.remove('hidden');
    fileDescDiv.classList.remove('hidden');
    fileTopicsDiv.classList.remove('hidden');
}

function setForYTURL(){
    fileNameLabel.innerHTML=`Video/Resource Title:`;
    fileInputDiv.innerHTML=`<label for="fileInput" class="col-sm-3 col-form-label">Enter URL:</label>
    <div class="col-sm-9">
        <input type="text" required class="form-control-plaintext border border-secondary" id="fileInput" name="fileInput"
            aria-label="URL Input">
    </div>`
}

function setForFile(){
    fileNameLabel.innerHTML=`File Name To Be Saved:`;
    fileInputDiv.innerHTML=`<label for="fileInput" class="col-sm-3 col-form-label">Select File:</label>
    <div class="col-sm-9">
        <input required class="form-control border border-secondary" type="file" id="fileInput" name="fileInput"
            aria-label="File Input">
    </div>`
}

function fetchShemaAndRender() {
    fetch('/faculty/academic_schema')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                schema.push(item);
            });
            uploadResButton.innerHTML = "Upload Resources";
            uploadResButton.removeAttribute("disabled");
        })
        .catch(error => console.error('Error fetching data:', error));
}
fetchShemaAndRender();

function loadSemList() {
    semSelect.innerHTML = ``
    schema.forEach(sem => {
        let option = document.createElement("option");
        option.setAttribute("value", sem.id);
        option.innerHTML = sem.name;
        semSelect.appendChild(option);
    });
    setSubjectOptions();
}

function setSubjectOptions(){
    subDiv.classList.remove("hidden");
    subSelect.innerHTML = ``;
    for (let index = 0; index < schema.length; index++) {
        if (schema[index].id == semSelect.value) {
            (schema[index].children).forEach(sub => {
                let option = document.createElement("option");
                option.setAttribute("value", sub.id);
                option.innerHTML = sub.name;
                subSelect.appendChild(option);
            });
            break;
        }
    }
    setTypeOptions();
}

function setTypeOptions(){
    typeDiv.classList.remove("hidden");
    if (subSelect.options[subSelect.selectedIndex].text == 'Previous Year Exams') {
        typeSelect.innerHTML = ``
        let option = document.createElement("option");
        option.setAttribute("value", "PYQs");
        option.innerHTML = `PYQs`;
        typeSelect.appendChild(option);
        setForFile();
        setUploadInfo();
    }
    else{
        typeSelect.innerHTML = ``;
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        let option3 = document.createElement("option");
        let option4 = document.createElement("option");
        let option5 = document.createElement("option");
        option1.setAttribute("value", "Notes");
        option2.setAttribute("value", "BOOKS");
        option3.setAttribute("value", "PPT");
        option4.setAttribute("value", "YTPlaylist");
        option5.setAttribute("value", "Others");
        option1.innerHTML=`Notes`;
        option2.innerHTML=`Books`;
        option3.innerHTML=`PPTs`;
        option4.innerHTML=`Youtube Playlist/Video`;
        option5.innerHTML=`Other URL`;
        typeSelect.appendChild(option1);
        typeSelect.appendChild(option2);
        typeSelect.appendChild(option3);
        typeSelect.appendChild(option4);
        typeSelect.appendChild(option5);
        setFileInfoOptions();
    }
}


function setFileInfoOptions(){
    fileInputDiv.classList.remove('hidden');
    if(typeSelect.value=='YTPlaylist' || typeSelect.value=='Others'){
        setForYTURL();
    }
    else{
        setForFile();
    }
    setUploadInfo();
}

function submitUploadForm() {
    const form = fileUploadForm;
    const formData = new FormData(form);

    const progressBar = document.querySelector('.progress');
    progressBar.style.display = 'block';
    document.getElementById('uploadFileModal').click();

    const progressBarValue = progressBar.querySelector('.progress-bar');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.getAttribute('action'));

    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBarValue.style.width = percentComplete + '%';
            progressBarValue.setAttribute('aria-valuenow', percentComplete);
            progressBarValue.innerHTML=`${Math.round(percentComplete) + '%'}`
        }
    };

    xhr.onload = function() {
        progressBar.style.display = 'none';
        if (xhr.status === 200) {
            document.getElementById('ShowalertManagementModal').click();
                document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-success d-flex align-items-center"
            role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
                Resource Uploaded Successfully !!!
            </div>
        </div>`;
                setTimeout(function () {
                    document.getElementById('closeAlertButton').click();
                }, 4000);
        } else {
            document.getElementById('ShowalertManagementModal').click();
                document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                Upload Failed: ${xhr.statusText}
                </div>
            </div>`;
                setTimeout(function () {
                    document.getElementById('closeAlertButton').click();
                }, 4000);
            console.error('Upload failed:', xhr.statusText);
        }
    };

    xhr.onerror = function() {
        document.getElementById('ShowalertManagementModal').click();
            document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                Upload Failed: Network error occurred
                </div>
            </div>`;
            setTimeout(function () {
                document.getElementById('closeAlertButton').click();
            }, 4000);
        console.error('Network error occurred');
    };

    xhr.send(formData);
}
