#! /usr/bin/env node
import forge from "node-forge";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import prompts, { PromptObject } from "prompts";
import {program,OptionValues} from "commander";

// Node-forge Certificate Creation

interface CertificateAttribute {
    name?:string,
    shortName?:string,
    value:string,
}
function generateRSACertificate(
    size: number,
    attributes: CertificateAttribute[],
    altNameIPs?:string[],
    altNameURIs?:string[],
    validityDays?:number
){
    const keys = forge.pki.rsa.generateKeyPair(size);
    const certificate = forge.pki.createCertificate();
    certificate.publicKey = keys.publicKey;
    certificate.serialNumber = '01'+crypto.randomBytes(19).toString('hex');
    certificate.validity.notBefore = new Date();
    certificate.validity.notAfter = new Date(new Date().getTime() +1000 *3600 * 24 * (validityDays ?? 1))
    certificate.setSubject(attributes);
    certificate.setIssuer(attributes);
    certificate.setExtensions([{
		name: 'subjectAltName',
		altNames: [
			...(altNameURIs !== undefined ?
				altNameURIs.map((uri) => ({type: 6, value: uri})) :
				[]
			),
			...(altNameIPs !== undefined ?
				altNameIPs.map((uri) => ({type: 7, ip: uri})) :
				[]
			)
		]
	}]);
    certificate.sign(keys.privateKey);
    return{
        certificate:forge.pki.certificateToPem(certificate),
        privateKey:forge.pki.privateKeyToPem(keys.privateKey)
    } 
}

// Prompts Question Setup

async function keySize(){
    const sizeQuestion:PromptObject = {
        type:'autocomplete',
        name:'size',
        message:'RSA Modulus Size',
        choices:[
            {title:'1024'},
            {title:'2048'},
            {title:'4096'},
            {title:'8192'},
        ]
    }
    return await prompts(sizeQuestion);
}
async function attributeList(){
    const attributeQuestions:PromptObject[] = [
        {
            type:'list',
            name:'attributes',
            message:'Certificate Attibutes: (commonName=example.com)',
            separator:','
        },
        {
            type:'confirm',
            name:'more',
            message:'Add more attributes?',
            initial:false
        }
    ]
    let attrAns = await prompts(attributeQuestions);
    while(attrAns.more){
        let temp = await prompts(attributeQuestions);
        temp.attributes.push(...attrAns.attributes);
        attrAns = temp;
    }
    return attrAns.attributes.map((attribute:string)=>{
        const parts = attribute.split('=')
        const final = {value:parts[1]}; 
        parts[0].startsWith('*') ?
        Object.assign(final,{shortName:parts[0].substring(1),type:parts[0].substring(1)}) :
        Object.assign(final,{name:parts[0],type:parts[0]});
        return final;
    })
}
async function alternativesList(){
    const altQuestions:PromptObject[] = [
        {
            type:'list',
            name:'altIPs',
            message:'Alternative IPs:',
            initial:'',
            separator:','
        },
        {
            type:'list',
            name:'altURIs',
            message:'Alternative URIs:',
            initial:'',
            separator:','
        }
    ]
    const alternatives = await prompts(altQuestions)
    if(alternatives.altIPs.length==1 && alternatives.altIPs[0] == ''){
        alternatives.altIPs = [];
    }
    if(alternatives.altURIs.length==1 && alternatives.altURIs[0] == ''){
        alternatives.altURIs = [];
    }
    return alternatives;
}
async function outputLocation(){
    const outputLocation: PromptObject = {
        type:'text',
        name:'output',
        message:'Output Location:',
        initial: path.join(process.cwd(),'certificates')
    }
    return await prompts(outputLocation);
}
async function createCertificate(setup:OptionValues){
    let config:any = {};
    Object.assign(config, await keySize());
    Object.assign(config, {attributes:await attributeList()});
    if (setup.alt) Object.assign(config, await alternativesList());
    const certificate = generateRSACertificate(
        Number.parseInt(config.size),
        config.attributes,
        config.altIPs,
        config.altURIs
    )
    if (setup.out){
        Object.assign(config, await outputLocation());
        fs.access(config.output,(err)=>{
            if(err){
                fs.mkdirSync(config.output);
            }
            fs.writeFileSync(path.join(config.output,'cert.pem'),certificate.certificate);  
            fs.writeFileSync(path.join(config.output,'pkey.pem'),certificate.privateKey);  
        })
    }
    console.log(certificate);
}

// Commander CLI Tool Implementation

program.name('cforge')
    .description('Generate X.509 PEM certificates using node-forge')
    .version(JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json')).toString()).version)
    .summary('X.509 Certificate Generation Utility')
    .option('-a,--alt','Enable alternatives option',false)
    .option('-o,--out','Output certificate to file',false)
    .action(async(_,command)=>await createCertificate(command.opts()))
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse()

