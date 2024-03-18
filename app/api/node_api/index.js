const MailSender = require('./src/MailSender')
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const {handleProcess} = require('./src/dropshandler')
const argv = yargs(hideBin(process.argv)).parse()

//decode the data
let data = JSON.parse(Buffer.from(argv.data, 'base64').toString('utf-8'))


switch (data.action) {
    case 'executeProcessAction':
        // Since handleProcess returns a promise, you should handle it using async/await or .then()
        handleProcess(data)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        break;
    case 'proceedSend':
        console.log("proceedSend");
        // Uncomment below lines if you want to use MailSender
        // const mailSender = new MailSender();
        // mailSender.sendMail(argv.data);
        break;
    default:
        break;
}