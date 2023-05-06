const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

process.on('exit', () => {
  stdout.write('\nПока!');
});

process.on('SIGINT', () => {
  exit();
});

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err){
    console.error(err.message);
  } else{
    stdout.write('Введите текст \n> ');
    stdin.on('data', (data) => {
      fs.appendFile(path.join(__dirname, 'text.txt'), data, err => {
        if (err) {
          console.error(err.message);
        } else {
          if (data.toString().trim() === 'exit') exit();      
        }
      });
    });
  }
});



