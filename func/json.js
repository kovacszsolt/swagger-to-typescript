const fsExtra = require("fs-extra");
const _ = require("lodash");
let prevData;
let newData = [];
let updateData = [];

function CompareJSON(COMPARE_JSON_SAVE, MAINDATA) {
    try {
        prevData = fsExtra.readJsonSync('swagger.json');
    } catch (e) {
        prevData = [];
    }
    MAINDATA.forEach((main) => {
        const prevFind = prevData.find(f => f.sourceName === main.sourceName);
        if (prevFind) {
            delete prevFind.lineNumber;
            delete main.lineNumber;
            if (main.description === undefined) {
                delete main.description;
            }
            if (main.importList === undefined) {
                delete main.importList;
            }
            if (main.mapList === undefined) {
                delete main.mapList;
            }
            main.propertyList = main.propertyList.map((property) => {
                if (property.description === undefined) {
                    delete property.description;
                }
                return property;
            });

            if (!_.isEqual(prevFind, main)) {
                updateData.push(main);
            }
        } else {
            newData.push(main);
        }
    });
    newData.forEach((data) => {
        console.log('new', data.sourceName);
    });
    updateData.forEach((data) => {
        console.log('update', data.sourceName);
    });
    if (COMPARE_JSON_SAVE) {
        fsExtra.writeFileSync('swagger.json', JSON.stringify(MAINDATA, null, '\t'));
    }
}

module.exports = {CompareJSON};
