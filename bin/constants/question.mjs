const QUESTIONS = {
  NEED_TEMPLATE: [
    {
      type: 'expand',
      message: 'Need to create project with template??',
      name: 'needTemplate',
      default: 'y',
      choices: [
        {
          key: 'y',
          name: 'Yes',
          value: 'createWithTemp',
        },
        {
          key: 'n',
          name: 'No',
          value: 'createWithoutTemp',
        }
      ],
    },
  ],
  GET_PROJECT_DETAILS: [
    {
      type: 'input',
      name: 'projName',
      message: "Project Name",
      default: 'sam'
    },
  ],
  NEED_PACKAGE: [
    {
      type: 'expand',
      message: 'Need to create pacakges for this template??',
      name: 'needPackage',
      default: 'y',
      choices: [
        {
          key: 'y',
          name: 'Yes',
          value: 'withPackage',
        },
        {
          key: 'n',
          name: 'No',
          value: 'noPacakge',
        }
      ],
    },
  ],
  GET_PACKAGE_DETAILS: {
    PACKAGE_COUNT: {
      type: 'number',
      name: 'packageCount',
      default: 1,
      message: "How many pacakges need to be created??",
    }, 
    PACAKGE_NAME: {
      type: 'input',
      name: 'packageName',
      message: "Please provide name for the pacakges",
    },
  },
  GET_DEPENDENCY: {
    type: 'input',
    name: 'depedency',
    message: 'Enter depedency name to install',
  },
  SELECT_PACKAGE: (subfolders) => ({
    type: 'checkbox',
    name: 'packages',
    message: 'Select one or more pacakges to install dependencies',
    choices: subfolders,
  }),
}

export default QUESTIONS;