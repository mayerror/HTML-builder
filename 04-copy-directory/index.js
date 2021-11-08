const path = require('path');
const { constants } = require('fs');
const { mkdir, copyFile, readdir, unlink } =  require('fs/promises');


const dirPath = path.join(__dirname, 'files-copy');
const srcPath = path.join(__dirname, 'files');

async function copyDir(src, dest) {
  try {
    await mkdir(dest);
    console.log('Directory created.');
  } catch (err) {
    console.log('Directory already exist.');
  }
  try {
    const arrName = await getFilesNames(src);
    for (let i = 0; i < arrName.length; i++) {
      const fileName = arrName[i];
      const srcFile  = path.join(src, fileName);
      const destFile  = path.join(dest, fileName);
      await copyFile(srcFile, destFile);
    }
    const arrNameDest = await getFilesNames(dest);
    if (arrNameDest.length > arrName.length) {
      for (let i = 0; i < arrNameDest.length; i++) {
        const item = arrNameDest[i];
        if (!arrName.includes(item)) {
          const pathDel =  path.join(dest, item);
          await unlink(pathDel);
        }
      }
    }
    console.log('Source files was copied to destination');
  } catch {
    console.log('The files could not be copied');
  }
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

copyDir(srcPath, dirPath);