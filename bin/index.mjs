#!/usr/bin/env node

import inquirer from 'inquirer';
import QUESTIONS from './constants/question.mjs';
import * as fs from 'fs';
import * as exe from 'child_process';

var output = [];
var packageCount = 0;
var projectPath = '';
var projectName = '';


async function wrapper() {

    let needTemplate = await getNeedTemplate().then((res) => res.needTemplate)

    if (needTemplate === 'createWithTemp') {
        createWithTemplate();
    } else {
        createWithoutTemplate();
    }

}

// get input from user for template
const getNeedTemplate = () => {
    console.log("will create with persona and package module");
    return inquirer
        .prompt(QUESTIONS.NEED_TEMPLATE)
}

const createWithTemplate = async () => {
    let projDetails = await inquirer.prompt(QUESTIONS.GET_PROJECT_DETAILS).then((name) => name);
    projectPath = projDetails.projPath;
    projectName = projDetails.projName;
    console.log("Create with template", projectPath + projectName)
    if (!fs.existsSync(`${projDetails.projPath}/${projDetails.projName}`)) {
        console.log("Create with template - inside if");
        exe.exec(`flutter create ${projDetails.projName}`, { cwd: `${projDetails.projPath}` }, (error, stdout, stderr) => {
            if (stdout)
                console.log(`flutter create: ${stdout}`);
            if (error)
                console.log(`flutter create - error: ${error}`);
            if (stderr)
                console.log(`flutter create - stderr: ${stderr}`);
        });

    } else {
        console.log(`project already exists`);
        createPacakges();
    }

}

const createWithoutTemplate = async () => {
    let projDetails = await inquirer.prompt(QUESTIONS.GET_PROJECT_DETAILS).then((name) => name);
    console.log("Create with template", projDetails)
    if (!fs.existsSync(`${projDetails.projPath}/${projDetails.projName}`)) {

        exe.exec("cd ", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}

const getNeedPackage = () => {
    return inquirer
        .prompt(QUESTIONS.NEED_PACKAGE)
}

const createPacakges = async () => {
    console.log("Inside create package")

    let needPackage = await getNeedPackage().then((res) => res.needPackage)
    if (needPackage) {
        createPacakgeFolder();
    }
}

const createPacakgeFolder = () => {

    exe.exec('mkdir packages', { cwd: `${projectPath}/${projectName}` }, (error, stdout, stderr) => {
        if (stdout)
            console.log(`after cd ${stdout}`);
        inquirer.prompt(QUESTIONS.GET_PACKAGE_DETAILS.PACKAGE_COUNT).then((answers) => {
            console.log("need to ask")
            packageCount = answers.packageCount;
            askPacakgeName()
        });
    })

}

const askPacakgeName = () => {

    if (output.length != packageCount) {
        inquirer.prompt(QUESTIONS.GET_PACKAGE_DETAILS.PACAKGE_NAME).then((answers) => {
            output.push(answers.packageName)
            createPacakge(answers.packageName)
            askPacakgeName();
        });
    }
}


const createPacakge = (packageName) => {
    if (!fs.existsSync(`${projectPath}/${projectName}/packages/${packageName}`)) {

        exe.exec(`flutter create --template=package ${packageName}`, { cwd: `${projectPath}/${projectName}/packages` }, (error, stdout, stderr) => {
            if (stdout)
                console.log(`after cd ${stdout}`)

        })
    } else {
        console.log("Package already exists")
    }
}


wrapper();