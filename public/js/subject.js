// Define the arrays for each semester
var semester3 = {
    name: "Semester 3",
    subjects: ["ITPC-201: Object Oriented Programming Concepts", "ITPC-203: Data Structures", "ITPC-205: Data Communication and Networking", "ITPC-207: Fundamentals of Database Management Systems", "ITPC-209 Computer System Architecture", "MACI-203: Numerical Methods"],
    labs: ["ITPC-221: Object Oriented Programming Concepts Lab", "ITPC-223: Data Structures Lab ", "ITPC-225: Data Communication and Networking Lab", "ITPC-227: Fundamentals of Database Management Systems Lab"]
  };

var semester4 = {
	name: "Semester 4",
	subjects: ["ITPC-202: Introduction to Design and Analysis of Algorithms","ITPC-204: Operating System Concepts","ITPC-206: Java Programming","ITPC-208: Data Mining and Data Warehousing Concepts","ITPC-210: Formal Language and Automata Theory","HMCI-201: Economics for Engineers"],
	labs: ["ITPC-222: Introduction to Design and Analysis of Algorithms Lab","ITPC-224: Operating System Concepts Lab","ITPC-226: Java Programming Lab","ITPC-228: Data Mining and Data Warehousing Concepts Lab"]
};

var semester5 = {
	name: "Semester 5",
	subjects: ["ITPC-301: Cryptography and Network Security","ITPC-303: Software Engineering Concepts","ITPC-305: Web Design Technologies","ITPC-307: Computer Graphics and Applications","ITPC-309: Discrete Mathematics"],
	labs: ["ITPC-321: Cryptography and Network Security Lab","ITPC-323: Software Engineering Concepts Lab","ITPC-325: Web Design Technologies Lab"," ITPC-327: Computer Graphics and Applications Lab"]
};

var semester6 = {
	name: "Semester 6",
	subjects: ["ITPC-302: Soft Computing Concepts","ITPC-304: Object-Oriented Modeling and Design with UML","ITPC-306: Mobile Application Development","ITPC-308: Machine Learning Concepts"],
	labs: ["ITPC-322: Soft Computing Concepts Lab","ITPC-324: Object-Oriented Modeling and Design with UML Lab","ITPC-326: Mobile Application Development Lab"]
};

var semester7 = {
	name: "Semester 7",
	subjects: ["ITPC-401: Software Testing","ITPC-403: Cloud Computing"],
	labs: ["ITPC-421: Software Testing Lab","ITPC-423: Cloud Computing Lab"]
};

var semester8 = {
	name: "Semester 8",
	subjects: ["ITPC-402: Introduction to System Programming","ITPC-404: E- Commerce","ITPC-406: Decision Support Systems Methodology"],
	labs: ["ITPC-422: Introduction to System Programming Lab",]
};

var open_elec = {
	name: "Open Electives",
	subjects: ["ITOE-001: Fundamentals of Software Engineering","ITOE-002: Web Design Concepts","ITOE-003: Fundamentals of Data Analytics","ITOE-004: Agile Software Engineering","ITOE-005: Mobile Application Development Concepts","ITOE-006: Fundamentals of Cloud Computing"],
	labs: []
};


var dept_elec = {
	name: "Departmental Electives ",
	subjects: ["ITPE-051: Advanced Concepts in Operating System","ITPE-052: Wireless Data Networks","ITPE-053: Information Security System","ITPE-054: Mobile Computing","ITPE-055: Software Project Management Concepts","ITPE-056: Agile Software Development","ITPE-057: Principles of Compiler Design","ITPE-058: Principles of Programming Languages","ITPE-059: Data Analytics","ITPE-060: Digital Image Processing","ITPE-061: Multicore Programming","ITPE-062: Cyber Forensic","ITPE-063: Artificial Intelligence Concepts","ITPE-064: Internet of Things (IoT) Concepts"],
	labs: []
};

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const subject_name = urlParams.get('subject');
const subject_name = document.getElementById("subName").value
const bookF = JSON.parse(document.getElementById("bookFiles").value)
const notesF = JSON.parse(document.getElementById("notesFiles").value)
const pptF = JSON.parse(document.getElementById("pptFiles").value)
const otherF = JSON.parse(document.getElementById("otherFiles").value)
const excelF = JSON.parse(document.getElementById("excelFiles").value)
document.getElementById("subject_name").innerHTML= `${subject_name}`;

function dynamicCreate(parent_id, Files) {
	for (var i = 0; i < Files.length; i++) {
        let name = Files[i].name;
		let thumbnail = Files[i].thumbnailLink;
		let webview = Files[i].webViewLink;
		let download = Files[i].webContentLink;
        var fileDiv = document.createElement("div");
        fileDiv.className = "col-lg-2_5 col-md-6 wow fadeInUp";
		fileDiv.setAttribute("data-wow-delay", "0.1s");
        fileDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><a target="_blank" href=${webview}><img class="img-fluid click_cursor" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail" ></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-up "></i></a><a class="btn btn-sm-square btn-primary mx-1"><i class="fa fa-thumbs-down "></i></a><a class="btn btn-sm-square btn-primary mx-1" href=${download}><i class="fa fa-download "></i></a></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
        document.getElementById(parent_id).appendChild(fileDiv);
		document.getElementById(parent_id).appendChild(document.createElement("br"));
    }
}

dynamicCreate("notes", notesF);
dynamicCreate("ppts", pptF);
dynamicCreate("books", bookF);
dynamicCreate("others", otherF);