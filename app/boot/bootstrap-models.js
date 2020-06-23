/**
 * @author vinay kumar
 */

const requireDir = require('require-dir')
const fs = require('fs')
const chalk = require('chalk')

class Models {
  // Refactor the code
  static init() {
    fs.readdirSync(`${__dirname}/../modules/`).forEach((module) => {
      const moduleFullPath = `${__dirname}/../modules/${module}`
      const stat = fs.lstatSync(moduleFullPath)
      if (stat.isDirectory() && fs.existsSync(`${moduleFullPath}/models`)) {
        // Check if models folder exists in module
        console.log(chalk.cyan(`\t Loaded models for the module: ${module}`))
        requireDir(`${__dirname}/../modules/${module}/models/`)
      }
    })
    return Promise.resolve('Success')
  }
}
module.exports = Models