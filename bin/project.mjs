import inquirer from 'inquirer';
import QUESTIONS from './constants/question.mjs';
import ROOT_TEMPLATE from './constants/template.mjs'
import * as fs from 'fs';
import * as exe from 'child_process';
import { createPacakges, startLoader, completeLoader, updateGitignore, errorLoader } from './shared.mjs';

var projectName = '';

const checkFlutter = () => {
    exe.exec('which flutter', (error, stdout, stderr) => {
        if (stdout)
            wrapper();
        if (error)
            errorLoader("Flutter not install in your machine")
    });
}

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
        if (folder.type === type) {
            exe.exec(`mkdir ${folder.folderName}`, { cwd: `${path}/${folder.path}` }, (error, stdout, stderr) => {
                if (folder.files != null) {
                    folder.files.forEach((file) => {
                        fs.writeFileSync(`${path}/${file.path}/${file.fileName}`, file.content, 'utf-8');
                        if (folder.type === 'child') {
                            if (packageName != null) {
                                fileWriter(`${path}/lib/${packageName}.dart`, `library ${packageName};`, `\nexport "${file.exportFrom}/${file.fileName}";`)
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
    if (!fs.existsSync(`${projDetails.projName}`)) {
        startLoader("Creating Flutter Project.")
        exe.exec(`flutter create ${projDetails.projName}`, (error, stdout, stderr) => {
            if (stdout)
                completeLoader("Project created");
                createFiles('root', projectName);
                updateGitignore(projectName, ".config");
                createPacakges(projectName);
            if (error)
                errorLoader(`flutter create - error: ${error}`);
            if (stderr)
                errorLoader(`flutter create - stderr: ${stderr}`);
        });

    } else {
        completeLoader("Project already exist");
        createPacakges(projectName);
    }
}

// creates default flutter project
const createWithoutTemplate = async () => {
    let projDetails = await inquirer.prompt(QUESTIONS.GET_PROJECT_DETAILS).then((name) => name);
    if (!fs.existsSync(`${projDetails.projName}`)) {
        exe.exec("cd ", (error, stdout, stderr) => {
            if (error) {
                errorLoader(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                errorLoader(`stderr: ${stderr}`);
                return;
            }
        });
    }
}

export { checkFlutter }