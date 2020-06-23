/**
 * Created by sridharrajs.
 */

const chalk = require('chalk')
const dotenv = require('dotenv').config()
const config = require('./config')
require('module-alias/register')

const args = process.argv.slice(2)

if (args[0] !== 'heroku' && dotenv.error) {
  console.trace(chalk.red('.env file is missing'))
  process.exit(0)
}

const HOST_ENVIRONMENT = process.env.NODE_ENV || 'local'
const { MY_SECRET } = process.env

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
    const connectionFactory = require('./app/boot/connection-factory')
    return connectionFactory.connect(config)
  })
  .then(info => {
    console.log('Connecting DB ', chalk.blue(info))
    const models = require('./app/boot/bootstrap-models')
    return models.init()
  })
  .then(info => {
    console.log('Initializing DB ', chalk.blue(info))
    const appServer = require('./app/boot/build-server')
    return appServer.start(config)
  })
  .then(info => {
    console.log(
      `Starting Server at ${chalk.green(config.port)}`,
      chalk.blue(info)
    )
  })
  .catch(error => {
    console.trace(chalk.red(error))
    console.trace(chalk.red(error.message))
    process.exit(0)
  })

process.on('uncaughtException', error => {
  console.trace(error.stack)
})
