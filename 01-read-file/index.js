const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filePath, {
  encoding: 'utf-8',
});
stream.on('data', (item) => {
  console.log(item);
});
