#!/usr/bin/env node
import * as fs from 'fs';
import inquirer from 'inquirer';
import * as exe from 'child_process';
import QUESTIONS from './constants/question.mjs';
import { errorLoader, completeLoader, startLoader } from './shared.mjs';
import { APP_CONSTANT } from './constants/app.contant.mjs';

// get package list
const getPackages = (packagePath) => {
    if (fs.existsSync('.config/package.config.json')) {
        const config = JSON.parse(fs.readFileSync('.config/package.config.json', 'utf8'));
        if (config.packages.length === 0) {
            return [];
        } else {
            return config.packages.map(packag => packag.name)
        }
    } else {
        errorLoader("Please navigate to project root folder and try again.")
        return null;
    }
}

// select package to install/delete dependency
const processDependency = async (operationType) => {
    const folderPath = 'packages';
    const packages = getPackages(folderPath);
    if (packages != null) {
        if (packages.length === 0) {
            errorLoader('No packages found. Please move to projrct root folder!');
            return;
        }

        const selectedPackages = await inquirer.prompt(QUESTIONS.SELECT_PACKAGE(packages));
        performDependencyAction(selectedPackages.packages, operationType)
    } else {
        return;
    }
}

// get name of the dependency to install/delete
const getDependency = async (operationType) => {
    switch (operationType) {
        case APP_CONSTANT.DEPENDENCY_OPERATION.INSTALL:
            return inquirer.prompt(QUESTIONS.GET_DEPENDENCY);
        case APP_CONSTANT.DEPENDENCY_OPERATION.REMOVE:
            return inquirer.prompt(QUESTIONS.REMOVE_DEPENDENCY);
        default:
            break;
    }
    
}


// install/delete the dependency
const performDependencyAction = async (selectedPackages, operationType) => {
    const depedencyName = await getDependency(operationType).then((data) => data.depedency);
    for (let packageIndex in selectedPackages) {
        startLoader(`${APP_CONSTANT.LOADER_MESSAGE[operationType]} ${depedencyName} on package ${selectedPackages[packageIndex]}!!`)
        exe.exec(`${APP_CONSTANT.DEPENDENCY_COMMANDS[operationType]} ${depedencyName}`, { cwd: `packages/${selectedPackages[packageIndex]}` }, (error, stdout, stderr) => {
            if(stderr.includes('not found in pubspec.yaml!')) {
                errorLoader(`Package "${depedencyName}" on ${selectedPackages[packageIndex]} not found!!`)
            } else if(error !== null) {
                errorLoader(error.message);
            } else {
                completeLoader(`Package successfully ${APP_CONSTANT.PRINT_MESSAGE[operationType]} on ${selectedPackages[packageIndex]}`)
            }
        })
    }
}

export { processDependency }