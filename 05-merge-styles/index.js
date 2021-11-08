const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const process = require('process');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
const srcPath = path.join(__dirname, 'styles');

let writeableStream = fs.createWriteStream(filePath, "utf8");

async function getFilesNames(dir) {
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

async function openListener() {
  const arr = await getFilesNames(srcPath);
  for (let i = 0; i < arr.length; i++) {
    const name = arr[i];
    const srcfilePath = path.join(srcPath, name);
    let readableStream = fs.createReadStream(srcfilePath, "utf8");
    readableStream.pipe(writeableStream);
  }
  let str = '';
  arr.forEach((item, index) => {
    if (index != arr.length-1) {
      str+=item + ', ';
    } else {
      str += item + ' into bundle.css';
    }
  });
  console.log(str);
}

writeableStream.on('open', openListener);