const componentsDir = process.argv[2];


require('./components').build(componentsDir);
require('./templates').build(componentsDir);
const style = require('./style');
style.build(componentsDir);


if (process.argv.length > 3) {
    const layoutDir = process.argv[3];
    require('./layouts').build(layoutDir);
    style.build(layoutDir);
}