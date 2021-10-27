#!/usr/bin/envnode
const yargs = require('yargs');
const {step1} = require("./func/step1");
const {step2} = require("./func/step2");
const fs = require("fs");
const fsExtra = require("fs-extra");
const request = require("request");
const {CompareMongo} = require("./func/mongo");
const {CompareJSON} = require("./func/json");
const argv = yargs
    .usage('Usage: $0')
    .alias('ip', 'inputpath')
    .describe('ip', 'Swagger input file path')

    .alias('d', 'debug')
    .default('d', true)
    .describe('d', 'Debug enable - temporarily file: debug.json')

    .alias('pt', 'purgetarget')
    .default('pt', false)
    .describe('pt', 'Purge target directory')

    .alias('pe', 'pathenum')
    .default('pathenum', 'src/shared/enum/')
    .describe('pe', 'Enum file path')

    .alias('pi', 'pathinterface')
    .default('pathinterface', 'src/shared/interface/')
    .describe('pi', 'Interface file path')

    .alias('pm', 'pathmodel')
    .default('pathmodel', 'src/shared/model/')
    .describe('pm', 'Model file path')

    .alias('pmo', 'pathmock')
    .default('pathmock', 'src/test/mock/')
    .describe('pmo', 'Mock file path')

    .alias('pes', 'pathenumsymbol')
    .default('pathenumsymbol', '@enum')
    .describe('pes', 'Enum symbol')

    .alias('pis', 'pathinterfacesymbol')
    .default('pathinterfacesymbol', '@interface')
    .describe('pis', 'Interface symbol')

    .alias('pms', 'pathmodelsymbol')
    .default('pathmodelsymbol', '@model')
    .describe('pms', 'Model symbol')

    .alias('pmos', 'pathmocksymbol')
    .default('pathmocksymbol', '@mock')
    .describe('pmos', 'Mock symbol')

    .alias('slp', 'singlelinepath')
    .default('singlelinepath', true)
    .describe('pm', 'Single Path')

    .alias('mc', 'mongoconnection')
    .default('mongoconnection', '')
    .describe('mc', 'MongoDB connection string')

    .alias('ns', 'namespace')
    .default('namespace', '')
    .describe('ns', 'Namespace will remove')

    .alias('mcol', 'mongocollection')
    .default('mongocollection', '')
    .describe('mcol', 'MongoDB Collection Name')

    .alias('gall', 'generateall')
    .default('generateall', 'true')
    .describe('gall', 'Generate all interface and enums')

    .alias('ct', 'comparetype')
    .default('comparetype', '')
    .describe('ct', 'Compare type mongo|json')

    .alias('cjs', 'comparejsonsave')
    .default('cjs', false)
    .describe('cjs', 'Compare type json save result')

    .alias('tu', 'teamsurl')
    .default('tu', '')
    .describe('tu', 'Microsoft Teams webhook URL')

    .alias('tt', 'teamstitle')
    .default('teamstitle', 'API CHANGED')
    .describe('teamstitle', 'Microsoft Teams message Title')


    .demandOption(['ip'])
    .help('h')
    .argv;

const inputFile = argv['ip'];
const debug = argv['d'];
const enumPath = argv['pe'];
const interfacePath = argv['pi'];
const modelPath = argv['pm'];
const mockPath = argv['pmo'];

const singleLinePath = argv['slp'];

const enumPathSymbol = argv['pes'];
const interfacePathSymbol = argv['pis'];
const modelPathSymbol = argv['pms'];
const mockPathSymbol = argv['pmos'];

const mongoConnection = argv['mc'];
const mongoCollection = argv['mcol'];
const generateall = argv['gall'];

const compareType = argv['ct'];
const compareJSONSave = argv['cjs'];

const nameSpace = argv['ns'];

const teamsUrl = argv['tu'];
const teamsTitle = argv['teamstitle'];


const purgetarget = argv['pt'];
let rawFile;
let main;

const dataProcess = () => {
    const data = step1(rawFile, main, debug, singleLinePath, nameSpace);
    if (generateall === 'true') {
        step2(data, purgetarget, enumPath, interfacePath, modelPath, enumPathSymbol, interfacePathSymbol, modelPathSymbol, mockPath, mockPathSymbol);
        console.log('generate Finish');
    }
    if (compareType === 'mongo') {
        CompareMongo(mongoConnection, mongoCollection, data, teamsUrl, teamsTitle);
    } else if (compareType === 'json') {
        CompareJSON(compareJSONSave === 'true', data)
    } else {
        console.log('no compare');
    }
}


if ((inputFile.substr(0, 8) === 'https://') || (inputFile.substr(0, 7) === 'http://')) {
    request(inputFile, (err, res, body) => {
        rawFile = body.toString().split('\n');
        main = JSON.parse(body.toString());
        dataProcess();
    });
} else {
    rawFile = fs.readFileSync(inputFile, 'utf8').split('\r\n');
    main = fsExtra.readJsonSync(inputFile);
    dataProcess();
}





