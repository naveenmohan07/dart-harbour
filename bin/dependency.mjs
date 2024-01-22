#!/usr/bin/env node
import * as fs from 'fs';
import inquirer from 'inquirer';
import * as exe from 'child_process';
import QUESTIONS from './constants/question.mjs';
import { errorLoader, completeLoader } from './shared.mjs';

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

// select package to install dependency
const selectPackage = async () => {
    const folderPath = 'packages';
    const packages = getPackages(folderPath);
    console.log("inside package check => ", packages)
    if (packages != null) {
        console.log("inside package ", packages)
        if (packages.length === 0) {
            errorLoader('No packages found. Please move to projrct root folder!');
            return;
        }

        const selectedPackages = await inquirer.prompt(QUESTIONS.SELECT_PACKAGE(packages));
        installDependency(selectedPackages.packages)
    } else {
        return;
    }
}

// get name of the dependency to install
const getDependency = async () => {
    return inquirer.prompt(QUESTIONS.GET_DEPENDENCY);
}


// install the dependency
const installDependency = async (selectedPackages) => {
    const depedencyName = await getDependency().then((data) => data.depedency);
    for (let packageIndex in selectedPackages) {
        exe.exec(`flutter pub add ${depedencyName}`, { cwd: `packages/${selectedPackages[packageIndex]}` }, (error, stdout, stderr) => {
            completeLoader(`Package successfully installed on ${selectedPackages[packageIndex]}`)
        })
    }
}


export { selectPackage }