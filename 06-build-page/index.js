const { join } = require('path');
const { writeFile, readFile, mkdir } = require('node:fs/promises');
const copyDirectory = require('../04-copy-directory/index');
const compileStyles = require('../05-merge-styles/index');

const buildPage = async () => {
  const templatePath = join(__dirname, 'template.html');
  const distPath = join(__dirname, 'project-dist');
  const indexPath = join(distPath, 'index.html');
  const stylesPath = join(distPath, 'style.css');
  const assetsPath = join(distPath, 'assets');

  // 1. Создание папки project-dist
  await mkdir(distPath, { recursive: true });

  try {
    // 2. Чтение файла шаблона
    let templateContent = await readFile(templatePath, 'utf-8');

    // 3. Поиск всех названий тегов в файле шаблона
    const regex = /{{(.*?)}}/g;
    const matches = templateContent.match(regex);

    if (!matches) {
      console.log('Нет тегов в файле шаблона.');
      return;
    }

    // 4. Замена тегов шаблона содержимым файлов компонентов
    for (const match of matches) {
      const name = match.slice(2, -2).trim();
      const componentPath = join(__dirname, 'components', `${name}.html`);

      try {
        const componentContent = await readFile(componentPath, 'utf-8');
        templateContent = templateContent.replace(match, componentContent);
      } catch (e) {
        console.error(`Ошибка чтения компонента ${name}: ${e.message}`);
      }
    }

    // 5. Запись измененный шаблон в index.html файл
    await writeFile(indexPath, templateContent, 'utf-8');
    console.log('Файл index.html создан успешно.');

    // 6. Копия папки assets в папку project-dist
    await copyDirectory(join(__dirname, 'assets'), assetsPath);
    console.log('Папка assets скопирована успешно.');

    // 7. Компиляция стилей в один файл style.css
    await compileStyles(join(__dirname, 'styles'), stylesPath);
  } catch (e) {
    console.error(`Ошибка при выполнении: ${e.message}`);
  }
};

buildPage();
