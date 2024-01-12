#!/usr/bin/env node

import inquirer from 'inquirer';
import QUESTIONS from './constants/question.mjs';
import ROOT_TEMPLATE from './constants/template.mjs'
import * as fs from 'fs';
import * as exe from 'child_process';

var output = [];
var packageCount = 0;
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
                        console.log(`inside create file => ${type} === ${path} `)
                        fs.writeFileSync(`${path}/${file.path}/${file.fileName}`, file.content, 'utf-8');
                        if(folder.type === 'child') {
                            console.log("inside child check")
                            if(packageName != null) {
                                console.log("inside child package name not null")
                                exportPackageFiles(`${path}/lib/${packageName}.dart`,`${file.exportFrom}/${file.fileName}`, packageName)
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
            createPacakges();
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

// ask package from user
const getNeedPackage = () => {
    return inquirer
        .prompt(QUESTIONS.NEED_PACKAGE)
}

// creates package
const createPacakges = async () => {
    let needPackage = await getNeedPackage().then((res) => res.needPackage)
    if (needPackage) {
        createPacakgeFolder();
    }
}

// creates packages folder
const createPacakgeFolder = () => {
    exe.exec(`mkdir ${projectName}/packages`, (error, stdout, stderr) => {
        if (stdout)
            console.log(`after cd ${stdout}`);
        inquirer.prompt(QUESTIONS.GET_PACKAGE_DETAILS.PACKAGE_COUNT).then((answers) => {
            packageCount = answers.packageCount;
            askPacakgeName()
        });
    })

}

// ask package name from user
const askPacakgeName = () => {
    if (output.length != packageCount) {
        inquirer.prompt(QUESTIONS.GET_PACKAGE_DETAILS.PACAKGE_NAME).then((answers) => {
            output.push(answers.packageName)
            createPacakge(answers.packageName)
        });
    }
}

// creates packages under package folder
const createPacakge = (packageName) => {
    exe.exec(`flutter create --template=package ${packageName}`, { cwd: `${projectName}/packages` }, (error, stdout, stderr) => {
        if (stdout) {
            declareInRootPubSpec(`./${projectName}/pubspec.yaml`, `${packageName}` ,`packages/${packageName}`);
            createFiles('child', `${projectName}/packages/${packageName}`, packageName);
            console.log(`after cd ${stdout}`)
        }
        askPacakgeName();
    })
}

const declareInRootPubSpec = (pubspecPath, packageName, packagePath) => {
    console.log("PUBSPEC PATH => ", pubspecPath)
    fs.readFile(pubspecPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        const dependenciesEndIndex = data.indexOf('dependencies:') + 'dependencies:'.length;

        if (dependenciesEndIndex !== -1) {
            const modifiedContent = data.slice(0, dependenciesEndIndex) +
                `\n  ${packageName}:\n    path: ${packagePath}\n` +
                data.slice(dependenciesEndIndex);

            fs.writeFile(pubspecPath, modifiedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${err.message}`);
                } else {
                    console.log('Line inserted successfully.');
                }
            });
        }
    });
}

const exportPackageFiles = (rootFilePath, needToExport, packageName) => {
    console.log("PUBSPEC PATH => ", rootFilePath)
    fs.readFile(rootFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        const dependenciesEndIndex = data.indexOf(`library ${packageName};`) + `library ${packageName};`.length;

        if (dependenciesEndIndex !== -1) {
            const modifiedContent = data.slice(0, dependenciesEndIndex) +
                `\nexport "${needToExport}";` +
                data.slice(dependenciesEndIndex);

            fs.writeFile(rootFilePath, modifiedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${err.message}`);
                } else {
                    console.log('Line inserted successfully.');
                }
            });
        }
    });
}




wrapper();