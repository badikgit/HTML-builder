const fs = require('fs');
const path = require('path');



const pathBundle = path.join(__dirname,'project-dist','bundle.css');
const pathStyles = path.join(__dirname,'styles');
const writeStream = fs.WriteStream(pathBundle);

fs.readdir(pathStyles,{ withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  else {
    const cssFiles = files.filter(file => ((file.isFile()) && 
      path.parse(path.join(pathStyles,file.name)).ext === '.css'));
    cssFiles.forEach(file => {
      const readStream = fs.ReadStream(`${pathStyles}\\${file.name}`);
      readStream.on ('data', data => writeStream.write(data));
    });
  }
});


