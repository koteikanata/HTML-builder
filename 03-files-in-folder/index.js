const { readdir, stat } = require('node:fs/promises');

const path = require('path');

const listFiles = async () => {
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    const files = await readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      const fileStats = await stat(filePath);

      if (fileStats.isFile()) {
        const fileName = path.parse(file.name).name;
        const fileExtension = path.extname(file.name).slice(1);
        const fileSize = fileStats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

listFiles();
