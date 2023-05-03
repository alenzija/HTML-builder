const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'text.txt'), (error, data) => {
  if (error) console.error(error.message);
  console.log(data.toString().trim())
});