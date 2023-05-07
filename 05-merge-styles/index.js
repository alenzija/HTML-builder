const fs = require('fs');
const path = require('path');

const fileName = 'bundle.css';
const folderName = 'project-dist';

const copyData = (p, pCopy) => {
  fs.readFile(p, (err, data) =>{
    if(err) {
      console.error(2, err.message);
    } else {
      fs.appendFile(pCopy, '\n' + data, err => {
        if(err) console.error(err.message);
      });
    }
  });
};

const searchCssFile = (p) => {
  fs.readdir(p, { withFileTypes: true }, (err, files) =>{
    if (err) {
      console.error(1, err.message);
    } else {
      files.forEach(file => {
        if(file.isFile()) {
          if (/\.css$/.test(file.name)) copyData (path.join(p, file.name), path.join(__dirname, folderName, fileName));
        } else searchCssFile(path.join(p, file.name));
      });
    }
  });
};

fs.mkdir(path.join(__dirname, folderName), {recursive: true},  (err) => {
  if (err) {
    console.error(err.message);
  } else {
    fs.writeFile(path.join(__dirname, 'project-dist', fileName), '', err => {
      if (err) { 
        console.error(err.message);
      } else {
        searchCssFile(path.join(__dirname, 'styles'));
      }
    });
  }
});



