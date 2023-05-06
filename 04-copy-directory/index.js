const fs = require('fs');
const path = require('path');

const folderName = 'files';
const copyFolderName = folderName + '-copy'; 

const check = (files, pCopy) => {
  fs.readdir(pCopy, { withFileTypes: true }, (err, copyfiles) =>{
    if (err) {
      console.error(err.message);
    } else {
      files = files.map(file => file.name);
      copyfiles.forEach(file => {
        if (file.isDirectory() && files.indexOf(file.name) < 0 ) {
          fs.rmdir(path.join(pCopy, file.name), err =>{
            if (err) console.error(err.message);
          });
        }
        if(file.isFile() && files.indexOf(file.name) < 0 ){      
          fs.unlink(path.join(pCopy, file.name), err => {
            if (err) console.error(err);
          });
        }
      });
    }
  });
};

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
      check(files, pCopy);
    }
  });
};

fs.mkdir(path.join(__dirname, copyFolderName), {recursive: true}, err => {
  if (err) { 
    console.error(err);
  } else createCopy(path.join(__dirname, folderName), path.join(__dirname, copyFolderName));
});
