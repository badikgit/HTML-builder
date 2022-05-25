const { readdir, rm, mkdir } = require('fs/promises');
const { copyFile } = require('fs');
const { join } = require('path');

const pathToFolder = join(__dirname, 'files');
const pathToCopyFolder = join(__dirname, 'files-copy');

const copyDir = async (pathFrom, pathTo) => {
  mkdir(pathTo)
    .catch(() => console.log(`[\x1b[31m ✗ \x1b[0m] Ошибка создания папки:\n${pathTo}`))
    .then(async() => {
      console.log(`[\x1b[36m ✓ \x1b[0m] Папка успешно создана:\n${pathTo}`);
      const files = await readdir(pathFrom, { withFileTypes: true });
      files.forEach(async file => {
        const path = join(pathFrom, file.name);
        const pathCopy = join(pathTo, file.name);
        if (file.isFile()) {
          copyFile(path, pathCopy, (err) => {
            if (err) console.log(`[\x1b[31m ✗ \x1b[0m] Ошибка копирования файла ${file.name}\nиз ${path}\nв ${pathCopy}`);
            else console.log(`[\x1b[32m ✓ \x1b[0m] Файл ${file.name} успешно скопирован\nиз ${path}\nв ${pathCopy}`);
          });
        }
        else if (file.isDirectory()) {
          await copyDir(path, pathCopy);
        }
      });
    });
};

console.log(`\n\x1b[33m   ---   Удаление папки    ---\x1b[0m\n${pathToCopyFolder}:`);
rm(pathToCopyFolder, { recursive: true })
  .then(() => console.log('\x1b[36mПапка успешно удалена.\x1b[0m'))
  .catch(() => console.log('\x1b[36mПапка отсутствует.\x1b[0m'))
  .finally(() => {
    console.log('\x1b[32m ---   Удаление завершено    ---\x1b[0m\n');
    console.log(`\x1b[33m ---   Копирование папки   ---\x1b[0m\n${pathToFolder}:`);
    copyDir(pathToFolder, pathToCopyFolder);
  });

