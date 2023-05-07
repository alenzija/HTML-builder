const path = require('path');
const fs = require('fs');

const folderName = 'project-dist';

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

const changeTags = (tag, data, newData) => {
  const reg = new RegExp(`{{${tag.trim()}}}`, 'g');
  return data.toString().replace(reg, newData.toString());

};

const readComponents = (p, pCopy) => fs.readdir(p, { withFileTypes: true }, (err, files) => {
  if (err)
    console.error(err.message);
  else {
    fs.readFile(pCopy, (err, prevdata) => {
      if (err) {
        console.error(err.message);
      } else {
        let newData = prevdata;
        let fileNames = files.filter(file => /\.html$/.test(file.name) && file.isFile()).map((file) => file.name);
        files.forEach((file) => {
          if(file.isFile()) {
            if ((/\.html$/).test(file.name)) {
              fs.readFile(path.join(p, file.name), (err, data) => {
                if (err){
                  console.error(err.message);
                } else {
                  newData = changeTags(file.name.replace(/\.html/,''), newData, data);
                  fileNames = fileNames.filter(fileName => file.name !== fileName);
                  if (fileNames.length === 0) {
                    fs.writeFile(path.join(__dirname, folderName, 'index.html'), newData, err => {
                      if(err) console.error(err.message);
                    });   
                  }          
                }
              });
            }
          } else {
            readComponents(path.join(p, file.name), path.join(__dirname, folderName, 'index.html'));
          }
        });
      }
    });    
  }
});


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
          if (/\.css$/.test(file.name)) copyData(path.join(p, file.name), path.join(__dirname, folderName, 'style.css'));
        } else searchCssFile(path.join(p, file.name));
      });
    }
  });
};

fs.rm(path.join(__dirname, folderName), {force:true, recursive: true}, err =>{
  if (err) {
    console.error(err.message);
  } else {
    fs.mkdir(path.join(__dirname, folderName), {recursive: true}, err => {
      if (err) { 
        console.error(err);
      } else {
        fs.mkdir(path.join(__dirname, folderName, 'assets'),{recursive: true}, err =>{
          if(err) {
            console.error(err.message);
          }
          else {
            createCopy(path.join(__dirname, 'assets'), path.join(__dirname, folderName, 'assets'));
          }
        });
        fs.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, folderName, 'index.html'), err => {
          if (err) {
            console.error(err.message);
          } else {
            readComponents(path.join(__dirname, 'components'), path.join(__dirname, folderName, 'index.html'));
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
  }
});
