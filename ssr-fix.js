const fs = require('fs');

function updateTextFile(filePath, isMainFile)
{
    fs.readFile(filePath, 'utf-8', function(err, data) {
        if (err) throw err;
        const newContent = isMainFile
            ? getMainFileWrapper(data)
            : getWrapper(data);
        writeTextFile(filePath, newContent);
    });
}

function writeTextFile(filePath, data) {
    fs.writeFile(filePath, data, function(err) {
        if (err) throw err;
        console.log(filePath + ' has been saved');
    });
}

function getMainFileWrapper(fileContent) {
    return `
        const zoneLib = require('zone.js/dist/zone-node');
        const domino = require('domino');
        const fs = require('fs');
        // Use the browser index.html as template for the mock window
        const template = fs
            .readFileSync('C:/work/test-ui-project.front/dist/test-ui-project-ui/browser/index.html')
            .toString();
        // Shim for the global window and document objects.
        const fakeWindow = domino.createWindow(template);
        global['window'] = fakeWindow;
        global['document'] = fakeWindow.document;
        let SVG = require('./svg.js/dist/svg');
        const extraFunc = {
            invent: function(config) {},
            extend: function(modules, methods, attrCheck) {},
            wrapWithAttrCheck: function(fn) {},
            Element: Object.create(null),
        }
        SVG = {...SVG, ...extraFunc}
        SVG.Element.prototype = Object.create(null);
        SVG.Element.prototype.selectize = function(e, i){
            return {
                defaults: Object.create(null)
            }
        };
        SVG.Element.prototype.resize = function(e, i){
            return {
                defaults: Object.create(null)
            }
        };
        (function(window, Zone, SVG){
            ${fileContent}
        }(fakeWindow, Zone, SVG))
    `;
}

function getWrapper(fileContent) {
    return `
        let SVG = require('./svg.js/dist/svg');
        const extraFunc = {
            invent: function(config) {},
            extend: function(modules, methods, attrCheck) {},
            wrapWithAttrCheck: function(fn) {},
            Element: Object.create(null),
        }
        SVG = {...SVG, ...extraFunc}
        SVG.Element.prototype = Object.create(null);
        SVG.Element.prototype.selectize = function(e, i){
            return {
                defaults: Object.create(null)
            }
        };
        SVG.Element.prototype.resize = function(e, i){
            return {
                defaults: Object.create(null)
            }
        };
        ${fileContent}
    `;
}

// only these files require global objects like window, Zone, SVG
const allowedFilesPatters = [
    'main.js',
    'modules-test-test-module',
    'vendors~modules-test-test-module'
];

function applyToFilesInDir(dirName) {
    fs.readdir(dirName, function(err, filenames) {
        if (err) throw err;
        filenames.forEach(function(filename) {
            allowedFilesPatters.forEach(function(filePattern) {
                if (filename.indexOf(filePattern) !== -1) {
                    updateTextFile(dirName + '/' + filename, (filename === 'main.js'));
                }
            });
        });
    });
}

applyToFilesInDir('dist/test-ui-project-ui/server');