const { mkdir, readdir, copyFile } = require('node:fs/promises');
const { join } = require('path');

const formatPath = (src) => {
  const searchString = 'HTML-builder';
  return src.includes(searchString)
    ? src.substring(src.indexOf(searchString) + searchString.length)
    : src;
};

const copyItems = async (src, dest) => {
  await mkdir(dest, { recursive: true });
  const files = await readdir(src, { withFileTypes: true });

  for (const file of files) {
    const srcPath = join(src, file.name);
    const destPath = join(dest, file.name);

    if (file.isDirectory()) {
      await copyItems(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
};

const copyDirectory = async (src, dest) => {
  try {
    await copyItems(src, dest);
    console.log(
      `Директория скопирована из ${formatPath(src)} в ${formatPath(dest)}`,
    );
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
  const src = join(__dirname, 'files');
  const resultFolder = join(__dirname, 'files-copy');

  await copyDirectory(src, resultFolder);
};

if (require.main === module) {
  main();
}

module.exports = copyDirectory;
