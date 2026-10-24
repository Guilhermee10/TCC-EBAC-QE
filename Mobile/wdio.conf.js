import 'dotenv/config'
import { join } from 'node:path'
import allure from 'allure-commandline'

export const config = {
  runner: 'local',
  // Porta padrão do Appium Server
  port: 4723,

  specs: ['./test/specs/**/*.spec.js'],
  maxInstances: 1, // um emulador = um teste por vez

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'nightwatch-android-11',
      'appium:platformVersion': '11',
      // Só na máquina local: se o emulador não estiver ligado, o Appium liga sozinho.
      // Na CI (GitHub Actions define CI=true), o emulador é criado pela própria pipeline.
      ...(process.env.CI
        ? {}
        : {
          'appium:avd': 'nightwatch-android-11',
          'appium:avdArgs': '-gpu host',
          'appium:avdLaunchTimeout': 300000,
          'appium:avdReadyTimeout': 300000,
        }),
      'appium:app': join(process.cwd(), 'app', 'loja-ebac.apk'),
      'appium:appWaitActivity': 'com.woocommerce.android.ui.login.LoginActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
    },
  ],

  logLevel: 'error',
  // Tempo máximo para esperar um elemento aparecer (app remoto + emulador = paciência)
  waitforTimeout: 20000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,

  // O WebdriverIO liga e desliga o Appium sozinho (usando o Appium instalado no PC)
  services: [['appium', { command: 'appium' }]],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
      },
    ],
  ],

  // Tira um print sempre que um teste falha (vai para o relatório Allure)
  afterTest: async function (test, context, { passed }) {
    if (!passed) {
      await driver.takeScreenshot()
    }
  },

  // Ao final, gera o relatório HTML do Allure a partir dos resultados
  onComplete: function () {
    const erro = new Error('Não foi possível gerar o relatório Allure')
    const geracao = allure(['generate', 'allure-results', '--clean'])
    return new Promise((resolve, reject) => {
      const limite = setTimeout(() => reject(erro), 30000)
      geracao.on('exit', (codigo) => {
        clearTimeout(limite)
        if (codigo !== 0) return reject(erro)
        console.log('Relatório Allure gerado em ./allure-report')
        resolve()
      })
    })
  },
}
