const { defineConfig } = require("cypress");
const afterRun = require("./cypress/plugins/afterRun");

module.exports = defineConfig({
  projectId: 'k93ovz',
  downloadsFolder: 'cypress/downloads',
  video: true,

  env: {
    BUPA_USER: '18116826-9',
    BUPA_PASS: 'Jaime19921992',
    BUPA_BASE_URL: 'https://portalpaciente.bupa.cl',
  },

  e2e: {
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    allowCypressEnv: true,

    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.args.push('--disable-gpu');
        launchOptions.args.push('--disable-software-rasterizer');
        launchOptions.args.push('--no-sandbox');
        launchOptions.args.push('--disable-dev-shm-usage');
        return launchOptions;
      });

      on('after:run', afterRun);
    },
  },
});
