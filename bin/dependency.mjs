#!/usr/bin/env node
import * as fs from 'fs';
import inquirer from 'inquirer';
import * as exe from 'child_process';
import QUESTIONS from './constants/question.mjs';

// get package list
const getPackages = (packagePath) => {
    if (fs.existsSync(packagePath)) {
        return fs.readdirSync(packagePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } else {
        return [];
    }
}

// select package to install dependency
const selectPackage = async () => {
    const folderPath = 'packages';
    const packages = getPackages(folderPath);

    if (packages.length === 0) {
        console.log('No packages found. Please move to projrct root folder!');
        return;
    }

    const selectedPackages = await inquirer.prompt(QUESTIONS.SELECT_PACKAGE(packages));
    installDependency(selectedPackages.packages)
}

// get name of the dependency to install
const getDependency = async () => {
    return inquirer.prompt(QUESTIONS.GET_DEPENDENCY);
}


// install the dependency
const installDependency = async (selectedPackages) => {
    const depedencyName = await getDependency().then((data) => data.depedency);
    for(let packageIndex in selectedPackages) {
        exe.exec(`flutter pub add ${depedencyName}`, {cwd: `packages/${selectedPackages[packageIndex]}`}, (error, stdout, stderr) => {
            console.log("Package successfully installed on", selectedPackages[packageIndex])
        })
    }
}


selectPackage();