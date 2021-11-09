const fsExtra = require('fs-extra')
const fs = require('fs')
const {createImportObject, firstCharUpper} = require("./func.js");

let rawFile;
let components;
let fileName = './data/object.json';
if (process.argv.length === 3) {
    fileName = process.argv[2];
}
const interfaceList = [];

const findObjectType = (objectName) => {
    const findComponent = components[objectName];
    if (findComponent) {
        return findComponent['type'];
    } else {
        return '__unknown__';
    }
}

const findLine = (content) => {
    let lineNumber = -1;
    rawFile.forEach((f, lineIndex) => {
            if (f.indexOf(content) !== -1) {
                lineNumber = lineIndex + 1;
            }
        }
    );
    return lineNumber;
}

const componentParser = (objectName, component, singleLinePath, nameSpace) => {
    let outputPropertyList;
    let type = '';
    switch (component.type) {
        case 'string':
            outputPropertyList = componentParserByEnum(component.enum, true);
            type = 'enum';
            break;
        case 'integer':
            outputPropertyList = componentParserByEnum(component.enum, false);
            type = 'enum';
            break;
        case 'object':
            outputPropertyList = componentParserByProperty(component.properties, singleLinePath, nameSpace);
            type = 'interface';
            break;
        default:
            console.log(component);
            process.exit(0);
    }
    const output = {
        type: type,
    };
    Object.assign(output, outputPropertyList);
    return output;

}

const componentParserByEnum = (values, isString) => {
    const output = [];
    values.forEach((value, index) => {
        const outputItem = {
            name: (!isString ? 'VALUE' : '') + value,
            value: (isString ? index : value)
        };
        output.push(outputItem)
    });
    return {propertyList: output};
}

const componentParserByProperty = (propertyList, singleLinePath, nameSpace) => {
    const outputPropertyList = [];
    const outputImportList = [];
    const outputMapList = [];
    Object.keys(propertyList).forEach((propertyName) => {
        let propertyTypeName;
        let outputProperty;

        const property = propertyList[propertyName];
        let propertyType = property['type'];
        let propertyValue = '';
        let propertyValueType = 'string';
        let propertyDescription = property['description'];
        if (propertyType) {
            propertyTypeName = propertyType;
            propertyValue = propertyName.toLowerCase() + '_1';
            switch (propertyType) {
                case 'integer':
                    propertyType = 'number';
                    propertyValueType = 'number';
                    propertyValue = 1;
                    break;
                case 'array' :
                    if (property['items']['$ref']) {
                        const refItemName = property['items']['$ref'].replace('#/components/schemas/', '');
                        const refObject = createImportObject(refItemName, components, singleLinePath, nameSpace);
                        propertyType = 'array_object';
                        propertyTypeName = refObject.objectName;
                        outputImportList.push(refObject);
                        outputMapList.push({
                            name: propertyName,
                            type: 'array_object',
                            source: refObject.objectName
                        });
                    } else if (property['items']['type']) {
                        propertyType = 'array_property';
                        propertyTypeName = property['items']['type'] + '[]';
                    }
                    break;
            }
        } else {
            if (Object.keys(property)[0] === '$ref') {
                const refName = property['$ref'];
                const refItemName = refName.substr(refName.lastIndexOf('/') + 1);
                const refType = findObjectType(refItemName);
                const refObject = createImportObject(refItemName, components, singleLinePath);
                outputImportList.push(refObject);
                propertyType = refType === 'object' ? 'object' : 'enum';
                propertyTypeName = firstCharUpper(refObject.objectName);
                propertyValueType = 'string';
                switch (propertyType) {
                    case 'enum':
                        propertyValueType = components[refItemName].type;
                        propertyValue = components[refItemName].enum[0];
                        break;
                    case 'object':
                        propertyValueType = 'object';
                        propertyValue = refObject.objectName;
                        break;
                    default:
                        console.log(propertyType);
                }
                outputMapList.push({
                    name: propertyName,
                    type: propertyType,
                    source: refObject.objectName
                });
            }
        }
        outputProperty = {
            name: propertyName,
            description: propertyDescription,
            type: propertyType,
            value: propertyValue,
            valueType: propertyValueType,
            typeName: propertyTypeName,
        };
        outputPropertyList.push(outputProperty);
    });
    return {
        mapList: outputMapList,
        importList: outputImportList,
        propertyList: outputPropertyList
    }
}

function step1(inputRawFile, main, debug, singleLinePath, nameSpace) {
    rawFile = inputRawFile;
    components = main['components']['schemas'];
    Object.keys(components).forEach(key => {
        try {
            const lineNumber = findLine(key);
            const mainData = createImportObject(key, components, singleLinePath, nameSpace);
            const component = components[key];
            const propertyList = componentParser(mainData.objectName, component, singleLinePath, nameSpace);
            const interfaceItem = {
                type: propertyList['type'],
                lineNumber: lineNumber,
                sourceName: key,
                description: component['description'],
                importList: propertyList['importList'],
                mapList: propertyList['mapList'],
                propertyList: propertyList['propertyList']
            };
            Object.assign(interfaceItem, mainData);
            interfaceList.push(interfaceItem);
        } catch (error) {
            console.log('-------------------------------------');
            console.log(components[key]);
            console.log(key, 'error');
            console.log(error);
            console.log('-------------------------------------');
            process.exit(1);
        }
    });
    if (debug) {
        fsExtra.writeFileSync('./debug.json', JSON.stringify(interfaceList, null, '\t'));
    }
    return interfaceList;
}

module.exports = {step1};
