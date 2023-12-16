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
    {
      type: 'input',
      name: 'projPath',
      message: "Project Path",
      default: '/Users/presidio/poc/template-creator'
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
      type: 'input',
      name: 'packageCount',
      message: "How many pacakges need to be created??",
    }, 
    PACAKGE_NAME: {
      type: 'input',
      name: 'packageName',
      message: "Please provide name for the pacakges",
    },
  }
}

export default QUESTIONS;