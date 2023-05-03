const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

stdout.write('Введите текст \n> ');
stdin.on('data', (data) => {
  fs.writeFile(path.join(__dirname, 'text.txt'), data.toString(), err => {
    if (err) console.err(err.message);
    console.log('Файл создан');
    exit();
  });
});
