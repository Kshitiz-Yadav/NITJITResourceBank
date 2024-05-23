semesterList = document.getElementById("semester-list");
if (semesterList.children.length === 0) {
    fetch('/get-academics-sem-list', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const element = document.createElement("div");
                element.classList.add("col-lg-3");
                element.classList.add("col-sm-6");
                element.classList.add("fadeInUp");
                element.classList.add("wow");
                element.setAttribute("data-wow-delay","0.3s")
                element.innerHTML = `<div class="service-item text-center pt-3 click_cursor" onclick="redirectToSemester('${item.name}')">
                <div class="p-4">
                    <h5 class="mb-3">${item.name}</h5>
                </div>
            </div>`;
            semesterList.appendChild(element);
            });
        })
        .catch(error => console.error('Error fetching academics menu:', error));
}
