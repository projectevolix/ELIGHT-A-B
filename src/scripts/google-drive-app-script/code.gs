/**
 * Deploy this as a Web App:
 * - In Apps Script editor: Publish → Deploy as web app
 * - Execute as: Me
 * - Who has access: Anyone with the link
 */

const UPLOAD_PASSWORD = "";   // must match what user enters
const DOWNLOAD_PASSWORD = ""; // same here
const FOLDER_NAME = "env-manager"; // Google Drive folder to store files

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: "No POST data received" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const body = JSON.parse(e.postData.contents);
    const name = body.name;
    const password = body.password;

    if (!name || !password) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: "Missing name or password" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Ensure folder exists
    const folder = getOrCreateFolder(FOLDER_NAME);

    // --- UPLOAD ---
    if (body.file && password === UPLOAD_PASSWORD) {
      const fileContent = body.file;
      const blob = Utilities.newBlob(fileContent, "text/plain", name + ".env");

      // Overwrite if exists
      const existing = folder.getFilesByName(name + ".env");
      while (existing.hasNext()) {
        existing.next().setTrashed(true);
      }

      folder.createFile(blob);

      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: name + " uploaded" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // --- DOWNLOAD ---
    if (!body.file && password === DOWNLOAD_PASSWORD) {
      const files = folder.getFilesByName(name + ".env");
      if (files.hasNext()) {
        const file = files.next();
        const content = file.getBlob().getDataAsString();

        return ContentService.createTextOutput(
          JSON.stringify({ fileContent: content })
        ).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(
          JSON.stringify({ error: "File not found: " + name })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // --- Wrong password ---
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Invalid password" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}