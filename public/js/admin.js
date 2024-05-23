const allUsers = JSON.parse(document.getElementById("allUsersList").value);
const privilegedUsers = JSON.parse(document.getElementById("privilegedUsersList").value);
const allUsersTableBody = document.getElementById("allUsersTableBody");
const privilegedUsersTableBody = document.getElementById("privilegedUsersTableBody");
const directoryLevel1TableBody = document.getElementById("directoryTreeLevel1");
const directoryLevel2TableBody = document.getElementById("directoryTreeLevel2");
const directoryLevel3TableBody = document.getElementById("directoryTreeLevel3");
const searchInputPrivilegedUsers = document.getElementById("searchInputPrivilegedUsers");
const searchInputAllUsers = document.getElementById("searchInputAllUsers");
const addSubjectsToSemester = document.getElementById("addSubjectsToSemester");
const SubjectsTableHeading = document.getElementById("SubjectsTableHeading");
const fileUploadForm = document.getElementById("fileUploadForm");
const facultyUploadForm = document.getElementById("facultyUploadForm");
const scheduleListForDelete = document.getElementById("scheduleListForDelete");
const facultyListForDelete = document.getElementById("facultyListForDelete");

// Event listener for rename button and add Subject button to open modal
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('rename-semsub-btn')) {
        if (event.target.getAttribute("data-semsub-type") == 'sub') {
            document.getElementById('newName').setAttribute('placeholder', 'HMCI-201: Economics for Engineers');
            document.getElementById('subDiv').setAttribute('style', 'display: block;');
        } else {
            document.getElementById('newName').setAttribute('placeholder', '');
            document.getElementById('subType').querySelector('option[value="Theory"]').selected = true;
            document.getElementById('subDiv').setAttribute('style', 'display: none;');
        }
        document.getElementById('directoryToBeModified').value = event.target.getAttribute('data-semsub-id');
        document.getElementById('newName').value = "";
        document.getElementById('schemaManagementFormMethod').value = "PUT";
        document.getElementById('schemaManagementForm').setAttribute('action', "/admin/rename-directory?_method=PUT");
        document.getElementById('schemaManagementForm').setAttribute('onsubmit', "return confirm('Are you sure you want to rename this directory?');");
    }

    else if (event.target.classList.contains('add-subject-btn')) {
        if (event.target.getAttribute("data-semsub-type") == 'sub') {
            document.getElementById('newName').setAttribute('placeholder', 'HMCI-201: Economics for Engineers');
            document.getElementById('subDiv').setAttribute('style', 'display: block;');
        } else {
            document.getElementById('newName').setAttribute('placeholder', '');
            document.getElementById('subType').querySelector('option[value="Theory"]').selected = true;
            document.getElementById('subDiv').setAttribute('style', 'display: none;');
        }
        document.getElementById('directoryToBeModified').value = event.target.getAttribute('data-semsub-id');
        document.getElementById('newName').value = "";
        document.getElementById('schemaManagementFormMethod').value = "POST";
        document.getElementById('schemaManagementForm').setAttribute('action', `/admin/add-subjects?_method=POST`);
        document.getElementById('schemaManagementForm').setAttribute('onsubmit', "return confirm('Are you sure you want to add this subject into the semester?');");
    }
    else if (event.target.classList.contains('delete-directory-btn') || event.target.classList.contains('delete-schedule-btn') || event.target.classList.contains('delete-faculty-btn')) {
        const directoryId = event.target.getAttribute('data-directory-id');
        const form = document.getElementById('deleteDirectoryForm');
        document.getElementById('directoryToBeDeleted').value = directoryId;
        const data = new FormData(form);
        bodyData = {
            _method: data.get('_method'),
            directoryToBeDeleted: data.get('directoryToBeDeleted')
        };
        fetch(form.getAttribute('action'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        })
            .then(response => {
                if (response.ok) {
                    document.getElementById('ShowalertManagementModal').click();
                    document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-success d-flex align-items-center"
            role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
                Academic Schema Updated Successfully !!!
            </div>
        </div>`;
                    setTimeout(function () {
                        document.getElementById('closeAlertButton').click();
                    }, 4000);
                    if(event.target.classList.contains('delete-directory-btn')){
                    resetSchemaView();
                    fetchShemaAndRender();}
                    else if(event.target.classList.contains('delete-schedule-btn')){
                        resetTimetableOrFacultyView(scheduleListForDelete);
                        fetchTimetableAndRender();
                    }
                    else{
                        resetTimetableOrFacultyView(facultyListForDelete);
                        fetchFacultyAndRender();
                    }
                } else {
                    document.getElementById('ShowalertManagementModal').click();
                    document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                Failed to Delete, Please retry..
                </div>
            </div>`;
                    setTimeout(function () {
                        document.getElementById('closeAlertButton').click();
                    }, 4000);
                    throw new Error('Failed to Delete, Please retry..');
                }
            })
            .catch(error => {
                document.getElementById('ShowalertManagementModal').click();
                document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                ${error}
                </div>
            </div>`;
                setTimeout(function () {
                    document.getElementById('closeAlertButton').click();
                }, 4000);
                console.error('Error:', error);
            });
    }
});

function submitUploadForm() {
    const form = fileUploadForm;
    const formData = new FormData(form);

    document.getElementById('uploadFileModal').click();
    submitForm(form, formData, "schedule");
}

function submitForm(form, formData, type) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.getAttribute('action'));

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById('ShowalertManagementModal').click();
            document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-success d-flex align-items-center"
            role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
                File Uploaded Successfully !!!
            </div>
        </div>`;
            setTimeout(function () {
                document.getElementById('closeAlertButton').click();
            }, 4000);
            if(type=="schedule"){
                resetTimetableOrFacultyView(scheduleListForDelete);
                fetchTimetableAndRender();
            }
            if(type=="faculty"){
                resetTimetableOrFacultyView(facultyListForDelete);
                fetchFacultyAndRender();
            }
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

    xhr.onerror = function () {
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

function submitFacultyUploadForm() {
    const form = facultyUploadForm;
    const formData = new FormData(form);

    document.getElementById('uploadFacultyModal').click();
    submitForm(form, formData, "faculty");
};

// Form submission for renaming directory or create new directory
document.getElementById('schemaManagementForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(this);
    let nameToBeSent = data.get('newName');
    if (data.get('subType') == 'Lab') {
        if (nameToBeSent.slice(-3).toLowerCase() != "lab") {
            nameToBeSent = nameToBeSent + " Lab";
        }
    }
    bodyData = {
        _method: data.get('_method'),
        directoryToBeModified: data.get('directoryToBeModified'),
        newName: nameToBeSent
    };
    fetch(this.getAttribute('action'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('ShowalertManagementModal').click();
                document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-success d-flex align-items-center"
            role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
                Academic Schema Updated Successfully !!!
            </div>
        </div>`;
                setTimeout(function () {
                    document.getElementById('closeAlertButton').click();
                }, 4000);
                resetSchemaView();
                fetchShemaAndRender();
            } else {
                console.log(response)
                document.getElementById('ShowalertManagementModal').click();
                document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                Failed to update the academic schema, Please retry..
                </div>
            </div>`;
                setTimeout(function () {
                    document.getElementById('closeAlertButton').click();
                }, 4000);
                throw new Error('Failed to update the academic schema, Please retry..');
            }
        })
        .catch(error => {
            document.getElementById('ShowalertManagementModal').click();
            document.getElementById("alertModalBody").innerHTML = `<div class="alert alert-warning d-flex align-items-center"
                role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>
                ${error}
                </div>
            </div>`;
            setTimeout(function () {
                document.getElementById('closeAlertButton').click();
            }, 4000);
            console.error('Error:', error);
        })
        .finally(() => {
            // Close the modal regardless of success or failure
            document.getElementById('schemaManagementModalClose').click();
        });
});


function fetchShemaAndRender() {
    fetch('/admin/academic_schema')
        .then(response => response.json())
        .then(data => {
            // Update the DOM with the fetched data
            renderschemaLevel1(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function resetSchemaView() {
    directoryLevel1TableBody.innerHTML = `<tr>
    <td>
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </td>
    <td>
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </td>
    <td>
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </td>
</tr>`;
    SubjectsTableHeading.innerHTML = `Manage Subjects`;
    directoryLevel2TableBody.innerHTML = ``;
    addSubjectsToSemester.innerHTML = ``;
}

function resetTimetableOrFacultyView(element) {
    element.innerHTML = `<tr>
    <td>
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </td>
    <td>
        <div class="d-flex justify-content-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </td>
</tr>`;
}

function fetchTimetableAndRender() {
    fetch('/admin/fetch-schedule')
        .then(response => response.json())
        .then(data => {
            // Update the DOM with the fetched data
            scheduleListForDelete.innerHTML = "";
            data.forEach(file => {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${file.name}</td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-danger delete-schedule-btn" data-directory-id="${file.id}">Delete</button>
            </td>`;
            scheduleListForDelete.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchFacultyAndRender() {
    fetch('/admin/fetch-faculty')
        .then(response => response.json())
        .then(data => {
            // Update the DOM with the fetched data
            facultyListForDelete.innerHTML = "";
            data.forEach(file => {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${file.name}</td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-danger delete-faculty-btn" data-directory-id="${file.id}">Delete</button>
            </td>`;
            facultyListForDelete.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function renderschemaLevel1(academic_schema) {
    directoryLevel1TableBody.innerHTML = "";
    academic_schema.forEach(directory => {
        const row = document.createElement("tr");
        row.style.cursor = "pointer";
        row.addEventListener("click", function () {
            renderschemaLevel2(directory.name, directory.id, directory.children);
        });
        row.innerHTML = `
            <td>${directory.name}</td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-primary rename-semsub-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sem" data-semsub-id="${directory.id}">Rename</button>
            </td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-danger delete-directory-btn" data-directory-id="${directory.id}">Delete</button>
            </td>`;
        directoryLevel1TableBody.appendChild(row);
    });
}

function renderschemaLevel2(semesterName, semesterID, subjects) {
    directoryLevel2TableBody.innerHTML = "";
    SubjectsTableHeading.innerHTML = `Manage Subjects from ${semesterName}`;
    addSubjectsToSemester.innerHTML = `
        <button type="button" class="btn btn-warning add-subject-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sub" data-semsub-id="${semesterID}">Add Subjects</button>
    `;
    subjects.forEach(subject => {
        if (subject.name != 'Previous Year Exams') {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${subject.name}</td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-primary rename-semsub-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sub" data-semsub-id="${subject.id}">Rename</button>
            </td>
            <td style="text-align: center;">
            <button type="button" class="btn btn-danger delete-directory-btn" data-directory-id="${subject.id}">Delete</button>
            </td>`;
            directoryLevel2TableBody.appendChild(row);
        }
    });
}

function renderPrivilegedUsers(users) {
    privilegedUsersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/remove-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to remove privileged access from this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToRemoveAccess" value="${user._id}">
                        <button type="submit" class="btn btn-primary">Revoke Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        privilegedUsersTableBody.appendChild(row);
    });
}

function renderAllUsers(users) {
    allUsersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/provide-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to provide privileged access to this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToProvideAccess" value="${user._id}">
                    <button type="submit" class="btn btn-primary">Provide Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        allUsersTableBody.appendChild(row);
    });
}

searchInputPrivilegedUsers.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const filteredUsers = privilegedUsers.filter(user => user.username.toLowerCase().includes(searchText));
    renderPrivilegedUsers(filteredUsers);
});

searchInputAllUsers.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => user.username.toLowerCase().includes(searchText));
    renderAllUsers(filteredUsers);
});

// Initial rendering of the users
renderAllUsers(allUsers);
renderPrivilegedUsers(privilegedUsers);
fetchShemaAndRender();
fetchTimetableAndRender();
fetchFacultyAndRender();
