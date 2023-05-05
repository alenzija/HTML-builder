const path = require('path');
const fs = require('fs');

const writeInformation = (p) => {
  const { name, ext } = path.parse(p);
  fs.stat(p, (err, stats) => {
    if (err) {
      console.error(err.message);
    } else {
      const {size} = stats;
      console.log(`${name} - ${ext.replace(/^\./, '')} - ${+size / 1000}kb`);
    }
  });
};

const func = (p) => fs.readdir(p, { withFileTypes: true }, (err, files) => {
  if (err)
    console.error(err.message);
  else {
    files.forEach((file) => {
      if(file.isFile()) {
        if (!(/^\./).test(file.name)) writeInformation(path.join(p, file.name));
      } else {
        func(path.join(p, file.name));
      }
    });
  }
});

const p = path.join(__dirname, 'secret-folder');
func(p);