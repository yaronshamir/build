module.exports = {
  build: build
}
const pfs = require('fs')
  .promises;
const fs = require('fs');
const path = require('path');

async function walk(dir, fileList = []) {
  const files = await pfs.readdir(dir);
  for (const file of files) {
    const stat = await pfs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = await walk(path.join(dir, file), fileList);
    } else {
      const segments = dir.split('\\');
      const parentFolder = segments[segments.length - 1];
      if (file === parentFolder + '.js') {
        var filePath = path.join(dir, file);
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function build(dir) {

  console.log(`build components:  ${dir}`);
  var components = [];
  walk(dir)
    .then((files) => {
      for (var i = 0; i < files.length; i++) {
        var filePath = files[i];
        var segments = filePath.split('\\');
        var fileName = segments.pop();
        var name = fileName.replace(/\.[^.$]+$/, '');

        components.push({
          name,
          path: `./${name}/${fileName}`
        });
      }
      generateComponents(dir, components);
    });
}

function generateComponents(dir, components) {

  var js = `// auto generated list of available components

const components = {
${components.map(c=>`'${c.name}': require('${c.path}')`).join(',\n')}
};

function get(key) {
   if (components[key] == null) {
     console.log('Component ' +key + ' not found')
      return new components['Component']()
   }

   return {
      ...require('./component'),
      ...components[key]
   }
}

module.exports = {
   get
};
`

  js = js.replace(/\uFEFF/g, '');
  fs.writeFileSync(`${dir}\\factory.js`, js, 'utf8', function(err) {});
}
