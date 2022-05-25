const { readdir, rm, mkdir } = require('fs/promises');
const fs = require('fs');
const {join, parse } = require('path');

const projectPath = join(__dirname, 'project-dist');
const assetsPath = join(__dirname, 'assets');
const stylePath = join(__dirname, 'styles');
const componentsPath = join(__dirname, 'components');
const templatePath = join(__dirname, 'template.html');
const projectAssetsPath = join(projectPath, 'assets');

const copyDir = async (pathFrom, pathTo) => {
  mkdir(pathTo)
    .then(async () => {
      const files = await readdir(pathFrom, { withFileTypes: true });
      files.forEach(async file => {
        const path = join(pathFrom, file.name);
        const pathCopy = join(pathTo, file.name);
        if (file.isFile()) fs.copyFile(path, pathCopy, () => {});
        else if (file.isDirectory()) await copyDir(path, pathCopy);
      });
    });
};

const bundleStyles = (pathStyles) => {
  const writeStream = fs.WriteStream(join(projectPath, 'style.css'));
  fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.filter(file => ((file.isFile()) && parse(join(pathStyles, file.name)).ext === '.css'))
        .forEach(file => {
          const readStream = fs.ReadStream( join(pathStyles, file.name) );
          readStream.on('data', data => writeStream.write(data));
        });
    }
  });
};

const buildHtml = async (pathTemplate, pathComponents) => {
  let  components = await readdir(pathComponents, { withFileTypes: true });
  components = components.filter(file => ((file.isFile()) && parse(join(pathComponents, file.name)).ext === '.html'));
  const readTemplate = fs.ReadStream(pathTemplate,'utf-8');
  readTemplate.on ('data', async data => {
    let index = data;
    components.forEach(async (component) => {
      const readStream = await fs.ReadStream( join(pathComponents, component.name) );
      await readStream.on('data', componentData => {
        index = index.replace(`{{${parse(join(pathComponents, component.name)).name}}}`, componentData);
        const writeStream = fs.WriteStream(join(projectPath, 'index.html'));
        writeStream.write(index);
      });
    });
    
  });
};

rm(projectPath, { recursive: true, force: true })
  .then(() => {
    mkdir(projectPath);
    copyDir(assetsPath, projectAssetsPath);
    bundleStyles(stylePath);
    buildHtml(templatePath, componentsPath);
  });
