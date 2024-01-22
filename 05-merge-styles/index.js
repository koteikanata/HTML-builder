const { join, extname } = require('path');
const { readdir, writeFile, readFile } = require('node:fs/promises');

const formatPath = (src) => {
  const searchString = 'HTML-builder';
  return src.includes(searchString)
    ? src.substring(src.indexOf(searchString) + searchString.length)
    : src;
};

const compileStyles = async (srcPath, pathFile) => {
  const res = [];
  const filesLength = [];

  const files = await readdir(srcPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && extname(file.name).slice(1) === 'css') {
      const filePath = join(srcPath, file.name);

      try {
        const fileContent = await readFile(filePath, 'utf-8');
        const fileSize = fileContent.length;

        res.push(fileContent);
        filesLength.push(fileSize);
      } catch (e) {
        console.error(`Ошибка чтения файла: ${e.message}`);
      }
    }
  }

  try {
    await writeFile(pathFile, res.join('\n'), 'utf-8');
    console.log(
      `Файлы успешно объединены и записаны: ${formatPath(pathFile)}.`,
    );
  } catch (e) {
    console.error(`Ошибка записи файла: ${e.message}`);
  }

  console.log(`Длины файлов: ${filesLength.join(' ')}`);
  console.log(
    `Ожидаемая длина файла: ${filesLength.reduce(
      (item, acc) => +item + acc,
      0,
    )}`,
  );
  console.log(`Длина итогового файла: ${res.join('').length}`);
};

if (require.main === module) {
  compileStyles(join(__dirname, 'styles'), join(__dirname, 'bundle.css'));
}

module.exports = compileStyles;
