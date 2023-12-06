/*** สร้างไฟล์ใน google drive */
function createFile(data, name){
  const id = SpreadsheetApp.getActive().getId()
  const currentFolder = DriveApp.getFileById(id).getParents().next()
  const folders = currentFolder.getFoldersByName(CONFIG.FILES_FOLDER_NAME)
  
  let folder = null
  if (folders.hasNext()) {
    folder = folders.next()
  }else{
    folder = currentFolder.createFolder(CONFIG.FILES_FOLDER_NAME)
    // folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW) //แชร์ทั้งโฟลเดอร์
  }
  const [fileType, fileData] = data.slice(5).split(";base64,")
  const decodedFileData = Utilities.base64Decode(fileData)
  const blob = Utilities.newBlob(decodedFileData, fileType).setName(name)
  const file = folder.createFile(blob) //โฟลเดอร์และไฟล์จะถูกสร้างขึ้นในตำแหน่งของ ซีต โดยชื่อโฟลเดอร์ที่กำหนดที่ CONFIG
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW) //การแชร์เฉพาะไฟล์
  return file
}

// Handle post request
function doPost(e) {
  const postData = e.parameter;
  const uuid = Utilities.getUuid();

  let image = null;
  if (postData.data) {
    // If there is file data, create and upload the file
    image = createFile(postData.data, postData.fileName);
  }

  const ws = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);

  const data = {
    Id: uuid,
    college: postData.college,
    department: postData.department,
    teacher: postData.teacher,
    fileName: postData.fileName,
    fileUrl: image ? image.getUrl() : null,
    filelh5: image ? FILELH5 + image.getId() : null,
  };

  const headers = Object.keys(data);

  // Check if headers exist in the sheet, if not, add them and get the new column indexes
  const sheetHeaders = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];
  const newColumnIndexes = [];
  headers.forEach((header) => {
    let columnIndex = sheetHeaders.indexOf(header);
    if (columnIndex === -1) {
      ws.insertColumnBefore(1);
      ws.getRange(1, 1).setValue(header);
      columnIndex = 1;
    }
    newColumnIndexes.push(columnIndex);
  });

  // Append data to the sheet according to the new column indexes
  const row = newColumnIndexes.map((columnIndex) => data[headers[columnIndex]]);
  ws.appendRow(row);

  const response = {
    success: true,
    message: `Thanks for your submission!`,
    uuid: uuid,
    imageUrl: image ? FILELH5 + image.getId() : null,
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}



