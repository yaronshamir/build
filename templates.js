module.exports = {
   build: build
}
const pfs = require('fs').promises;
const fs = require('fs');
const path = require('path');

console.log('build templates');

async function walk(dir, fileList = []) {
   const files = await pfs.readdir(dir);
   for (const file of files) {
      const stat = await pfs.stat(path.join(dir, file));
      if (stat.isDirectory()) {
         fileList = await walk(path.join(dir, file), fileList);
      } else {

         if (file.endsWith('.html')) {
            var filePath = path.join(dir, file);
            fileList.push(filePath);
         }
      }
   }
   return fileList;
}

function build(dir) {
   walk(dir).then((files) => {
      for (var i = 0; i < files.length; i++) {
         var filePath = files[i];
         var content = fs.readFileSync(filePath, 'utf8');

         var segments = filePath.split('\\');
         var path = segments.join('\\');
         createTemplate(content, path);
      }
   });
}

function createTemplate(template, path) {


   var js = `// auto generated based on ${path}

module.exports =  create;

function create(value) {

   return \`${template}\`;
}`;

   js = js.replace(/\uFEFF/g, '');
   fs.writeFileSync(path + '.js', js, 'utf8', function (err) {
      console.log(err, path)
   });
}