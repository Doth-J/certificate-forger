#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_forge_1 = __importDefault(require("node-forge"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const commander_1 = require("commander");
function generateRSACertificate(size, attributes, altNameIPs, altNameURIs, validityDays) {
    const keys = node_forge_1.default.pki.rsa.generateKeyPair(size);
    const certificate = node_forge_1.default.pki.createCertificate();
    certificate.publicKey = keys.publicKey;
    certificate.serialNumber = '01' + crypto_1.default.randomBytes(19).toString('hex');
    certificate.validity.notBefore = new Date();
    certificate.validity.notAfter = new Date(new Date().getTime() + 1000 * 3600 * 24 * (validityDays !== null && validityDays !== void 0 ? validityDays : 1));
    certificate.setSubject(attributes);
    certificate.setIssuer(attributes);
    certificate.setExtensions([{
            name: 'subjectAltName',
            altNames: [
                ...(altNameURIs !== undefined ?
                    altNameURIs.map((uri) => ({ type: 6, value: uri })) :
                    []),
                ...(altNameIPs !== undefined ?
                    altNameIPs.map((uri) => ({ type: 7, ip: uri })) :
                    [])
            ]
        }]);
    certificate.sign(keys.privateKey);
    return {
        certificate: node_forge_1.default.pki.certificateToPem(certificate),
        privateKey: node_forge_1.default.pki.privateKeyToPem(keys.privateKey)
    };
}
// Prompts Question Setup
function keySize() {
    return __awaiter(this, void 0, void 0, function* () {
        const sizeQuestion = {
            type: 'autocomplete',
            name: 'size',
            message: 'RSA Modulus Size',
            choices: [
                { title: '1024' },
                { title: '2048' },
                { title: '4096' },
            ]
        };
        return yield (0, prompts_1.default)(sizeQuestion);
    });
}
function attributeList() {
    return __awaiter(this, void 0, void 0, function* () {
        const attributeQuestions = [
            {
                type: 'list',
                name: 'attributes',
                message: 'Certificate Attibutes: (commonName=example.com)',
                separator: ','
            },
            {
                type: 'confirm',
                name: 'more',
                message: 'Add more attributes?',
                initial: false
            }
        ];
        let attrAns = yield (0, prompts_1.default)(attributeQuestions);
        while (attrAns.more) {
            let temp = yield (0, prompts_1.default)(attributeQuestions);
            temp.attributes.push(...attrAns.attributes);
            attrAns = temp;
        }
        return attrAns.attributes.map((attribute) => {
            const parts = attribute.split('=');
            const final = { value: parts[1] };
            parts[0].startsWith('*') ?
                Object.assign(final, { shortName: parts[0].substring(1), type: parts[0].substring(1) }) :
                Object.assign(final, { name: parts[0], type: parts[0] });
            return final;
        });
    });
}
function alternativesList() {
    return __awaiter(this, void 0, void 0, function* () {
        const altQuestions = [
            {
                type: 'list',
                name: 'altIPs',
                message: 'Alternative IPs:',
                initial: '',
                separator: ','
            },
            {
                type: 'list',
                name: 'altURIs',
                message: 'Alternative URIs:',
                initial: '',
                separator: ','
            }
        ];
        const alternatives = yield (0, prompts_1.default)(altQuestions);
        if (alternatives.altIPs.length == 1 && alternatives.altIPs[0] == '') {
            alternatives.altIPs = [];
        }
        if (alternatives.altURIs.length == 1 && alternatives.altURIs[0] == '') {
            alternatives.altURIs = [];
        }
        return alternatives;
    });
}
function outputLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        const outputLocation = {
            type: 'text',
            name: 'output',
            message: 'Output Location:',
            initial: path_1.default.join(process.cwd(), 'certificates')
        };
        return yield (0, prompts_1.default)(outputLocation);
    });
}
function createCertificate(setup) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = {};
        Object.assign(config, yield keySize());
        Object.assign(config, { attributes: yield attributeList() });
        if (setup.alt)
            Object.assign(config, yield alternativesList());
        const certificate = generateRSACertificate(Number.parseInt(config.size), config.attributes, config.altIPs, config.altURIs);
        if (setup.out) {
            Object.assign(config, yield outputLocation());
            fs_1.default.access(config.output, (err) => {
                if (err) {
                    fs_1.default.mkdirSync(config.output);
                }
                fs_1.default.writeFileSync(path_1.default.join(config.output, 'cert.pem'), certificate.certificate);
                fs_1.default.writeFileSync(path_1.default.join(config.output, 'pkey.pem'), certificate.privateKey);
            });
        }
        if (setup.log)
            console.log(certificate);
    });
}
// Commander CLI Tool Implementation
commander_1.program.name('cforge')
    .description('Generate X.509 PEM certificates using node-forge')
    .version(JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'package.json')).toString()).version)
    .summary('X.509 Certificate Generation Utility')
    .option('-a,--alt', 'Enable alternatives option', false)
    .option('-o,--out', 'Output certificate to file', false)
    .option('-l,--log', 'Log certificate to console', true)
    .action((_, command) => __awaiter(void 0, void 0, void 0, function* () { return yield createCertificate(command.opts()); }))
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse();
