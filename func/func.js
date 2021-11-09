const componentToFileName = (name) => {
    let output = name.split('.').join('-').toLowerCase();
    output = componentNormalize(output);
    return output;
}

const componentNormalize = (name) => {
    let output = name;
    output = output.split('`').join('');
    output = output.split('[').join('');
    output = output.split(']').join('');
    return output;
}

function firstCharUpper(item) {
    return item[0].toUpperCase() + item.slice(1);
}

function firstCharLower(item) {
    return item[0].toLowerCase() + item.slice(1);
}

const fileNameToObjectPath = (name) => {
    const nameArray = name.split('-');
    return nameArray.slice().splice(0, nameArray.length - 1).join('/');
}

const fileNameToObjectName = (name) => {
    const nameArray = name.split('-');
    return nameArray[nameArray.length - 1];
}

function createImportObject(key, components, singleLinePath, nameSpace) {
    key = componentNormalize(key);
    const objectName = key.split('.')[key.split('.').length - 1];
    const fileName = componentToFileName(key.replace(nameSpace, ''));
    const objectType = components[key].type === 'object' ? 'interface' : 'enum';
    const filePath = fileNameToObjectPath(fileName);
    const longObjectName = fileName.split('-').map(f => firstCharUpper(f)).join('');
    return {
        filePath: singleLinePath ? '' : filePath,
        fileName: singleLinePath ? fileName : objectName,
        fileType: objectType,
        objectName: singleLinePath ? longObjectName : objectName
    }
}

module.exports = {createImportObject, firstCharUpper};
