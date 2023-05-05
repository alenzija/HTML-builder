const fs = require('fs');
const path = require('path');

const folderName = 'files';
const copyFolderName = folderName + '-copy';

fs.mkdir(path.join(__dirname, copyFolderName), {recursive: true}, err => {
  if (err) { 
    console.error(err);
  }
  fs.readdir(path.join(__dirname, folderName), { withFileTypes: true }, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
      fs.copyFile(path.join(__dirname, folderName, file.name),path.join(__dirname,copyFolderName, file.name), err => {
        if(err) console.log(err.message);
      });
    });
    fs.readdir(path.join(__dirname, copyFolderName), { withFileTypes: true }, (err, copyfiles) =>{
      if (err) console.error(err.message);
      files = files.map(file => file.name);
      copyfiles.forEach(file => {
        if (files.indexOf(file.name) < 0) {
          fs.unlink(path.join(__dirname, copyFolderName, file.name), err => {
            if (err) console.error(err);
          });
        }
      });
    });
  });
});
