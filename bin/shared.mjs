import inquirer from 'inquirer';
import ROOT_TEMPLATE from './constants/template.mjs'
import QUESTIONS from './constants/question.mjs';
import * as fs from 'fs';
import * as exe from 'child_process';
import ora from 'ora';

var output = [];
var packageCount = 0;
var projectName = "";
const spinner = ora();

// ask package from user
const getNeedPackage = () => {
    return inquirer
        .prompt(QUESTIONS.NEED_PACKAGE)
}

// ask project name from user fro package creation
const getProjectName = () => {
    return inquirer
        .prompt(QUESTIONS.GET_PROJECT_DETAILS)
}

// update project name
const updateProjectName = (projName) => {
    projectName = projName;
}

// creates package
const createPacakges = async (projectName) => {
    if (projectName == null) {
        console.log("Going with package creation flow")
        let projectDetails = await getProjectName().then((res) => res)
        updateProjectName(projectDetails.projName)
        createPacakgeFolder();
    } else {
        console.log("Going with project creation flow")
        let needPackage = await getNeedPackage().then((res) => res.needPackage)
        if (needPackage === 'withPackage') {
            updateProjectName(projectName);
            createPacakgeFolder();
        }
    }
}

const updateGitignore = (projectName, lineToAdd) => {
    fs.readFile(`${projectName}/.gitignore`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const newData = `${data.trim()}\n${lineToAdd}\n`;

        fs.writeFile(`${projectName}/.gitignore`, newData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

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
    startLoader("Creating Packages and Mappings.")
    exe.exec(`flutter create --template=package ${packageName}`, { cwd: `${projectName}/packages` }, (error, stdout, stderr) => {
        if (stdout) {
            fileWriter(`./${projectName}/pubspec.yaml`, 'dependencies:', `\n  ${packageName}:\n    path: packages/${packageName}\n`);
            createFiles('child', `${projectName}/packages/${packageName}`, packageName);
            writeIntoConfig(packageName, `packages/${packageName}`)
            completeLoader("Packages created.")
            console.log(`after cd ${stdout}`)
        }
        askPacakgeName();
    })
}

// search and update file content
const fileWriter = (pubspecPath, searchTerm, contentToWrite) => {
    fs.readFile(pubspecPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        const dependenciesEndIndex = data.indexOf(searchTerm) + searchTerm.length;

        if (dependenciesEndIndex !== -1) {
            const modifiedContent = data.slice(0, dependenciesEndIndex) +
                contentToWrite +
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

// creates folder and file structures in parent and packages
const createFiles = (type, path, packageName) => {
    ROOT_TEMPLATE.forEach((folder) => {
        if (folder.type === type) {
            exe.exec(`mkdir ${folder.folderName}`, { cwd: `${path}/${folder.path}` }, (error, stdout, stderr) => {
                if (stdout)
                    console.log(`after cd ${stdout}`)
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

const writeIntoConfig = (packageName, packagePath) => {
    const config = JSON.parse(fs.readFileSync('sam/.config/package.config.json', 'utf8'));

    config.packages = config.packages.concat({
        "name": packageName,
        "path": packagePath,
    })

    fs.writeFileSync('sam/.config/package.config.json', JSON.stringify(config, null, 2))
}

const startLoader = (loaderText) => {
    spinner.start(loaderText)
}

const completeLoader = (loaderText) => {
    spinner.succeed(loaderText);
}

const errorLoader = (loaderText) => {
    spinner.fail(loaderText);
}

export { createPacakges, createFiles, startLoader, completeLoader, errorLoader, updateGitignore }