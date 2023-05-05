const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

stdout.write('Введите текст \n> ');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Пока!');
    exit();
  } 
  fs.appendFile(path.join(__dirname, 'text.txt'), data.toString(), err => {
    if (err) console.error(err.message);    
  });
});
