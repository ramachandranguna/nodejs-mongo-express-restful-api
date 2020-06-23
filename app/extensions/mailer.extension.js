/**
 * Created by ramachandrang.
 */

const moment = require('moment')
const mailgun = require('mailgun-js')
const Config = require('../../config')

const mg = mailgun({ apiKey: Config.MG_API_KEY, domain: Config.MG_DOMAIN })

const { mailerLogger } = require('../../logger')

const sendEmail = async (mailObj, template) => {
  const data = {
    from: Config.EMAILS.NOTIFICATIONS,
    to: mailObj.to,
    subject: mailObj.subject,
    template: template,
    'h:X-Mailgun-Variables': mailObj.variables, // { test: 'test' },
  }

  if (Config.shouldSendEmail()) {
    mailerLogger.info(
      `${moment().format(
        'dddd, MMMM Do YYYY, h:mm:ss a'
      )} Mailer Triggering template ${template}`
    )
    mg.messages().send(data, function(error, body) {
      console.log(error, body)
      if (error) {
        mailerLogger.error(
          `${moment().format(
            'dddd, MMMM Do YYYY, h:mm:ss a'
          )} Mailgun Error ${JSON.stringify(error)}`
        )
        return
      }
      mailerLogger.info(
        `${moment().format(
          'dddd, MMMM Do YYYY, h:mm:ss a'
        )} Mailgun Response ${JSON.stringify(body)}`
      )
    })
  } else {
    console.log(`Ignnored sending mail. ::: ${template}`)
  }
}

module.exports = {
  sendEmail,
}
