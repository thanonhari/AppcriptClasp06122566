/**
 * ตั้งค่า
 */
const CONFIG = {
  APP_NAME: "NO&LOW CODE", //ตั้งชื่อ app
  FILES_FOLDER_NAME: "Images", //ตั้งชื่อ folder
  SHEET_NAME: "Responses",//ตั้งชื่อ sheet
  PAGE: "Frontend/index",
  FILELH5: "https://lh5.googleusercontent.com/d/",
}

/**
 * ฟังก์ชั่นเชื่อมไฟล์เข้าด้วยกัน
 */
function required(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/**
 * Handle get request
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile(CONFIG.PAGE)
    .evaluate()
    .setTitle(CONFIG.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
}







