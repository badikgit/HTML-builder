const fs = require('fs');
const path = require('path');
const process = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.ReadStream(pathToFile);

stream.on ('data', data =>{
  process.stdout.write(data);
});