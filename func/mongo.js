const mongoose = require('mongoose');
//const fsExtra = require("fs-extra");
const _ = require("lodash");
//const main = fsExtra.readJsonSync('debug.json');
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

//let propertyModel;


function counterExit() {
    counter = counter - 1;
    if (counter === 0) {
        process.exit(0);
    }
}

//const propertyModel = mongoose.model('bla', propertySchema);

function update(doc, data) {
    return new Promise((resolve, reject) => {
        const docObject = doc.toObject();
        delete docObject._id;
        delete docObject.__v;
        if (docObject.type === 'enum') {
            delete docObject.importList;
            delete docObject.mapList;
        }
        if (!_.isEqual(docObject, data)) {
            Object.keys(data).forEach((objectKey) => {
                doc[objectKey] = data[objectKey];
            });
            resolve(doc);
        } else {
            resolve(null);
            console.log(data.sourceName, 'no update');
            //counterExit();
        }
    });
}

function CompareMongo(MONGO_CONNECTION, MONGO_COLLECTION, MAIN) {
    const propertyModel = mongoose.model(MONGO_COLLECTION, propertySchema);
    mongoose.connect(MONGO_CONNECTION).then((a) => {
        propertyModel.find({}, function (err, docs) {
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
