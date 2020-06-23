/* eslint-disable strict */
/**
 * Created by ramachandrang.
 */

const chalk = require('chalk')
const dotenv = require('dotenv').config()
const requireDir = require('require-dir')
const config = require('../../config')

if (dotenv.error) {
  console.trace(chalk.red('.env file is missing'))
  process.exit(0)
}

const HOST_ENVIRONMENT = process.env.NODE_ENV || 'local'
const MY_SECRET = process.env.MY_SECRET || ''

/**
 *
 * @return Promise {*}
 */
function moduleSeeder() {
  const modules = process.argv.slice(2)
  const p = []
  modules.forEach(module => {
    const dir = requireDir(`${__dirname}/../modules/${module}/seeds`)
    Object.values(dir).forEach(Item => {
      const instance = new Item()
      p.push(instance.run())
    })
  })
  return Promise.all(p)
}

config
  .isValidEnv(HOST_ENVIRONMENT)
  .then(info => {
    console.log('Checking Environment ', chalk.blue(info))
    return config.isSecretSet(MY_SECRET)
  })
  .then(info => {
    console.log('Checking tokens ', chalk.blue(info))
    return config.init(HOST_ENVIRONMENT)
  })
  .then(info => {
    console.log('Initializing settings ', chalk.blue(info))
    const connectionFactory = require('../../app/boot/connection-factory')
    return connectionFactory.connect(config)
  })
  .then(info => {
    console.log('Connecting DB ', chalk.blue(info))
    const models = require('../../app/boot/bootstrap-models')
    return models.init()
  })
  .then(info => {
    console.log('Initialized models ', chalk.blue(info))
    return moduleSeeder()
  })
  .then(info => {
    console.log(info)
    process.exit(0)
  })
  .catch(error => {
    console.trace(chalk.red(error.message))
    process.exit(0)
  })
