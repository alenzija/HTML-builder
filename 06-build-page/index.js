const path = require('path');
const fs = require('fs');

const folderName = 'project-dist';

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

const changeTags = (tag, data, newData) => {
  const reg = new RegExp(`{{${tag.trim()}}}`, 'g');
  const firstData = data.toString().replace(reg, newData);
  fs.writeFile(path.join(__dirname, folderName, 'index.html'), firstData, err => {
    if(err) console.error(err.message);
  }); 
  return firstData;
};

const readComponents = (p, data) => fs.readdir(p, { withFileTypes: true }, (err, files) => {
  if (err)
    console.error(err.message);
  else {
    let firstData = data;
    files.forEach((file) => {
      if(file.isFile()) {
        if ((/\.html$/).test(file.name)) {
          fs.readFile(path.join(p, file.name), (err, data) => {
            if (err){
              console.error(err.message);
            } else {
              firstData = changeTags(file.name.replace(/\.html$/,''), firstData, data.toString());
            }
          });
        }
      } else {
        readComponents(path.join(p, file.name), firstData);
      }
    });
  }
});


const copyData = (p, pCopy) => {
  fs.readFile(p, (err, data) =>{
    if(err) {
      console.error(2, err.message);
    } else {
      fs.appendFile(pCopy, data, err => {
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
          if (/\.css$/.test(file.name)) copyData(path.join(p, file.name), path.join(__dirname, folderName, 'style.css'));
        } else searchCssFile(path.join(p, file.name));
      });
    }
  });
};


fs.mkdir(path.join(__dirname, folderName), {recursive: true}, err => {
  if (err) { 
    console.error(1, err);
  } else {
    fs.mkdir(path.join(__dirname, folderName, 'assets'),{recursive: true}, err =>{
      if(err) {
        console.error(err.message);
      }
      else {
        createCopy(path.join(__dirname, 'assets'), path.join(__dirname, folderName, 'assets'));
      }
    });
    fs.readFile(path.join(__dirname, 'template.html'), (err, data) =>{
      if(err) {
        console.error(2, err.message);
      } else {
        let firstData = data.toString();
        fs.writeFile(path.join(__dirname, folderName, 'index.html'), data, err => {
          if (err) {
            console.error(3, err.message);
          } else {
            readComponents(path.join(__dirname, 'components'), firstData);
          }
        });
      }
    });  
    fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', err => {
      if (err) { 
        console.error(err.message);
      } else {
        searchCssFile(path.join(__dirname, 'styles'));
      }
    });
  }
});
