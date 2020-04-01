//const cacheFolderName = "Temp/Finance_sheet.db";
//
//function getOrCreateFolder(path) {
//  var paths = path.split("/");
//  var curFolder = DriveApp.getRootFolder();
//  for (var path of paths) {
//    var folders = curFolder.getFoldersByName(path);
//    curFolder = folders.hasNext() ? folders.next() : curFolder.createFolder(path);
//  }
//  return curFolder;
//}
//
//const cacheInGDrive = {
//  get: function(key) {
//    var cacheFolder = getOrCreateFolder(cacheFolderName);
//    var fileIt = cacheFolder.getFilesByName(key);
//    if (!fileIt.hasNext()) {
//      return null;
//    }
//    var file = fileIt.next();
//    return file.getBlob().getDataAsString();
//  },
//  put: function(key, value) {
//    var cacheFolder = getOrCreateFolder(cacheFolderName);
//    var fileIt = cacheFolder.getFilesByName(key);
//    var file;
//    if (!fileIt.hasNext()) {
//      file = cacheFolder.createFile(key, value);
//    }
//    else {
//      file = fileIt.next();
//      file.setContent(value);
//    }
//  },
//  clear: function() {
//    var cacheFolder = getOrCreateFolder(cacheFolderName);
//    cacheFolder.setTrashed(true);
//  }
//}