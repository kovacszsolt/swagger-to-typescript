const mongoose = require('mongoose');
const _ = require("lodash");
const {SendTeamsMessage} = require("./teamsmessage");
const propertySchema = new mongoose.Schema({
    type: String,
    lineNumber: Number,
    sourceName: String,
    description: String,
    importList: [],
    mapList: [],
    propertyList: [],
    filePath: String,
    fileName: String,
    fileType: String,
    objectName: String

});
let counter = 0;

let teamsUrl = '';

let teamsTitle = '';

const factsData = [];

function counterExit() {
    counter = counter - 1;
    if (counter === 0) {
        if (teamsUrl !== '') {
            if (factsData.length === 0) {
                process.exit(0);
            } else {
                SendTeamsMessage(teamsUrl, factsData, teamsTitle);
            }

        } else {
            process.exit(0);
        }

    }
}

function undefinedOrNull(property) {
    if (property === undefined || property === null) {
        property = '';
    }
    return property;
}

function update(doc, data) {
    return new Promise((resolve, reject) => {

        const docObject = doc.toObject();

        delete docObject._id;
        delete docObject.__v;
        if (docObject.type === 'enum') {
            delete docObject.importList;
            delete docObject.mapList;
            delete data.importList;
            delete data.mapList;
        }
        data.description = undefinedOrNull(data.description);
        docObject.description = undefinedOrNull(docObject.description);
        data.propertyList = data.propertyList.map((property) => {
            property.description = undefinedOrNull(property.description);
            return property;
        });

        docObject.propertyList = docObject.propertyList.map((property) => {
            property.description = undefinedOrNull(property.description);
            return property;
        });

        const dataComp = {...data};
        const docObjectComp = {...docObject};
        delete dataComp.enumPathSymbol;
        delete dataComp.interfacePathSymbol;
        delete dataComp.modelPathSymbol;
        delete dataComp.interfacePath;
        delete dataComp.enumPath;
        delete dataComp.modelPath;
        delete dataComp.mockPathSymbol;
        if (!_.isEqual(docObjectComp, dataComp)) {
            Object.keys(data).forEach((objectKey) => {
                doc[objectKey] = data[objectKey];
            });
            resolve(doc);
        } else {
            resolve(null);
        }

    });
}

function CompareMongo(MONGO_CONNECTION, MONGO_COLLECTION, MAIN, TEAMS_URL, TEAMS_TITLE) {
    teamsUrl = TEAMS_URL;
    teamsTitle = TEAMS_TITLE;
    const propertyModel = mongoose.model(MONGO_COLLECTION, propertySchema);
    mongoose.connect(MONGO_CONNECTION).then((a) => {
        propertyModel.find({}, (err, docs) => {

            if (err) {
                console.error('Mongo ERROR');
                process.exit(-1);
            } else {
                counter = MAIN.length;
                MAIN.forEach((data) => {
                    const docsFind = docs.find(f => f.sourceName === data.sourceName);
                    if (docsFind) {
                        update(docsFind, data).then((doc) => {
                            if (doc) {
                                console.log(data.sourceName, 'update done');
                                factsData.push({name: 'update', value: data.sourceName});
                                doc.save().then(() => {
                                    counterExit();
                                });
                            } else {
                                counterExit();
                            }
                        })
                    } else {
                        const newProperty = new propertyModel(data);
                        newProperty.save().then(() => {
                            factsData.push({name: 'new', value: data.sourceName});
                            console.log(data.sourceName, 'new done');
                            counterExit();
                        });
                    }
                });
            }
        });
    });
}

module.exports = {CompareMongo};
