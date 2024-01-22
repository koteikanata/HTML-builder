const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

console.log(
  'Добро пожаловать! Введите текст. Для завершения введите "exit".\n',
);
const filePath = path.join(__dirname, 'input.txt');
const writeStream = fs.createWriteStream(filePath);

rl.prompt();

// обработчик события при вводе строки
rl.on('line', (input) => {
  // проверка на ключевое слово "exit"
  if (input === 'exit') {
    console.log('\nДо свидания! Процесс завершен.');
    rl.close();
  } else {
    // запись введенного текста в файл
    writeStream.write(`${input}\n`);
    // ждем нового ввода
    rl.prompt();
  }
});

// обработчик 'close' срабатывает напр. при ctrl + c/d
rl.on('close', () => {
  writeStream.end();
  console.log('\nДо свидания! Процесс завершен.');
  process.exit(0);
});
