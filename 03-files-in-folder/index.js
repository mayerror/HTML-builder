const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

async function readDirectory(dir) {
  try {
    const files = await readdir(dir, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        let outString = '',
            extString = '',
            filePath = path.join(dir , file.name);
            
        extString = path.parse(filePath).ext;
        outString += file.name + ' - ';
        outString = outString.replace(extString, '');
        extString = extString.slice(1);
        outString += extString + ' - ';
        fs.stat(filePath, (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {
            const size = stats.size/1024;
            outString += size.toFixed(2) + 'kb';
            console.log(outString);
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readDirectory(dirPath);