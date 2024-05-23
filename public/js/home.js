// Showing / hiding faculty contact details
const schedulesList = document.getElementById("schedulesList");
const teachers = document.getElementById("teachers");
function show_contact(element_id1, element_id2) {
    if (document.getElementById(element_id1).style.display == "block") {
        document.getElementById(element_id1).style.display = "none";
        document.getElementById(element_id2).style.display = "none";
    }
    else {
        document.getElementById(element_id1).style.display = "block";
        document.getElementById(element_id2).style.display = "block";
    }
}

function fetchFacultyAndRender() {
    fetch('/get-faculty-list')
        .then(response => response.json())
        .then(data => {
            // Update the DOM with the fetched data
            teachers.innerHTML = ``;
            for(var i=0;i<data.length;i++){
                const facultyDiv = document.createElement("div");
                facultyDiv.className = "col-lg-3 col-md-6 wow fadeInUp";
                facultyDiv.setAttribute("data-wow-delay", "0.1s");
                facultyDiv.innerHTML = `<div class="team-item bg-light">
                <div class="overflow-hidden">
                    <a target="_blank" href= '${data[i].properties.facultyProfile}'><img class="img-fluid-faculty" src='${data[i].thumbnailLink}' alt="No Image Found!"></a>
                </div>
                <div class="position-relative d-flex justify-content-center" style="margin-top: -23px;">
                    <div class="bg-light d-flex justify-content-center pt-2 px-1">
                        <span class="btn btn-faculty-wide btn-primary mx-1" onclick="show_contact('${'mail_faculty_' + (i + 1).toString()}','${'phone_faculty_' + (i + 1).toString()}')"></a><i class="fa fa-envelope ">&nbsp; Contact</i></span>
                    </div>
                </div>
                <i class="fa fa-envelope text-center team-contact" id='${'mail_faculty_' + (i + 1).toString()}'>&nbsp;<small>${data[i].name}</small></i>
                <i class="fa fa-phone text-center team-contact"  id='${'phone_faculty_' + (i + 1).toString()}'>&nbsp;<small>${data[i].properties.facultyContact}</small></i>
                <div class="text-center p-4">
                    <h5 class="mb-0">${data[i].properties.facultyName}</h5>
                    <small>${data[i].properties.facultyRole}</small>
                </div>
            </div>`;
                teachers.appendChild(facultyDiv);
                teachers.appendChild(document.createElement("br"));
            };
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchScheduleAndRender() {
    fetch('/get-schedule-list')
        .then(response => response.json())
        .then(data => {
            // Destroy the existing carousel
            if ($('.testimonial-carousel').data('owl.carousel')) {
                $('.testimonial-carousel').owlCarousel('destroy');
            }

            // Clear the current items
            const schedulesList = document.getElementById('schedulesList');
            schedulesList.innerHTML = ``;

            // Add the new items
            data.forEach(file => {
                const schedule = document.createElement("div");
                schedule.classList.add('testimonial-item', 'text-center', 'zoom_in_cursor');
                schedule.innerHTML = `
                    <img class="border p-2 mx-auto mb-3" src='${file.thumbnailLink}' onclick="model_img('${file.thumbnailLink}')" alt="schedule image">
                    <h5 class="mb-0">${file.name}</h5>`;
                schedulesList.appendChild(schedule);
            });

            // Reinitialize the carousel
            $('.testimonial-carousel').owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                center: true,
                margin: 24,
                dots: true,
                loop: true,
                nav: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    992: {
                        items: 3
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Showing Model Image
var model = document.getElementById("myModel")
var modelImg = document.getElementById("img01");
function model_img(src) {
    model.style.display = "block";
    modelImg.src = src;
}
// Get the <span> element that closes the model
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the model
span.onclick = function () {
    model.style.display = "none";
}
model.onclick = function () {
    model.style.display = "none";
}

fetchScheduleAndRender();
fetchFacultyAndRender();