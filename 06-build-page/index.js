const fs = require('fs');
const path = require('path');
const { constants } = require('fs');
const { mkdir, readFile, writeFile, copyFile, readdir, unlink } =  require('fs/promises');

async function createDir(name) {
  const dirPath = path.join(__dirname, name);
  try {
    await mkdir(dirPath);
    console.log('Directory created.');
  } catch (err) {
    console.log('Directory already exist.');
  }
}

async function createHtml(template) {
  const templatePath = path.join(__dirname, template);
  const compPath = path.join(__dirname, 'components');
  let  buffer = '';
  try {
    buffer = await readFile(templatePath , 'utf8');
  } catch (err) {
    console.error(err);
  }
  let compFullNames = await getFilesNames(compPath);
  let compNames = [];
  compFullNames = compFullNames.filter(fullName => fullName.includes('.html'));
  compFullNames.forEach(fullName => {
    compNames.push(fullName.replace('.html',''));
  });
  let i = 0;
  for await (let fullName of compFullNames) {
    const filePath = path.join(compPath, fullName);
    buffer = await changeTemplate(buffer, compNames[i], filePath);
    i++;
  }
  try {
    const projectPath = path.join(__dirname, 'project-dist', 'index.html');
    await writeFile(projectPath, buffer, 'utf8');
  } catch (err) {
    console.error(err);
  }
  // console.log(buffer);
}

async function changeTemplate(str, fileName, filePath) {
  let  buffer = '';
  try {
    buffer = await readFile(filePath , 'utf8');
    str = str.replace(`{{${fileName}}}`, buffer);
  } catch (err) {
    console.error(err);
  }
  return str;
}

async function getFilesNames(src) {
  let arr = [];
  try {
    const files = await readdir(src, {withFileTypes: true});
    for (const file of files) {
      arr.push(file.name);
    }
  } catch (err) {
    console.error(err);
    arr = [];
  }
  return arr;
}


async function bundleStyles() {
  const filePath = path.join(__dirname, 'project-dist', 'style.css');
  const srcPath = path.join(__dirname, 'styles');

  let writeableStream = fs.createWriteStream(filePath, "utf8");
  const arr = await getFilesNamesCSS(srcPath);

  for (let i = 0; i < arr.length; i++) {
    const name = arr[i];
    const srcfilePath = path.join(srcPath, name);
    let readableStream = fs.createReadStream(srcfilePath, "utf8");
    readableStream.pipe(writeableStream);
  }
}

async function getFilesNamesCSS(dir) {
  let arr = [];
  try {
    const files = await readdir(dir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        let extString = '',
            filePath = path.join(dir , file.name);
            
        extString = path.parse(filePath).ext;
        if (extString === '.css') {
          arr.push(file.name);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return arr;
}

async function init() {
  await createDir('project-dist');
  await createHtml('template.html');
  await bundleStyles();
}

init();