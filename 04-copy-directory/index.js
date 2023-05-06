const fs = require('fs');
const path = require('path');

const folderName = 'files';
const copyFolderName = folderName + '-copy'; 

const createCopy = (p, pCopy) => {
  fs.readdir(p, { withFileTypes: true }, (err, files) => {
    if(err) {
      console.error(err.message);
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(p, file.name), path.join(pCopy, file.name), err => {
            if(err) console.log(err.message);
          });
        } else {
          fs.mkdir(path.join(pCopy, file.name), {recursive: true}, err => {
            if (err) { 
              console.error(err);
            } 
            createCopy(path.join(p, file.name), path.join(pCopy, file.name));
          });
        }
      });
    }
  });
};

fs.rm(path.join(__dirname, copyFolderName), {force: true, recursive: true}, err => {
  if (err) {
    console.error(err.message);
  } else {
    fs.mkdir(path.join(__dirname, copyFolderName), {recursive: true}, err => {
      if (err) { 
        console.error(err);
      } else createCopy(path.join(__dirname, folderName), path.join(__dirname, copyFolderName));
    });
  }
});


