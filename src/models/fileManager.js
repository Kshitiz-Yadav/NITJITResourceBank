const { google } = require("googleapis");
const XLSX = require('xlsx');
const fetch = require('node-fetch'); // Import fetch for making HTTP requests
require('dotenv').config();
const { Readable } = require('stream');
const key = require("../../private_key.json");

class FileManager {
  constructor() {
    this.jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/drive'],
      null
    );
    this.expiryTime = null;
    this.authorized = false;
    this.PARENT = process.env.PARENT;
    this.FACULTYID = process.env.FACULTY;
  }

  getPARENT() {
    return this.PARENT;
  }
  static getInstance() {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  async authorize() {
    try {
      if (!this.authorized || Date.now() >= this.expiryTime) {
        await this.jwtClient.authorize();
        this.expiryTime = Date.now() + 3600 * 1000; // Set expiry time to 1 hour from now
        this.authorized = true;
      }
    } catch (err) {
      throw err;
    }
  }

  async loadChild(parentID) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const response = await service.files.list({
        auth: this.jwtClient,
        pageSize: 900,
        q: `'${parentID}' in parents`,
        fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)'
      });
      return response.data.files;
    } catch (err) {
      throw err;
    }
  }

  async downloadFile(fileId) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const response = await service.files.get(
        { fileId: fileId, alt: 'media', auth: this.jwtClient },
        { responseType: 'arraybuffer' });
      const workbook = XLSX.read(response.data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } catch (err) {
      throw err;
    }
  }

  async getSemData(semNum) {
    try {
      const files = await this.loadChild(this.PARENT);
      const semFolder = files.find(file => file.name === semNum && file.mimeType === 'application/vnd.google-apps.folder');
      if (!semFolder) {
        throw new Error(`Semester folder '${semNum}' not found.`);
      }
      const semFolderID = semFolder.id;
      const semFiles = await this.loadChild(semFolder.id);
      const pyqFolder = semFiles.find(file => file.name === 'Previous Year Exams' && file.mimeType === 'application/vnd.google-apps.folder');
      if (!pyqFolder) {
        throw new Error(`'Previous Year Exams' folder not found in '${semNum}' folder.`);
      }
      const pyqFilesList = await this.loadChild(pyqFolder.id);
      return { semFiles, pyqFilesList, semFolderID };
    } catch (err) {
      throw err;
    }
  }

  async getSubData(semID, subName) {
    try {
      const semfiles = await this.loadChild(semID);
      const subFolder = semfiles.find(file => file.name.substring(0, 8) == (subName).substring(0, 8) && file.mimeType === 'application/vnd.google-apps.folder');
      if (!subFolder) {
        throw new Error(`Subfolder '${subName}' not found in the semester folder.`);
      }
      const innerFiles = await this.loadChild(subFolder.id);
      const youtubePlaylist = semfiles.find(file => file.name === 'Youtube Playlist' && file.mimeType === 'application/vnd.google-apps.folder');
      if (!youtubePlaylist) {
        throw new Error(`'Youtube Playlist' folder not found for '${subName}' folder.`);
      }
      const excelFl = await this.loadChild(youtubePlaylist.id);
      const excelF = await this.downloadFile(excelFl[0].id);
      for (let i = 1; i < excelF.length; i++) {
        excelF[i][1] = await this.convertYoutubeUrlToEmbed(excelF[i][1]);
      }
      const bookFolder = innerFiles.find(file => file.name === 'BOOKS' && file.mimeType === 'application/vnd.google-apps.folder');
      const notesFolder = innerFiles.find(file => file.name === 'Notes' && file.mimeType === 'application/vnd.google-apps.folder');
      const otherFolder = innerFiles.find(file => file.name === 'Others' && file.mimeType === 'application/vnd.google-apps.folder');
      const pptFolder = innerFiles.find(file => file.name === 'PPT' && file.mimeType === 'application/vnd.google-apps.folder');
      const bookF = bookFolder ? await this.loadChild(bookFolder.id) : [];
      const notesF = notesFolder ? await this.loadChild(notesFolder.id) : [];
      const otherF = otherFolder ? await this.loadChild(otherFolder.id) : [];
      const pptF = pptFolder ? await this.loadChild(pptFolder.id) : [];
      return { bookF, notesF, pptF, otherF, excelF };
    } catch (err) {
      throw err;
    }
  }

  async getFacultyData() {
    try {
      const facultyFiles = await this.loadChild(this.FACULTYID);
      const facultyExcelFile = facultyFiles.find(file => file.name === 'faculty_list.xlsx');
      if (!facultyExcelFile) {
        throw new Error(`'faculty_list.xlsx' file not found in faculty folder.`);
      }
      const facultyExcelData = await this.downloadFile(facultyExcelFile.id);
      return { facultyFiles, facultyExcelData };
    } catch (err) {
      throw err;
    }
  }

  async convertYoutubeUrlToEmbed(url) {
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

  async listFolders(rootId = this.PARENT, level = 0) {
    try {
      if (level > 1) return [];
      await this.authorize();
      const service = google.drive("v3");
      const response = await service.files.list({
        auth: this.jwtClient,
        pageSize: 50,
        q: `'${rootId}' in parents`,
        fields: 'files(id, name, mimeType)'
      });
      const files = response.data.files;
      const folders = [];
      for (const file of files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          const folder = {
            id: file.id,
            name: file.name,
            children: await this.listFolders(file.id, level + 1)
          };
          folders.push(folder);
        }
      }
      return folders;
    } catch (err) {
      throw err;
    }
  }

  async renameFile(fileId, newName) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const response = await service.files.update({
        auth: this.jwtClient,
        fileId: fileId,
        requestBody: {
          name: newName
        }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      await service.files.delete({
        auth: this.jwtClient,
        fileId: fileId
      });
      return "File deleted successfully";
    } catch (err) {
      throw err;
    }
  }

  async createFolder(parentId, folderName) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId]
      };
      const response = await service.files.create({
        auth: this.jwtClient,
        resource: fileMetadata,
        fields: 'id'
      });
      return response.data.id;
    } catch (err) {
      throw err;
    }
  }

  async addSubject(parentId, subjectName) {
    try {
      const subID = await this.createFolder(parentId, subjectName);
      this.createFolder(subID, "BOOKS");
      this.createFolder(subID, "Notes");
      this.createFolder(subID, "PPT");
      this.createFolder(subID, "Others");
      this.createFolder(subID, "YTPlaylist");
    }
    catch (err) {
      throw err;
    }
  }

  async getIDByName(parentID, fileName) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const response = await service.files.list({
        auth: this.jwtClient,
        pageSize: 900,
        q: `'${parentID}' in parents and name = '${fileName}'`,
        fields: 'files(id, name)'
      });
      return response.data.files[0].id;
    } catch (err) {
      throw err;
    }
  }

  async createFile(parentID, body, file) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const fileMetadata = {
        name: body.fileName,
        parents: [parentID],
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        description: body.fileDesc,
        properties: {
          fileAuthor : body.fileAuthor,
          fileTopics : body.fileTopics,
        }
      };
      const media = {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer)
      };
      const res = await service.files.create({
        auth: this.jwtClient,
        resource: fileMetadata,
        media: media,
        fields: 'id',
        uploadType: 'resumable',
      });
      return res.data.id;
    } catch (err) {
      throw(err);
    }
  }

  async createEmptyFile(parentID, body) {
    try {
      await this.authorize();
      const service = google.drive("v3");
      const fileMetadata = {
        name: body.fileName,
        parents: [parentID],
        description: body.fileDesc,
        properties: {
          URL: body.fileInput,
          fileAuthor : body.fileAuthor,
          fileTopics : body.fileTopics,
        }
      };
      const res = await service.files.create({
        auth: this.jwtClient,
        resource: fileMetadata,
        fields: 'id',
        uploadType: 'resumable',
      });
      return res.data.id;
    } catch (err) {
      throw(err);
    }
  }

  async uploadToDrive(body, file) {
    try {
      if (body.typeSelect == 'BOOKS' || body.typeSelect == 'Notes' || body.typeSelect == 'PPT') {
        const directoryId = await this.getIDByName(body.subjectSelect, body.typeSelect);
        return await this.createFile(directoryId, body, file);
      } else if(body.typeSelect == 'PYQs'){
        return await this.createFile(body.subjectSelect, body, file);
      }
      else{
        const directoryId = await this.getIDByName(body.subjectSelect, body.typeSelect);
        return await this.createEmptyFile(directoryId, body);
      }
    } catch (err) {
      console.error('Error uploading file to Google Drive:', err);
    }
  }

  async getListFilesMetadata(body){
    try {
      await this.authorize();
      const service = google.drive("v3");
      let parentID = "";
      if(body.type == 'PYQs'){
        parentID = body.subject;
      } else{
        parentID = await this.getIDByName(body.subject, body.type);
      }
      const response = await service.files.list({
        auth: this.jwtClient,
        pageSize: 900,
        q: `'${parentID}' in parents`,
        fields: 'files(id, name, properties)'
      });
      return response.data.files;
    } catch (err) {
      throw err;
    }
  }

}

module.exports = FileManager;