const fs = require('fs');
const readline = require('readline');
const path = require('path');
const process = require('process');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');

let writeableStream = fs.createWriteStream(filePath, "utf8");

writeableStream.on('open', () => {
  console.log('Hello friend, Enter any text:');
})

const rl = readline.createInterface({ 
  input: stdin,
  output: stdout
 });

rl.on('line', (line) => {
  if (line === 'exit') {
    writeableStream.end('');
    process.exit();
  } else {
    console.log('Do you want to add the text? Otherwise enter "exit"');
    writeableStream.write(line + '\n');
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('File recorded!!! Bye');
});
