const fs = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, { withFileTypes: true }).then(files => {
  for (const file of files) {
    const pathToFile = `${pathToFolder}/${file.name}`;
    if (file.isFile()) {
      const { ext, name } = path.parse(pathToFile);
      fs.stat(pathToFile).then(stats => {
        console.log(`${name} - ${ext.slice(1)} - ${stats.size / 1024}kb`);
      });
    }
  }
});

