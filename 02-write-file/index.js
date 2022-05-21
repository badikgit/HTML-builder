const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output} = require('process');

const pathToFile = path.join(__dirname, 'outFile.txt');
const readlineStream = readline.createInterface({ input, output });
const writeStream = fs.WriteStream(pathToFile);

readlineStream.write('\nПривёт, я твой дневник.\nНу... Рассказывай как день прошёл: \n\n');
readlineStream.on('line', input => {
  if (input !== 'exit') {
    writeStream.write(`${input}\n`);
  }
  else readlineStream.close();
});

readlineStream.on('SIGINT', () => readlineStream.close());

readlineStream.on('close', () => {
  writeStream.close();
  console.log(`\nВысказался? Полегчало? :)\nЯ на всякий случай всё записал, можешь посмотреть в файле:\n${pathToFile}\nХорошего дня!\n`);
});