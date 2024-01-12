#!/usr/bin/env node

import inquirer from 'inquirer';
import QUESTIONS from './constants/question.mjs';
import ROOT_TEMPLATE from './constants/template.mjs'
import * as fs from 'fs';
import * as exe from 'child_process';
import { createPacakges } from './shared.mjs';


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
    return inquirer
        .prompt(QUESTIONS.NEED_TEMPLATE)
}

// creates folder and file structures in parent and packages
const createFiles = (type, path, packageName) => {
    ROOT_TEMPLATE.forEach((folder) => {
        if(folder.type === type) {
            exe.exec(`mkdir ${folder.folderName}`, { cwd: `${path}/${folder.path}` }, (error, stdout, stderr) => {
                if (stdout)
                    console.log(`after cd ${stdout}`)
                if(folder.files != null) {
                  folder.files.forEach((file) => {
                        fs.writeFileSync(`${path}/${file.path}/${file.fileName}`, file.content, 'utf-8');
                        if(folder.type === 'child') {
                            if(packageName != null) {
                                fileWriter(`${path}/lib/${packageName}.dart`,`library ${packageName};`,`\nexport "${file.exportFrom}/${file.fileName}";`)
                            }                            
                        }
                   })
                }
            })
        }
    })
}

// creates flutter project with custom template
const createWithTemplate = async () => {
    let projDetails = await inquirer.prompt(QUESTIONS.GET_PROJECT_DETAILS).then((name) => name);
    projectName = projDetails.projName;
    console.log("Create with template", fs.existsSync(`${projDetails.projName}`))
    if (!fs.existsSync(`${projDetails.projName}`)) {
        console.log("Create with template - inside if");
        exe.exec(`flutter create ${projDetails.projName}`, (error, stdout, stderr) => {
            if (stdout)
                console.log(`flutter create: ${stdout}`);
                createFiles('root', projectName);
            createPacakges(projectName);
            if (error)
                console.log(`flutter create - error: ${error}`);
            if (stderr)
                console.log(`flutter create - stderr: ${stderr}`);
        });

    } else {
        console.log(`project already exists`);
        createPacakges(projectName);
    }

}

// creates default flutter project
const createWithoutTemplate = async () => {
    let projDetails = await inquirer.prompt(QUESTIONS.GET_PROJECT_DETAILS).then((name) => name);
    if (!fs.existsSync(`${projDetails.projName}`)) {
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

wrapper();