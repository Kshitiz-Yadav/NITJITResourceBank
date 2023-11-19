const XLSX = require('xlsx');
const { google } = require("googleapis");
const key = require("../../private_key.json");
require('dotenv').config();

const PARENT = process.env.PARENT;
const FACULTYID = process.env.FACULTY;


// Loading the root google drive directory
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive'],
  null
);

async function loadChild(par, jwtClient) {
  try {
    await jwtClient.authorize();
    var service = google.drive("v3");
    var response = await service.files.list({
      auth: jwtClient,
      pageSize: 900,
      q: `'${par}' in parents`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)'
    });
    var files = response.data.files;
    return files;
  } catch (err) {
    throw err;
  }
}

async function downloadFile(fileId) {
  try {
    await jwtClient.authorize();
    var service = google.drive("v3");
    var response = await service.files.get(
      { fileId: fileId, alt: 'media', auth: jwtClient },
      { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const array = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return array;
  } catch (err) {
    console.log(err);
  }
}

async function convertYoutubeUrlToEmbed(url) {
  try {
    let apiUrl = "https://www.youtube.com/oembed?url=" + url + "&format=json"; // construct the API URL
    let code = await fetch(apiUrl) // make a request to the API
      .then(response => response.json()) // parse the response as JSON
      .then(data => {
        return data.html; // return the embed code
      })
    return code;
  } catch (err) {
    console.error(err); // handle errors
  };
}

async function getSemData(semNum) {
  var child;
  let files = await loadChild(PARENT, jwtClient);
  for (let i = 0; i < files.length; i++) {
    if (files[i].name == semNum) {
      child = files[i].id
      break
    }
  }

  let semFiles = await loadChild(child, jwtClient);
  let pyqID = ""
  for (let i = 0; i < semFiles.length; i++) {
    if (semFiles[i].name == "Previous Year Exams") {
      pyqID = semFiles[i].id
      break
    }
  }

  let pyqFiles = await loadChild(pyqID, jwtClient);
  return { semFiles, pyqFiles, child }
}

async function getSubData(semNum, subName) {
  let semfiles = await loadChild(semNum, jwtClient);
  let excelID = "";
  let child = "";
  for (let i = 0; i < semfiles.length; i++) {
    if ((semfiles[i].name).substring(0, 8) == (subName).substring(0, 8)) {
      child = semfiles[i].id
    }
    if ((semfiles[i].name) == "Youtube Playlist") {
      excelID = semfiles[i].id
    }
  }

  let innerFiles = await loadChild(child, jwtClient);
  let excelFl = await loadChild(excelID, jwtClient);
  let excelF = await downloadFile(excelFl[0].id);
  let bookID = "", otherID = "", pptID = "", notesID = "";
  for (let i = 0; i < innerFiles.length; i++) {
    switch (innerFiles[i].name) {
      case "BOOKS":
        bookID = innerFiles[i].id;
        break;
      case "PPT":
        pptID = innerFiles[i].id;
        break;
      case "Others":
        otherID = innerFiles[i].id;
        break;
      case "Notes":
        notesID = innerFiles[i].id;
        break;
      default:
    }
  }

  for (let i = 1; i < excelF.length; i++) {
    excelF[i][1] = await convertYoutubeUrlToEmbed(excelF[i][1]);
  }

  let bookF, notesF, otherF, pptF;
  bookF = await loadChild(bookID, jwtClient);
  notesF = await loadChild(notesID, jwtClient);
  otherF = await loadChild(otherID, jwtClient);
  pptF = await loadChild(pptID, jwtClient);

  return { bookF, notesF, pptF, otherF, excelF }
}

async function getFacultyData(){
  let facultyF = await loadChild(FACULTYID, jwtClient);
  let facultyExcelID = ""
  for(let i=0;i<facultyF.length;i++){
      if(facultyF[i].name == "faculty_list.xlsx"){
          facultyExcelID = facultyF[i].id
          break
      }
  }
  let faculty_xl = await downloadFile(facultyExcelID);
  return {facultyF, faculty_xl}
}

module.exports = {loadChild, downloadFile, convertYoutubeUrlToEmbed, getSemData, getSubData, getFacultyData}