const MailSender = require('./src/MailSender')
const yargs = require('yargs/yargs')
const {
    hideBin
} = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).parse()
// init sender
let mailSender = new MailSender()


// send mail 
mailSender.sendMail(argv.data)