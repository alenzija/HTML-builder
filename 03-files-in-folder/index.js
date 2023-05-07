const path = require('path');
const fs = require('fs');

const writeInformation = (p) => {
  const { name, ext } = path.parse(p);
  fs.stat(p, (err, stats) => {
    if (err) {
      console.error(err.message);
    } else {
      const {size} = stats;
      console.log(`${name} - ${ext.replace(/^\./, '')} - ${(+size / 1024).toFixed(3)}kb`);
    }
  });
};

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err)
    console.error(err.message);
  else {
    files.forEach((file) => {
      if(file.isFile() && !/^\./.test(file.name)) writeInformation(path.join(path.join(__dirname, 'secret-folder'), file.name));
    });
  }
});