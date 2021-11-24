const fsExtra = require("fs-extra");
const Handlebars = require("handlebars");
const {templateEnum, templateInterface, templateModel, templateMock, templateTest} = require("./template");
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

function step2(data, purgeTarget, enumPath, interfacePath, modelPath, enumPathSymbol, interfacePathSymbol, modelPathSymbol, mockPath, mockPathSymbol) {
    const interfaceList = data.filter(f => f.type === 'interface');
    const enumList = data.filter(f => f.type === 'enum');
    if (purgeTarget) {
        fsExtra.emptyDirSync(enumPath);
        fsExtra.emptyDirSync(interfacePath);
        fsExtra.emptyDirSync(modelPath);
    }

    interfaceList.forEach((item) => {
        item.objectName = item.objectName[0].toUpperCase() + item.objectName.slice(1);
        item.enumPathSymbol = enumPathSymbol;
        item.interfacePathSymbol = interfacePathSymbol;
        item.modelPathSymbol = modelPathSymbol;
        item.interfacePath = interfacePath;
        item.enumPath = enumPath;
        item.modelPath = modelPath;
        const template = Handlebars.compile(templateInterface);
        const path = interfacePath + item.filePath + '/';
        const fileContent = template(item);
        fsExtra.mkdirSync(path, {recursive: true});
        fsExtra.writeFileSync(path + item.fileName.toLowerCase() + '.interface.ts', fileContent);
    });

    enumList.forEach((item) => {
        item.objectName = item.objectName[0].toUpperCase() + item.objectName.slice(1);
        const template = Handlebars.compile(templateEnum);
        const path = enumPath + item.filePath + '/';
        const fileContent = template(item);
        fsExtra.mkdirSync(path, {recursive: true});
        fsExtra.writeFileSync(path + item.fileName.toLowerCase() + '.enum.ts', fileContent);
    });

    interfaceList.forEach((item) => {
        item.objectName = item.objectName[0].toUpperCase() + item.objectName.slice(1);
        item.enumPathSymbol = enumPathSymbol;
        item.interfacePath = interfacePath;
        item.enumPath = enumPath;
        item.modelPath = modelPath;
        const template = Handlebars.compile(templateModel);
        const path = modelPath + item.filePath + '/';
        const fileContent = template(item);
        fsExtra.mkdirSync(path, {recursive: true});
        fsExtra.writeFileSync(path + item.fileName.toLowerCase() + '.model.ts', fileContent);
    });

    interfaceList.forEach((item) => {
        item.objectName = item.objectName[0].toUpperCase() + item.objectName.slice(1);
        item.mockPathSymbol = mockPathSymbol;
        const template = Handlebars.compile(templateMock);
        const path = mockPath + item.filePath + '/';
        const fileContent = template(item);
        fsExtra.mkdirSync(path, {recursive: true});
        fsExtra.writeFileSync(path + item.fileName.toLowerCase() + '.mock.ts', fileContent);
    });



    interfaceList.forEach((item) => {
        item.objectName = item.objectName[0].toUpperCase() + item.objectName.slice(1);
        item.enumPathSymbol = enumPathSymbol;
        item.interfacePath = interfacePath;
        item.enumPath = enumPath;
        item.modelPath = modelPath;
        const template = Handlebars.compile(templateTest);
        const path = modelPath + item.filePath + '/';
        const fileContent = template(item);
        fsExtra.mkdirSync(path, {recursive: true});
        fsExtra.writeFileSync(path + item.fileName.toLowerCase() + '.spec.ts', fileContent);
    });

}

module.exports = {step2};
