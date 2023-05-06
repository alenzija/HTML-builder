const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

process.on('exit', () => {
  stdout.write('\nПока!');
});

process.on('SIGINT', () => {
  exit();
});

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Введите текст \n> ');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  output.write(data);
});
